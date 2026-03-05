import { useEffect, useRef, useCallback } from 'react';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { useAppSelector } from '../redux/hooks';
import { getCookie } from '../utility/cookies';

// Derive the STOMP WebSocket URL from the REST API URL
// e.g. https://api.kirjaswappi.fi/api/v1  ->  wss://api.kirjaswappi.fi/ws
const getStompBrokerUrl = (): string => {
  const apiUrl = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8080/api/v1';
  const base = apiUrl.replace(/\/api\/v1\/?$/, '');
  return base.replace(/^http/, 'ws') + '/ws/websocket';
};

const STOMP_BROKER_URL = getStompBrokerUrl();
const RECONNECT_DELAY = 5000;

export type StompMessageHandler = (message: IMessage) => void;

export interface StompSubscriptionConfig {
  destination: string;
  handler: StompMessageHandler;
}

export interface UseStompWSReturn {
  subscribe: (destination: string, handler: StompMessageHandler) => StompSubscription | undefined;
  publish: (destination: string, body: unknown) => void;
  isConnected: boolean;
}

/**
 * Custom hook for managing a STOMP WebSocket connection to the Spring Boot backend.
 * Subscribers can listen to `/user/queue/*` and `/topic/*` destinations.
 *
 * Example:
 *   const { subscribe, publish } = useStompWS();
 *   subscribe('/user/queue/chat/swapId123', (msg) => console.log(JSON.parse(msg.body)));
 *   publish('/app/chat/swapId123/send', { message: 'Hello' });
 */
export const useStompWS = (subscriptions?: StompSubscriptionConfig[]): UseStompWSReturn => {
  const userId = useAppSelector((state) => state.auth.userInformation.id);
  const clientRef = useRef<Client | null>(null);
  const activeSubscriptionsRef = useRef<StompSubscription[]>([]);
  const isConnectedRef = useRef(false);

  const getAuthToken = (): string | null => {
    return getCookie('jwtToken');
  };

  const cleanup = useCallback(() => {
    activeSubscriptionsRef.current.forEach((sub) => {
      try {
        sub.unsubscribe();
      } catch (_) {
        /* silent */
      }
    });
    activeSubscriptionsRef.current = [];

    if (clientRef.current?.active) {
      clientRef.current.deactivate();
    }
    isConnectedRef.current = false;
  }, []);

  const subscribe = useCallback(
    (destination: string, handler: StompMessageHandler): StompSubscription | undefined => {
      if (!clientRef.current?.connected) {
        console.warn('[StompWS] Not connected, cannot subscribe to', destination);
        return undefined;
      }
      const sub = clientRef.current.subscribe(destination, handler);
      activeSubscriptionsRef.current.push(sub);
      return sub;
    },
    [],
  );

  const publish = useCallback((destination: string, body: unknown) => {
    if (!clientRef.current?.connected) {
      console.warn('[StompWS] Not connected, cannot publish to', destination);
      return;
    }
    clientRef.current.publish({
      destination,
      body: JSON.stringify(body),
    });
  }, []);

  useEffect(() => {
    if (!userId) {
      cleanup();
      return;
    }

    const token = getAuthToken();

    const client = new Client({
      brokerURL: STOMP_BROKER_URL,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: RECONNECT_DELAY,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('[StompWS] Connected to broker');
        isConnectedRef.current = true;

        // Set up any subscriptions passed initially
        if (subscriptions) {
          subscriptions.forEach(({ destination, handler }) => {
            const sub = client.subscribe(destination, handler);
            activeSubscriptionsRef.current.push(sub);
          });
        }
      },
      onDisconnect: () => {
        console.log('[StompWS] Disconnected from broker');
        isConnectedRef.current = false;
      },
      onStompError: (frame) => {
        console.error('[StompWS] STOMP error:', frame.headers['message'], frame.body);
      },
      onWebSocketError: (event) => {
        console.error('[StompWS] WebSocket error:', event);
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      cleanup();
    };
    // Intentionally only reconnect when userId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return {
    subscribe,
    publish,
    isConnected: isConnectedRef.current,
  };
};
