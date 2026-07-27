import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

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

// Compare image lists by object path, ignoring the presigned-URL signature
// (query string), which rotates on every fetch for identical objects.
const imagePath = (url: string) => url.split('?')[0];
const sameImagePaths = (a: string[] | undefined, b: string[]): boolean =>
  !!a && a.length === b.length && a.every((url, i) => imagePath(url) === imagePath(b[i]));

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
    resetChat: () => initialState,
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

        // Preserve local read state for the currently selected chat
        const isCurrentlySelected = state.selectedChatId === item.id;
        const wasLocallyRead = existingChat && !existingChat.unread;

        return {
          id: item.id,
          name: bookTitle,
          unread: isCurrentlySelected && wasLocallyRead ? false : item.unread,
          unreadMessageCount:
            isCurrentlySelected && wasLocallyRead ? 0 : item.unreadMessageCount || 0,
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
              id: `inbox-${item.id}`,
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

      // Preserve local read state for the currently selected chat
      const existingChat = existingChatIndex !== -1 ? state.chats[existingChatIndex] : null;
      const isCurrentlySelected = state.selectedChatId === item.id;
      const wasLocallyRead = existingChat && !existingChat.unread;

      const updatedChat: Chat = {
        id: item.id,
        name: bookTitle,
        unread: isCurrentlySelected && wasLocallyRead ? false : item.unread,
        unreadMessageCount:
          isCurrentlySelected && wasLocallyRead ? 0 : item.unreadMessageCount || 0,
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
            id: `inbox-${item.id}`,
            sender: item.conversationType === 'sent' ? 'me' : 'them',
            text: lastText,
            time: item.updatedAt,
            unread: isCurrentlySelected && wasLocallyRead ? false : item.unread,
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
        messageId: string | number;
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
        if (chat.messages.some((m) => String(m.id) === String(messageId))) {
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
        const existingMap = new Map(chat.messages.map((m) => [String(m.id), m]));

        for (const msg of messages) {
          const key = String(msg.id);
          const existing = existingMap.get(key);
          if (existing) {
            // Presigned URLs rotate their signature on every fetch while
            // pointing at the same object. Only swap when the object path
            // actually changed, so the <img src> stays stable and the browser
            // doesn't drop and re-request the image (blinking) on every refetch.
            if (msg.images && !sameImagePaths(existing.images, msg.images)) {
              existing.images = msg.images;
            }
          } else {
            existingMap.set(key, msg);
          }
        }

        chat.messages = Array.from(existingMap.values()).sort((a, b) => {
          const timeA = new Date(a.time).getTime();
          const timeB = new Date(b.time).getTime();
          return timeA - timeB;
        });
      }
    },
    removeTempMessages: (state, action: PayloadAction<{ chatId: string; tempId: string }>) => {
      const { chatId, tempId } = action.payload;
      const chat = state.chats.find((c) => c.id === chatId);
      if (chat) {
        chat.messages = chat.messages.filter((m) => String(m.id) !== tempId);
      }
    },
    markChatRead: (state, action: PayloadAction<string>) => {
      const chat = state.chats.find((c) => c.id === action.payload);
      if (chat) {
        chat.unread = false;
        chat.unreadMessageCount = 0;
      }
    },
    updateChatSwapStatus: (
      state,
      action: PayloadAction<{ chatId: string; swapStatus: string }>,
    ) => {
      const chat = state.chats.find((c) => c.id === action.payload.chatId);
      if (chat) {
        chat.swapStatus = action.payload.swapStatus;
      }
    },
  },
});

// =========== SELECTORS ===========
const selectChats = (state: { chat: ChatState }) => state.chat.chats;

export const selectTotalUnreadCount = createSelector([selectChats], (chats) =>
  chats.reduce((total, chat) => {
    const count =
      chat.unreadMessageCount && chat.unreadMessageCount > 0
        ? chat.unreadMessageCount
        : chat.unread
          ? 1
          : 0;
    return total + count;
  }, 0),
);

export const makeSelectChatById = () =>
  createSelector(
    [selectChats, (_state: { chat: ChatState }, chatId: string) => chatId],
    (chats, chatId) => chats.find((c) => c.id === chatId),
  );

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
  updateChatSwapStatus,
} = chatSlice.actions;
export default chatSlice.reducer;
