import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Client, IMessage } from '@stomp/stompjs';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  addMessage,
  setMessages,
  setLoadingMessages,
  ChatMessage,
} from '../../../redux/feature/chat/chatMessageSlice';
import { getCookie } from '../../../utility/cookies';

import ChatInput from './_components/ChatInput';
import ChatHeader from './_components/ChatHeader';
import MessagesList from './_components/MessageList';

// Derive WS URL from the REST API URL
const getStompBrokerUrl = (): string => {
  const apiUrl = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8080/api/v1';
  const base = apiUrl.replace(/\/api\/v1\/?$/, '');
  return base.replace(/^http/, 'ws') + '/ws/websocket';
};

const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8080/api/v1';

export const Index = () => {
  const { id: swapRequestId } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector((state) => state.auth.userInformation.id);

  const messages = useAppSelector((state) =>
    swapRequestId ? (state.chatMessages.messages[swapRequestId] ?? []) : [],
  );

  const [peerName, setPeerName] = useState<string>('Chat');
  const clientRef = useRef<Client | null>(null);

  // Fetch existing messages via REST
  const fetchMessages = useCallback(async () => {
    if (!swapRequestId || !currentUserId) return;

    dispatch(setLoadingMessages(true));
    try {
      const token = getCookie('jwtToken');
      const response = await fetch(
        `${API_BASE}/swap-requests/${swapRequestId}/chat?userId=${currentUserId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      if (response.ok) {
        const data: ChatMessage[] = await response.json();
        dispatch(setMessages({ swapRequestId, messages: data }));
      }
    } catch (error) {
      console.error('[InboxChat] Failed to fetch messages:', error);
    } finally {
      dispatch(setLoadingMessages(false));
    }
  }, [swapRequestId, currentUserId, dispatch]);

  // Set up STOMP subscription for real-time messages
  useEffect(() => {
    if (!swapRequestId || !currentUserId) return;

    fetchMessages();

    const token = getCookie('jwtToken');

    const client = new Client({
      brokerURL: getStompBrokerUrl(),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('[InboxChat] STOMP connected');

        // Subscribe to live messages for this conversation
        client.subscribe(`/user/queue/chat/${swapRequestId}`, (frame: IMessage) => {
          try {
            const incoming = JSON.parse(frame.body) as ChatMessage;
            dispatch(addMessage(incoming));
          } catch (err) {
            console.error('[InboxChat] Failed to parse STOMP message:', err);
          }
        });

        // Subscribe to inbox refresh signals from backend
        client.subscribe('/user/queue/inbox/refresh', () => {
          // Re-fetch messages in case backend indicates updates
          fetchMessages();
        });
      },
      onStompError: (frame) => {
        console.error('[InboxChat] STOMP error:', frame.headers['message'], frame.body);
      },
      onWebSocketError: (event) => {
        console.error('[InboxChat] WS error:', event);
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [swapRequestId, currentUserId, fetchMessages]);

  // Fetch swap request details to get peer name for the header
  useEffect(() => {
    if (!swapRequestId || !currentUserId) return;

    const fetchDetails = async () => {
      try {
        const token = getCookie('jwtToken');
        const response = await fetch(`${API_BASE}/swap-requests/${swapRequestId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (response.ok) {
          const data = await response.json();
          // Determine the peer based on current user's role
          const isSender = data.sender?.id === currentUserId;
          const peer = isSender ? data.receiver : data.sender;
          if (peer) {
            setPeerName(peer.name || `${peer.firstName ?? ''} ${peer.lastName ?? ''}`.trim());
          }
        }
      } catch (err) {
        console.error('[InboxChat] Failed to fetch swap request details:', err);
      }
    };

    fetchDetails();
  }, [swapRequestId, currentUserId]);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !swapRequestId || !currentUserId) return;

      if (clientRef.current?.connected) {
        // Send via STOMP (real-time path)
        clientRef.current.publish({
          destination: `/app/chat/${swapRequestId}/send`,
          body: JSON.stringify({ message: text.trim() }),
        });
      } else {
        // Fallback: send via REST API
        try {
          const token = getCookie('jwtToken');
          const formData = new FormData();
          formData.append('message', text.trim());

          await fetch(`${API_BASE}/swap-requests/${swapRequestId}/chat?userId=${currentUserId}`, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
          });
          // Re-fetch to get server-assigned ID and timestamp
          fetchMessages();
        } catch (err) {
          console.error('[InboxChat] Failed to send message via REST:', err);
        }
      }
    },
    [swapRequestId, currentUserId, fetchMessages],
  );

  // Map backend ChatMessage to the view's Message interface
  const viewMessages = messages.map((m) => ({
    id: m.id,
    senderId: m.sender.id,
    text: m.message ?? '',
    timestamp: m.sentAt
      ? new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '',
  }));

  if (!swapRequestId) return null;

  return (
    <div className="flex flex-col h-screen bg-[#f2f4f8] font-poppins">
      <ChatHeader userName={peerName} />
      <MessagesList messages={viewMessages} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};
