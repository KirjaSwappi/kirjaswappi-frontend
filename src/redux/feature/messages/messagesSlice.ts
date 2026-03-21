import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: number | string;
  sender: 'me' | 'them';
  text: string;
  time: string;
  unread?: boolean;
  images?: string[];
}

export interface Chat {
  id: string;
  name: string;
  unread: boolean;
  unreadMessageCount?: number;
  messages: Message[];
  senderName?: string;
  updatedAt?: string;
  // Server-side inbox item fields
  conversationType?: 'sent' | 'received';
  receiver?: { id: string; name: string };
  sender?: { id: string; name: string };
  bookToSwapWith?: {
    id: string;
    title: string;
    author: string;
    condition: string;
    coverPhotoUrl?: string;
  };
  swapStatus?: string;
  swapType?: string;
  note?: string;
}

// Server-side inbox item type
export interface InboxItem {
  id: string;
  askForGiveaway: boolean;
  bookToSwapWith: {
    author: string;
    condition: string;
    id: string;
    title: string;
    coverPhotoUrl?: string;
  };
  conversationType: 'sent' | 'received';
  hasNewMessages: boolean;
  note: string;
  receiver: {
    id: string;
    name: string;
  };
  requestedAt: string;
  sender: {
    id: string;
    name: string;
  };
  swapOffer: {
    offeredBookTitle: string | null;
    offeredGenreName: string | null;
  } | null;
  swapStatus: string;
  swapType: string;
  unread: boolean;
  unreadMessageCount: number;
  updatedAt: string;
}

export interface ChatState {
  chats: Chat[];
  selectedChatId: string;
}

const initialState: ChatState = {
  chats: [],
  selectedChatId: '',
};

// Helper function to move chat to front
const moveChatToFront = (chats: Chat[], chatId: string): Chat[] => {
  const chatIndex = chats.findIndex((c) => c.id === chatId);
  if (chatIndex === -1 || chatIndex === 0) return chats;

  const chat = chats[chatIndex];
  const newChats = [...chats];
  newChats.splice(chatIndex, 1);
  return [chat, ...newChats];
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    selectChat: (state, action: PayloadAction<string>) => {
      state.selectedChatId = action.payload;
    },
    resetChat: (state) => {
      state.selectedChatId = '';
    },
    setInboxList: (state, action: PayloadAction<InboxItem[]>) => {
      // Deduplicate inbox items by ID before transforming (more efficient using Map)
      const uniqueItemsMap = new Map<string, InboxItem>();
      action.payload.forEach((item) => {
        if (!uniqueItemsMap.has(item.id)) {
          uniqueItemsMap.set(item.id, item);
        }
      });
      const uniqueItems = Array.from(uniqueItemsMap.values());

      // Transform inbox items to chat format, preserving existing messages
      state.chats = uniqueItems.map((item) => {
        const partnerName =
          item.conversationType === 'sent' ? item.receiver.name : item.sender.name;
        const bookTitle = item.bookToSwapWith?.title || 'Unknown Book';
        const lastText = item.note || `${item.sender.name} sent a message`;

        // Find existing chat to preserve loaded messages
        const existingChat = state.chats.find((c) => c.id === item.id);

        return {
          id: item.id,
          name: bookTitle,
          unread: item.unread,
          unreadMessageCount: item.unreadMessageCount || 0,
          senderName: partnerName,
          updatedAt: item.updatedAt,
          conversationType: item.conversationType,
          receiver: item.receiver,
          sender: item.sender,
          bookToSwapWith: item.bookToSwapWith,
          swapStatus: item.swapStatus,
          swapType: item.swapType,
          note: item.note,
          messages: existingChat?.messages || [
            {
              id: item.id,
              sender: item.conversationType === 'sent' ? 'me' : 'them',
              text: lastText,
              time: item.updatedAt,
              unread: item.unread,
            },
          ],
        };
      });
    },
    updateInboxItem: (state, action: PayloadAction<InboxItem>) => {
      const item = action.payload;
      const existingChatIndex = state.chats.findIndex((c) => c.id === item.id);

      const partnerName = item.conversationType === 'sent' ? item.receiver.name : item.sender.name;
      const bookTitle = item.bookToSwapWith?.title || 'Unknown Book';
      const lastText = item.note || `${item.sender.name} sent a message`;

      const updatedChat: Chat = {
        id: item.id,
        name: bookTitle,
        unread: item.unread,
        unreadMessageCount: item.unreadMessageCount || 0,
        senderName: partnerName,
        updatedAt: item.updatedAt,
        conversationType: item.conversationType,
        receiver: item.receiver,
        sender: item.sender,
        bookToSwapWith: item.bookToSwapWith,
        swapStatus: item.swapStatus,
        swapType: item.swapType,
        note: item.note,
        messages: [
          {
            id: item.id,
            sender: item.conversationType === 'sent' ? 'me' : 'them',
            text: lastText,
            time: item.updatedAt,
            unread: item.unread,
          },
        ],
      };

      if (existingChatIndex !== -1) {
        // Update existing chat and move to front if it has new messages
        const existingChat = state.chats[existingChatIndex];
        updatedChat.messages = existingChat.messages; // Preserve existing messages
        state.chats[existingChatIndex] = updatedChat;

        // Move to front if it has new messages or was updated
        if (item.hasNewMessages || item.unread) {
          state.chats = moveChatToFront(state.chats, item.id);
        }
      } else {
        // Add new chat at the front
        state.chats = [updatedChat, ...state.chats];
      }
    },
    sendMessage: (
      state,
      action: PayloadAction<{
        chatId: string;
        text: string;
        images?: string[];
        messageId?: string | number;
      }>,
    ) => {
      const { chatId, text, images, messageId } = action.payload;
      const chat = state.chats.find((c) => c.id === chatId);
      if (chat) {
        const message = {
          id: messageId ?? Date.now(),
          sender: 'me' as const,
          text,
          images,
          time: new Date().toISOString(),
        };
        chat.messages.push(message);
        chat.updatedAt = new Date().toISOString();
        // Move to front when sending a message
        state.chats = moveChatToFront(state.chats, chatId);
      }
    },
    receiveMessage: (
      state,
      action: PayloadAction<{
        chatId: string;
        messageId: string;
        text: string;
        senderId?: string;
        userId?: string;
        time?: string;
        images?: string[];
      }>,
    ) => {
      const { chatId, messageId, text, senderId, userId, time, images } = action.payload;
      const chat = state.chats.find((c) => c.id === chatId);
      if (chat) {
        // Prevent duplicate messages if already present
        if (chat.messages.some((m) => m.id === messageId)) {
          return;
        }

        const isMe = senderId === userId;
        const message: Message = {
          id: messageId,
          sender: isMe ? 'me' : 'them',
          text,
          time: time || new Date().toISOString(),
          unread: !isMe,
          images,
        };
        chat.messages.push(message);
        chat.updatedAt = new Date().toISOString();

        if (!isMe && state.selectedChatId !== chatId) {
          chat.unread = true;
          chat.unreadMessageCount = (chat.unreadMessageCount || 0) + 1;
          // Move to front when receiving a new message
          state.chats = moveChatToFront(state.chats, chatId);
        }
      }
    },
    addChatMessages: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
      const { chatId, messages } = action.payload;
      const chat = state.chats.find((c) => c.id === chatId);
      if (chat) {
        // Merge messages, avoiding duplicates
        const existingIds = new Set(chat.messages.map((m) => m.id));
        const newMessages = messages.filter((m) => !existingIds.has(m.id));
        chat.messages = [...chat.messages, ...newMessages].sort((a, b) => {
          const timeA = new Date(a.time).getTime();
          const timeB = new Date(b.time).getTime();
          return timeA - timeB;
        });
      }
    },
    removeTempMessages: (state, action: PayloadAction<{ chatId: string }>) => {
      const { chatId } = action.payload;
      const chat = state.chats.find((c) => c.id === chatId);
      if (chat) {
        chat.messages = chat.messages.filter((m) => !String(m.id).startsWith('temp-'));
      }
    },
    markChatRead: (state, action: PayloadAction<string>) => {
      const chat = state.chats.find((c) => c.id === action.payload);
      if (chat) {
        chat.unread = false;
        chat.unreadMessageCount = 0;
      }
    },
  },
});

// =========== SELECTORS ===========
export const selectTotalUnreadCount = (state: { chat: ChatState }) =>
  state.chat.chats.reduce((total, chat) => {
    const count =
      chat.unreadMessageCount && chat.unreadMessageCount > 0
        ? chat.unreadMessageCount
        : chat.unread
          ? 1
          : 0;
    return total + count;
  }, 0);

export const {
  selectChat,
  resetChat,
  sendMessage,
  receiveMessage,
  setInboxList,
  updateInboxItem,
  addChatMessages,
  removeTempMessages,
  markChatRead,
} = chatSlice.actions;
export default chatSlice.reducer;
