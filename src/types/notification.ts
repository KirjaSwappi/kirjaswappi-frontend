/**
 * Notification type definitions for WebSocket integration
 */

/**
 * NotificationPayload - The data structure received from the WebSocket server
 * Matches the Go backend NotificationPayload structure
 */
export interface NotificationPayload {
  UserID: string;
  Title: string;
  Message: string;
  Time: string; // ISO 8601 timestamp from Go time.Time
}

/**
 * INotification - Internal notification model used in Redux store
 * Extends the payload with additional frontend-specific fields
 */
export interface INotification {
  id: string; // Generated: `${userId}-${timestamp}`
  userId: string;
  title: string;
  message: string;
  time: string; // ISO 8601 format
  isRead: boolean;
}

/**
 * WebSocket message types for handling different message kinds
 */
export interface PingMessage {
  type: 'ping';
}

export interface PongMessage {
  type: 'pong';
}

/**
 * Union type for all possible WebSocket messages
 */
export type WSMessage = NotificationPayload | PingMessage | PongMessage;

/**
 * WebSocket connection status states
 */
export type WSConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

/**
 * Return type for the useNotificationWS hook
 */
export interface UseNotificationWSReturn {
  isConnected: boolean;
  connectionStatus: WSConnectionStatus;
  reconnectAttempts: number;
}
