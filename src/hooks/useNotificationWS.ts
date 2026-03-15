import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  addNotification,
  clearNotifications,
  setWSConnectionStatus,
} from '../redux/feature/notification/notificationSlice';
import { NotificationPayload, UseNotificationWSReturn, WSMessage } from '../types/notification';

// WebSocket configuration constants
const WS_URL = import.meta.env.VITE_NOTIFICATION_WS_URL || 'wss://ans.kirjaswappi.fi/ws';
const MAX_RECONNECT_ATTEMPTS = 5;
const INITIAL_RECONNECT_DELAY = 1000; // 1 second
const MAX_RECONNECT_DELAY = 30000; // 30 seconds

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
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // Stable refs for latest values used inside WS callbacks
  const userIdRef = useRef(userId);
  const reconnectAttemptsRef = useRef(reconnectAttempts);
  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);
  useEffect(() => {
    reconnectAttemptsRef.current = reconnectAttempts;
  }, [reconnectAttempts]);

  /**
   * Clear reconnect timer
   */
  const clearTimers = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  /**
   * Handle incoming WebSocket messages
   * @param event - The WebSocket message event
   */
  const handleMessage = useCallback(
    async (event: MessageEvent) => {
      try {
        let data = '';
        if (typeof event.data === 'string') {
          data = event.data;
        } else if (event.data instanceof Blob) {
          data = await event.data.text();
        } else if (event.data instanceof ArrayBuffer) {
          data = new TextDecoder().decode(event.data);
        }

        const message: WSMessage = JSON.parse(data);

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
    },
    [dispatch],
  );

  /**
   * Handle WebSocket connection open event
   */
  const handleOpen = useCallback(() => {
    console.log('[NotificationWS] Connection established');
    setIsConnected(true);
    setReconnectAttempts(0);
    dispatch(setWSConnectionStatus('connected'));
  }, [dispatch]);

  /**
   * Handle WebSocket connection close event
   * @param event - The close event
   */
  const handleClose = useCallback(
    (event: CloseEvent) => {
      setIsConnected(false);
      clearTimers();

      const attempts = reconnectAttemptsRef.current;

      // Only attempt reconnection if user is still authenticated and close was not clean
      if (userIdRef.current && !event.wasClean && attempts < MAX_RECONNECT_ATTEMPTS) {
        const delay = getReconnectDelay(attempts);
        dispatch(setWSConnectionStatus('connecting'));

        reconnectTimeoutRef.current = setTimeout(() => {
          setReconnectAttempts((prev) => prev + 1);
        }, delay);
      } else if (attempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error('[NotificationWS] Max reconnection attempts reached');
        dispatch(setWSConnectionStatus('error'));
      } else {
        dispatch(setWSConnectionStatus('disconnected'));
      }
    },
    [dispatch, clearTimers],
  );

  /**
   * Handle WebSocket connection error event
   * @param event - The error event
   */
  const handleError = useCallback(
    (event: Event) => {
      console.error('[NotificationWS] Connection error:', event);
      dispatch(setWSConnectionStatus('error'));
    },
    [dispatch],
  );

  /**
   * Establish WebSocket connection
   */
  const connect = useCallback(() => {
    if (!userIdRef.current) {
      console.log('[NotificationWS] No user ID available, skipping connection');
      return;
    }

    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    try {
      const wsUrl = `${WS_URL}?userId=${userIdRef.current}`;
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
  }, [dispatch, handleOpen, handleMessage, handleClose, handleError]);

  /**
   * Close WebSocket connection gracefully
   */
  const disconnect = useCallback(() => {
    clearTimers();

    if (wsRef.current) {
      console.log('[NotificationWS] Disconnecting...');
      wsRef.current.close(1000, 'User logout or component unmount');
      wsRef.current = null;
    }

    setIsConnected(false);
    setReconnectAttempts(0);
    dispatch(setWSConnectionStatus('disconnected'));
  }, [dispatch, clearTimers]);

  // Effect: Connect when user ID is available or reconnect attempt increments
  useEffect(() => {
    if (userId) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [userId, reconnectAttempts]); // eslint-disable-line react-hooks/exhaustive-deps

  // Effect: Clear notifications when user logs out
  useEffect(() => {
    if (!userId) {
      dispatch(clearNotifications());
    }
  }, [userId, dispatch]);

  // Get current connection status from Redux
  const connectionStatus = useAppSelector((state) => state.notification.wsConnectionStatus);

  return {
    isConnected,
    connectionStatus,
    reconnectAttempts,
  };
};
