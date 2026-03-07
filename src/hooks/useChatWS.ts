import { Client, IMessage } from '@stomp/stompjs';
import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { api } from '../redux/api/apiSlice';
import {
  InboxItem,
  receiveMessage,
  setInboxList,
  updateInboxItem,
} from '../redux/feature/messages/messagesSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getCookie } from '../utility/cookies';

// WebSocket configuration constants
// Construct WebSocket URL from API URL or use explicit env variable
const getChatWSUrl = (): string => {
  if (import.meta.env.VITE_CHAT_WS_URL) {
    return import.meta.env.VITE_CHAT_WS_URL;
  }
  // If API URL is available, construct WebSocket URL from it
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    // Convert https://api.kirjaswappi.fi/api/v1 to https://api.kirjaswappi.fi/ws
    // or use the base domain for WebSocket
    try {
      const url = new URL(apiUrl);
      // Use the base domain and append /ws
      return `${url.protocol}//${url.host}/ws`;
    } catch {
      // Fallback if URL parsing fails
      return '/ws';
    }
  }
  // Fallback to relative path (will only work if backend is on same origin)
  return '/ws';
};
const WS_URL = getChatWSUrl();
const MAX_RECONNECT_ATTEMPTS = 5;
const INITIAL_RECONNECT_DELAY = 1000; // 1 second
const MAX_RECONNECT_DELAY = 30000; // 30 seconds

/**
 * Calculate exponential backoff delay for reconnection attempts
 */
const getReconnectDelay = (attempt: number): number => {
  return Math.min(INITIAL_RECONNECT_DELAY * Math.pow(2, attempt), MAX_RECONNECT_DELAY);
};

export interface UseChatWSReturn {
  isConnected: boolean;
  sendChatMessage: (swapRequestId: string, message: string) => void;
  subscribeToChat: (swapRequestId: string) => void;
  unsubscribeFromChat: (swapRequestId: string) => void;
}

/**
 * Custom hook for managing WebSocket connection to the chat service using STOMP over SockJS
 */
export const useChatWS = (): UseChatWSReturn => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.userInformation.id);
  const selectedChatId = useAppSelector((state) => state.chat.selectedChatId);

  const stompClientRef = useRef<Client | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const subscribedChatsRef = useRef<Set<string>>(new Set());

  /**
   * Clear reconnect timeout
   */
  const clearReconnectTimeout = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  /**
   * Handle incoming chat messages
   */
  const handleChatMessage = (swapRequestId: string, message: IMessage) => {
    try {
      const chatMessage = JSON.parse(message.body);
      console.log('[ChatWS] Received chat message:', chatMessage);

      // Dispatch the message to Redux
      dispatch(
        receiveMessage({
          chatId: swapRequestId,
          text: chatMessage.message || chatMessage.text || '',
          senderId: chatMessage.senderId,
          userId: userId as string,
        }),
      );
    } catch (error) {
      console.error('[ChatWS] Error parsing chat message:', error);
    }
  };

  /**
   * Handle inbox item updates (single item)
   */
  const handleInboxItemUpdate = (message: IMessage) => {
    try {
      const inboxItem: InboxItem = JSON.parse(message.body);
      console.log('[ChatWS] Received inbox item update:', inboxItem);

      dispatch(updateInboxItem(inboxItem));
    } catch (error) {
      console.error('[ChatWS] Error parsing inbox item update:', error);
    }
  };

  /**
   * Handle full inbox updates
   */
  const handleInboxUpdate = (message: IMessage) => {
    try {
      const inboxList: InboxItem[] = JSON.parse(message.body);
      console.log('[ChatWS] Received inbox update:', inboxList);

      dispatch(setInboxList(inboxList));
    } catch (error) {
      console.error('[ChatWS] Error parsing inbox update:', error);
    }
  };

  /**
   * Subscribe to a specific chat
   */
  const subscribeToChat = (swapRequestId: string) => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      console.warn('[ChatWS] Cannot subscribe: client not connected');
      return;
    }

    if (subscribedChatsRef.current.has(swapRequestId)) {
      console.log(`[ChatWS] Already subscribed to chat: ${swapRequestId}`);
      return;
    }

    try {
      stompClientRef.current.subscribe(`/user/queue/chat.${swapRequestId}`, (message) =>
        handleChatMessage(swapRequestId, message),
      );

      subscribedChatsRef.current.add(swapRequestId);
      console.log(`[ChatWS] Subscribed to chat: ${swapRequestId}`);
    } catch (error) {
      console.error(`[ChatWS] Error subscribing to chat ${swapRequestId}:`, error);
    }
  };

  /**
   * Unsubscribe from a specific chat
   */
  const unsubscribeFromChat = (swapRequestId: string) => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      return;
    }

    if (!subscribedChatsRef.current.has(swapRequestId)) {
      return;
    }

    try {
      // Note: STOMP.js doesn't provide direct unsubscribe by destination
      // We'll track subscriptions and clean up on disconnect
      subscribedChatsRef.current.delete(swapRequestId);
      console.log(`[ChatWS] Unsubscribed from chat: ${swapRequestId}`);
    } catch (error) {
      console.error(`[ChatWS] Error unsubscribing from chat ${swapRequestId}:`, error);
    }
  };

  /**
   * Send a chat message
   */
  const sendChatMessage = (swapRequestId: string, message: string) => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      console.warn('[ChatWS] Cannot send message: client not connected');
      return;
    }

    try {
      stompClientRef.current.publish({
        destination: `/app/chat/${swapRequestId}/send`,
        body: JSON.stringify({ message }),
      });
      console.log(`[ChatWS] Sent message to chat: ${swapRequestId}`);
    } catch (error) {
      console.error(`[ChatWS] Error sending message to chat ${swapRequestId}:`, error);
    }
  };

  /**
   * Establish WebSocket connection
   */
  const connect = () => {
    if (!userId) {
      console.log('[ChatWS] No user ID available, skipping connection');
      return;
    }

    // Close existing connection if any
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }

    try {
      const jwtToken = getCookie('jwtToken');
      if (!jwtToken) {
        console.warn('[ChatWS] No JWT token available');
        return;
      }

      const socket = new SockJS(WS_URL, null, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          userId: userId as string,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      // Handle SockJS connection errors (e.g., 403 on /info request)
      socket.onerror = (error) => {
        console.error('[ChatWS] SockJS connection error:', error);
        // Check if it's an authentication error
        const errorEvent = error as ErrorEvent;
        if (errorEvent?.type === 'error') {
          console.error('[ChatWS] Connection failed - this may be an authentication issue');
          setIsConnected(false);
          setReconnectAttempts(MAX_RECONNECT_ATTEMPTS);
        }
      };

      // Create STOMP client over SockJS
      const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: INITIAL_RECONNECT_DELAY,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectHeaders: {
          Authorization: `Bearer ${jwtToken}`,
          userId: userId as string,
        },
        debug: (str) => {
          if (import.meta.env.DEV) {
            console.log('[ChatWS]', str);
          }
        },
        onConnect: () => {
          console.log('[ChatWS] Connected successfully');
          setIsConnected(true);
          setReconnectAttempts(0);
          clearReconnectTimeout();

          // Subscribe to inbox updates
          client.subscribe('/user/queue/inbox.item-update', handleInboxItemUpdate);
          client.subscribe('/user/queue/inbox.update', handleInboxUpdate);
          client.subscribe('/user/queue/inbox.refresh', () => {
            dispatch(api.util.invalidateTags(['Inbox']));
          });

          // Trigger initial inbox load
          client.publish({
            destination: '/app/inbox/subscribe',
            body: JSON.stringify({}),
          });

          // Subscribe to currently selected chat if any
          if (selectedChatId && !subscribedChatsRef.current.has(selectedChatId)) {
            try {
              client.subscribe(`/user/queue/chat.${selectedChatId}`, (message) =>
                handleChatMessage(selectedChatId, message),
              );
              subscribedChatsRef.current.add(selectedChatId);
              console.log(`[ChatWS] Subscribed to chat: ${selectedChatId}`);
            } catch (error) {
              console.error(`[ChatWS] Error subscribing to chat ${selectedChatId}:`, error);
            }
          }
        },
        onStompError: (frame) => {
          console.error('[ChatWS] STOMP error:', frame);
          setIsConnected(false);

          // Check if error is authentication-related (403, 401)
          if (
            frame.headers?.['message']?.includes('403') ||
            frame.headers?.['message']?.includes('401') ||
            frame.headers?.['message']?.includes('Forbidden') ||
            frame.headers?.['message']?.includes('Unauthorized')
          ) {
            console.error('[ChatWS] Authentication error - stopping reconnection attempts');
            setReconnectAttempts(MAX_RECONNECT_ATTEMPTS);
            return;
          }
        },
        onWebSocketClose: (event) => {
          console.log('[ChatWS] WebSocket closed', event);
          setIsConnected(false);
          subscribedChatsRef.current.clear();

          // Don't reconnect if we've hit max attempts or if it was an auth error
          if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            console.error('[ChatWS] Max reconnection attempts reached');
            return;
          }

          // Check if close was due to authentication failure (code 1008 = policy violation, often used for auth)
          if (event.code === 1008 || event.code === 1002) {
            console.error(
              '[ChatWS] Connection closed due to authentication/policy violation - stopping reconnection',
            );
            setReconnectAttempts(MAX_RECONNECT_ATTEMPTS);
            return;
          }

          // Attempt reconnection
          const delay = getReconnectDelay(reconnectAttempts);
          console.log(
            `[ChatWS] Attempting reconnection in ${delay}ms (attempt ${reconnectAttempts + 1})`,
          );
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts((prev) => prev + 1);
            connect();
          }, delay);
        },
        onDisconnect: () => {
          console.log('[ChatWS] Disconnected');
          setIsConnected(false);
          subscribedChatsRef.current.clear();
        },
      });

      stompClientRef.current = client;
      client.activate();
    } catch (error) {
      console.error('[ChatWS] Connection creation error:', error);
      setIsConnected(false);
    }
  };

  /**
   * Close WebSocket connection gracefully
   */
  const disconnect = () => {
    clearReconnectTimeout();

    if (stompClientRef.current) {
      console.log('[ChatWS] Disconnecting...');
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }

    setIsConnected(false);
    setReconnectAttempts(0);
    subscribedChatsRef.current.clear();
  };

  // Effect: Connect when user ID is available, disconnect when user logs out
  useEffect(() => {
    if (userId) {
      connect();
    } else {
      disconnect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [userId]);

  // Effect: Subscribe to selected chat when it changes
  useEffect(() => {
    if (isConnected && selectedChatId) {
      subscribeToChat(selectedChatId);
    }
  }, [isConnected, selectedChatId]);

  return {
    isConnected,
    sendChatMessage,
    subscribeToChat,
    unsubscribeFromChat,
  };
};
