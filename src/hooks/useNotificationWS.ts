import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  addNotification,
  clearNotifications,
  setWSConnectionStatus,
} from '../redux/feature/notification/notificationSlice';
import { NotificationPayload, UseNotificationWSReturn, WSMessage } from '../types/notification';

// WebSocket configuration constants
const WS_URL = import.meta.env.VITE_NOTIFICATION_WS_URL || 'wss://notify.kirjaswappi.fi/ws';
const MAX_RECONNECT_ATTEMPTS = 5;
const INITIAL_RECONNECT_DELAY = 1000; // 1 second
const MAX_RECONNECT_DELAY = 30000; // 30 seconds
const PING_INTERVAL = 30000; // 30 seconds

/**
 * Calculate exponential backoff delay for reconnection attempts
 * @param attempt - Current reconnection attempt number
 * @returns Delay in milliseconds
 */
const getReconnectDelay = (attempt: number): number => {
  return Math.min(INITIAL_RECONNECT_DELAY * Math.pow(2, attempt), MAX_RECONNECT_DELAY);
};

/**
 * Type guard to check if a message is a NotificationPayload
 * @param message - The parsed WebSocket message
 * @returns True if the message is a NotificationPayload
 */
const isNotificationPayload = (message: WSMessage): message is NotificationPayload => {
  return (
    typeof message === 'object' &&
    message !== null &&
    'UserID' in message &&
    'Title' in message &&
    'Message' in message &&
    'Time' in message
  );
};

/**
 * Type guard to check if a message is a ping message
 * @param message - The parsed WebSocket message
 * @returns True if the message is a ping message
 */
const isPingMessage = (message: WSMessage): message is { type: 'ping' } => {
  return (
    typeof message === 'object' && message !== null && 'type' in message && message.type === 'ping'
  );
};

/**
 * Custom hook for managing WebSocket connection to the notification service
 * Handles connection lifecycle, reconnection logic, and message processing
 *
 * @returns Object containing connection state information
 */
export const useNotificationWS = (): UseNotificationWSReturn => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.userInformation.id);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  /**
   * Clear all timers and intervals
   */
  const clearTimers = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
  };

  /**
   * Start ping interval to keep connection alive
   */
  const startPingInterval = () => {
    clearTimers();
    pingIntervalRef.current = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.send(JSON.stringify({ type: 'ping' }));
        } catch (error) {
          console.error('[NotificationWS] Error sending ping:', error);
        }
      }
    }, PING_INTERVAL);
  };

  /**
   * Handle incoming WebSocket messages
   * @param event - The WebSocket message event
   */
  const handleMessage = (event: MessageEvent) => {
    try {
      const message: WSMessage = JSON.parse(event.data);

      // Handle ping message
      if (isPingMessage(message)) {
        // Send pong response
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'pong' }));
        }
        return;
      }

      // Handle notification payload
      if (isNotificationPayload(message)) {
        // Validate payload structure
        if (!message.UserID || !message.Title || !message.Message || !message.Time) {
          console.error('[NotificationWS] Invalid notification payload structure:', message);
          return;
        }

        // Dispatch notification to Redux store
        dispatch(
          addNotification({
            userId: message.UserID,
            title: message.Title,
            message: message.Message,
            time: message.Time,
          }),
        );

        console.log('[NotificationWS] Notification received:', message.Title);
      }
    } catch (error) {
      console.error('[NotificationWS] Message parsing error:', error);
      // Continue operation - don't crash the app
    }
  };

  /**
   * Handle WebSocket connection open event
   */
  const handleOpen = () => {
    console.log('[NotificationWS] Connection established');
    setIsConnected(true);
    setReconnectAttempts(0);
    dispatch(setWSConnectionStatus('connected'));
    startPingInterval();
  };

  /**
   * Handle WebSocket connection close event
   * @param event - The close event
   */
  const handleClose = (event: CloseEvent) => {
    // console.log('[NotificationWS] Connection closed:', event.code, event.reason);
    setIsConnected(false);
    clearTimers();

    // Only attempt reconnection if user is still authenticated and close was not clean
    if (userId && !event.wasClean && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      const delay = getReconnectDelay(reconnectAttempts);
      // console.log(
      //   `[NotificationWS] Reconnecting in ${delay}ms (attempt ${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`,
      // );

      dispatch(setWSConnectionStatus('connecting'));

      reconnectTimeoutRef.current = setTimeout(() => {
        setReconnectAttempts((prev) => prev + 1);
      }, delay);
    } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('[NotificationWS] Max reconnection attempts reached');
      dispatch(setWSConnectionStatus('error'));
    } else {
      dispatch(setWSConnectionStatus('disconnected'));
    }
  };

  /**
   * Handle WebSocket connection error event
   * @param event - The error event
   */
  const handleError = (event: Event) => {
    console.error('[NotificationWS] Connection error:', event);
    dispatch(setWSConnectionStatus('error'));
  };

  /**
   * Establish WebSocket connection
   */
  const connect = () => {
    if (!userId) {
      console.log('[NotificationWS] No user ID available, skipping connection');
      return;
    }

    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    try {
      const wsUrl = `${WS_URL}?userId=${userId}`;
      console.log('[NotificationWS] Connecting to:', wsUrl);

      dispatch(setWSConnectionStatus('connecting'));

      const ws = new WebSocket(wsUrl);

      ws.onopen = handleOpen;
      ws.onmessage = handleMessage;
      ws.onclose = handleClose;
      ws.onerror = handleError;

      wsRef.current = ws;
    } catch (error) {
      console.error('[NotificationWS] Connection creation error:', error);
      dispatch(setWSConnectionStatus('error'));
    }
  };

  /**
   * Close WebSocket connection gracefully
   */
  const disconnect = () => {
    clearTimers();

    if (wsRef.current) {
      console.log('[NotificationWS] Disconnecting...');
      wsRef.current.close(1000, 'User logout or component unmount');
      wsRef.current = null;
    }

    setIsConnected(false);
    setReconnectAttempts(0);
    dispatch(setWSConnectionStatus('disconnected'));
  };

  // Effect: Connect when user ID is available, disconnect when user logs out
  useEffect(() => {
    if (userId) {
      connect();
    } else {
      // User logged out - clean up
      disconnect();
      dispatch(clearNotifications());
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [userId, reconnectAttempts]);

  // Get current connection status from Redux
  const connectionStatus = useAppSelector((state) => state.notification.wsConnectionStatus);

  return {
    isConnected,
    connectionStatus,
    reconnectAttempts,
  };
};
