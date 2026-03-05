import { useState, useEffect, useCallback, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import graySearchIcon from '../../../assets/GraysearchIcon.png';
import Image from '../../../components/shared/Image';
import Input from '../../../components/shared/Input';
import ChatUserCard from './_components/ChatUserCard';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  setInbox,
  updateInboxItem,
  setLoadingInbox,
  InboxItem,
} from '../../../redux/feature/chat/chatMessageSlice';
import { getCookie } from '../../../utility/cookies';
import { API_BASE, getStompBrokerUrl } from '../../../utils/stomp.utils';

const Inbox = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector((state) => state.auth.userInformation.id);
  const inbox = useAppSelector((state) => state.chatMessages.inbox);
  const clientRef = useRef<Client | null>(null);

  const fetchInbox = useCallback(async () => {
    if (!currentUserId) return;
    dispatch(setLoadingInbox(true));
    try {
      const token = getCookie('jwtToken');
      const response = await fetch(`${API_BASE}/inbox?userId=${currentUserId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (response.ok) {
        const data: InboxItem[] = await response.json();
        dispatch(setInbox(data));
      }
    } catch (error) {
      console.error('[Inbox] Failed to fetch inbox:', error);
    } finally {
      dispatch(setLoadingInbox(false));
    }
  }, [currentUserId, dispatch]);

  // Set up STOMP for real-time inbox updates
  useEffect(() => {
    if (!currentUserId) return;

    fetchInbox();

    const token = getCookie('jwtToken');
    const client = new Client({
      brokerURL: getStompBrokerUrl(),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        if (import.meta.env.MODE === 'development') {
          console.log('[Inbox] STOMP connected');
        }

        // Full inbox update (e.g. on initial subscription)
        client.subscribe('/user/queue/inbox/update', (frame: IMessage) => {
          try {
            const data = JSON.parse(frame.body);
            if (Array.isArray(data)) {
              dispatch(setInbox(data as InboxItem[]));
            } else {
              dispatch(updateInboxItem(data as InboxItem));
            }
          } catch (err) {
            console.error('[Inbox] Failed to parse STOMP inbox message:', err);
          }
        });

        // Delta inbox item update
        client.subscribe('/user/queue/inbox/item-update', (frame: IMessage) => {
          try {
            const data = JSON.parse(frame.body) as InboxItem;
            dispatch(updateInboxItem(data));
          } catch (err) {
            console.error('[Inbox] Failed to parse STOMP item-update message:', err);
          }
        });

        // Inbox refresh signal
        client.subscribe('/user/queue/inbox/refresh', () => {
          fetchInbox();
        });

        // Subscribe to inbox to get initial data pushed from backend
        client.publish({ destination: '/app/inbox/subscribe', body: '' });
      },
      onStompError: (frame) => {
        console.error('[Inbox] STOMP error:', frame.headers['message']);
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [currentUserId, fetchInbox]);

  // Map InboxItem to the shape ChatUserCard expects
  const conversations = inbox.map((item) => {
    const isConvSender = item.conversationType === 'sent';
    const peer = isConvSender ? item.receiver : item.sender;
    const peerName = peer.name;
    const peerAvatar = null; // Backend UserSummaryResponse doesn't have avatar yet

    return {
      id: item.id,
      name: peerName || 'User',
      lastMessage: item.lastMessageContent || item.bookToSwapWith?.title || '',
      unread: item.unreadMessageCount,
      time: item.lastMessageSentAt
        ? new Date(item.lastMessageSentAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '',
      avatar: peerAvatar,
    };
  });

  const filteredConversations = searchQuery
    ? conversations.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : conversations;

  return (
    <div className="flex flex-col h-screen bg-[#f2f4f8] font-poppins">
      <div className="bg-white w-full py-4 px-4">
        <h2 className="text-center text-lg">Messages</h2>
      </div>

      <div className="px-4 py-2 bg-[#F5F6FA]">
        <div className="relative">
          <Image
            src={graySearchIcon}
            alt="Search"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] object-contain"
          />
          <Input
            type="text"
            className="w-full pl-10 pr-3 py-2 rounded-full border border-[#E4E6EC] bg-white text-sm focus:outline-none"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <p className="text-center text-[#8B8B8B] mt-10 text-sm">No conversations found.</p>
        ) : (
          filteredConversations.map((conversation) => (
            <ChatUserCard key={conversation.id} {...conversation} />
          ))
        )}
      </div>
    </div>
  );
};

export default Inbox;
