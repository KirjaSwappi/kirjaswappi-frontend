import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  addNotification,
  clearNotifications,
  setWSConnectionStatus,
} from '../redux/feature/notification/notificationSlice';
import { NotificationPayload, UseNotificationWSReturn, WSMessage } from '../types/notification';
import { getCookie } from '../utility/cookies';

// WebSocket configuration constants
const WS_URL = import.meta.env.VITE_NOTIFICATION_WS_URL || 'wss://ans.kirjaswappi.fi/ws';
const WS_API_KEY = import.meta.env.VITE_NOTIFICATION_API_KEY || '';
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
  const connectRef = useRef<() => void>(() => {});
  const reconnectAttemptsRef = useRef(0);
  const [isConnected, setIsConnected] = useState(false);

  const clearReconnectTimeout = useCallback(() => {
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
    setIsConnected(true);
    reconnectAttemptsRef.current = 0;
    dispatch(setWSConnectionStatus('connected'));
  }, [dispatch]);

  /**
   * Handle WebSocket connection close event
   * @param event - The close event
   */
  const handleClose = useCallback(
    (event: CloseEvent) => {
      setIsConnected(false);
      clearReconnectTimeout();

      if (userId && !event.wasClean && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
        const delay = getReconnectDelay(reconnectAttemptsRef.current);
        dispatch(setWSConnectionStatus('connecting'));

        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current += 1;
          connectRef.current();
        }, delay);
      } else if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
        console.error('[NotificationWS] Max reconnection attempts reached');
        dispatch(setWSConnectionStatus('error'));
      } else {
        dispatch(setWSConnectionStatus('disconnected'));
      }
    },
    [userId, dispatch, clearReconnectTimeout],
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
    if (!userId) return;

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    try {
      const userToken = getCookie('userToken');
      const token = userToken || WS_API_KEY;
      const wsUrl = `${WS_URL}?userId=${encodeURIComponent(userId)}${token ? `&token=${encodeURIComponent(token)}` : ''}`;

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
  }, [userId, dispatch, handleOpen, handleMessage, handleClose, handleError]);

  // Keep ref in sync so handleClose can call connect without circular dependency
  connectRef.current = connect;

  /**
   * Close WebSocket connection gracefully
   */
  const disconnect = useCallback(() => {
    clearReconnectTimeout();

    if (wsRef.current) {
      wsRef.current.close(1000, 'User logout or component unmount');
      wsRef.current = null;
    }

    setIsConnected(false);
    reconnectAttemptsRef.current = 0;
    dispatch(setWSConnectionStatus('disconnected'));
  }, [dispatch, clearReconnectTimeout]);

  // Effect: Connect when user ID is available
  useEffect(() => {
    if (userId) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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
  };
};
