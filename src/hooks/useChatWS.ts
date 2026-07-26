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
  const reconnectAttemptsRef = useRef(0);
  const [isConnected, setIsConnected] = useState(false);
  const subscribedChatsRef = useRef<Set<string>>(new Set());
  const subscriptionMapRef = useRef<Map<string, { unsubscribe: () => void }>>(new Map());
  const userIdRef = useRef(userId);
  userIdRef.current = userId;

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

      // Backend ChatMessageResponse has { id, message, sender: { id, name }, sentAt, imageUrls, ownMessage }
      dispatch(
        receiveMessage({
          chatId: swapRequestId,
          messageId: chatMessage.id,
          text: chatMessage.message || chatMessage.text || '',
          senderId: chatMessage.sender?.id || chatMessage.senderId,
          userId: userIdRef.current as string,
          time: chatMessage.sentAt,
          images: chatMessage.imageUrls,
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
      dispatch(setInboxList(inboxList));
    } catch (error) {
      console.error('[ChatWS] Error parsing inbox update:', error);
    }
  };

  /**
   * Subscribe to a specific chat
   */
  const subscribeToChat = (swapRequestId: string) => {
    if (!stompClientRef.current || !stompClientRef.current.connected) return;
    if (subscribedChatsRef.current.has(swapRequestId)) return;

    try {
      const subscription = stompClientRef.current.subscribe(
        `/user/queue/chat.${swapRequestId}`,
        (message) => handleChatMessage(swapRequestId, message),
      );

      subscribedChatsRef.current.add(swapRequestId);
      subscriptionMapRef.current.set(swapRequestId, subscription);
    } catch (error) {
      console.error(`[ChatWS] Error subscribing to chat ${swapRequestId}:`, error);
    }
  };

  /**
   * Unsubscribe from a specific chat
   */
  const unsubscribeFromChat = (swapRequestId: string) => {
    if (!subscribedChatsRef.current.has(swapRequestId)) {
      return;
    }

    try {
      const subscription = subscriptionMapRef.current.get(swapRequestId);
      if (subscription) {
        subscription.unsubscribe();
        subscriptionMapRef.current.delete(swapRequestId);
      }
      subscribedChatsRef.current.delete(swapRequestId);
    } catch (error) {
      console.error(`[ChatWS] Error unsubscribing from chat ${swapRequestId}:`, error);
    }
  };

  /**
   * Send a chat message
   */
  const sendChatMessage = (swapRequestId: string, message: string) => {
    if (!stompClientRef.current || !stompClientRef.current.connected) return;

    try {
      stompClientRef.current.publish({
        destination: `/app/chat/${swapRequestId}/send`,
        body: JSON.stringify({ message }),
      });
    } catch (error) {
      console.error(`[ChatWS] Error sending message to chat ${swapRequestId}:`, error);
    }
  };

  /**
   * Establish WebSocket connection
   */
  const connect = () => {
    if (!userId) return;

    // Close existing connection if any
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }

    try {
      const jwtToken = getCookie('userToken');
      if (!jwtToken) return;

      // SockJS does not support custom headers on the HTTP transport.
      // Auth is handled via STOMP connectHeaders below.
      const socket = new SockJS(WS_URL);

      // Handle SockJS connection errors (e.g., 403 on /info request)
      socket.onerror = (error) => {
        const errorEvent = error as ErrorEvent;
        if (errorEvent?.type === 'error') {
          console.error('[ChatWS] SockJS connection error:', error);
          setIsConnected(false);
          reconnectAttemptsRef.current = MAX_RECONNECT_ATTEMPTS;
        }
      };

      // Create STOMP client over SockJS
      const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 0,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectHeaders: {
          Authorization: `Bearer ${jwtToken}`,
        },
        debug: (str) => {
          if (import.meta.env.DEV) {
            console.log('[ChatWS]', str);
          }
        },
        onConnect: () => {
          setIsConnected(true);
          reconnectAttemptsRef.current = 0;
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

          // Re-subscribe to all previously subscribed chats (restores subscriptions after reconnect)
          const prevChats = Array.from(subscribedChatsRef.current);
          subscribedChatsRef.current.clear();
          subscriptionMapRef.current.clear();
          for (const chatId of prevChats) {
            try {
              const sub = client.subscribe(`/user/queue/chat.${chatId}`, (message) =>
                handleChatMessage(chatId, message),
              );
              subscribedChatsRef.current.add(chatId);
              subscriptionMapRef.current.set(chatId, sub);
            } catch (error) {
              console.error(`[ChatWS] Error re-subscribing to chat ${chatId}:`, error);
            }
          }

          // Also subscribe to selected chat if not already covered
          if (selectedChatId && !subscribedChatsRef.current.has(selectedChatId)) {
            try {
              const sub = client.subscribe(`/user/queue/chat.${selectedChatId}`, (message) =>
                handleChatMessage(selectedChatId, message),
              );
              subscribedChatsRef.current.add(selectedChatId);
              subscriptionMapRef.current.set(selectedChatId, sub);
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
            reconnectAttemptsRef.current = MAX_RECONNECT_ATTEMPTS;
            return;
          }
        },
        onWebSocketClose: (event) => {
          setIsConnected(false);
          // Do NOT clear subscribedChatsRef/subscriptionMapRef here — they are
          // preserved so onConnect can re-subscribe to all chats after reconnect.

          // Don't reconnect if we've hit max attempts or if it was an auth error
          if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) return;

          if (event.code === 1008 || event.code === 1002) {
            reconnectAttemptsRef.current = MAX_RECONNECT_ATTEMPTS;
            return;
          }

          // Attempt reconnection
          const delay = getReconnectDelay(reconnectAttemptsRef.current);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connect();
          }, delay);
        },
        onDisconnect: () => {
          setIsConnected(false);
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
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }

    setIsConnected(false);
    reconnectAttemptsRef.current = 0;
    subscribedChatsRef.current.clear();
    subscriptionMapRef.current.clear();
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
