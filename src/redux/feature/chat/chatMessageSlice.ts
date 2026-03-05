import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Represents a single chat message from the backend (ChatMessageResponse)
 */
export interface ChatMessage {
  id: string;
  swapRequestId: string;
  sender: {
    id: string;
    name: string;
  };
  message: string | null;
  imageUrls?: string[] | null;
  sentAt: string; // ISO 8601 timestamp
  readByReceiver: boolean;
  ownMessage: boolean;
}

/**
 * Inbox item (InboxItemResponse)
 */
export interface InboxItem {
  id: string;
  swapType: string;
  swapStatus: string;
  requestedAt: string;
  updatedAt: string;
  sender: {
    id: string;
    name: string;
  };
  receiver: {
    id: string;
    name: string;
  };
  bookToSwapWith?: {
    id: string;
    title: string;
    author?: string;
    condition?: string;
  };
  unreadMessageCount: number;
  isUnread: boolean;
  hasNewMessages: boolean;
  conversationType: 'sent' | 'received';
  lastMessageContent?: string;
  lastMessageSenderId?: string;
  lastMessageSentAt?: string;
  lastMessageIsImage?: boolean;
}

export interface ChatState {
  // Active conversation: keyed by swapRequestId
  messages: Record<string, ChatMessage[]>;
  // Inbox list
  inbox: InboxItem[];
  // Loading state
  isLoadingMessages: boolean;
  isLoadingInbox: boolean;
}

const initialState: ChatState = {
  messages: {},
  inbox: [],
  isLoadingMessages: false,
  isLoadingInbox: false,
};

const chatMessageSlice = createSlice({
  name: 'chatMessages',
  initialState,
  reducers: {
    // Set initial messages for a conversation (from REST fetch)
    setMessages: (
      state,
      action: PayloadAction<{ swapRequestId: string; messages: ChatMessage[] }>,
    ) => {
      const { swapRequestId, messages } = action.payload;
      state.messages[swapRequestId] = messages;
    },
    // Add a new incoming message (from STOMP)
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const { swapRequestId } = action.payload;
      if (!state.messages[swapRequestId]) {
        state.messages[swapRequestId] = [];
      }
      // Avoid duplicates
      const exists = state.messages[swapRequestId].some((m) => m.id === action.payload.id);
      if (!exists) {
        state.messages[swapRequestId].push(action.payload);
      }
    },
    // Clear messages for a conversation (on unmount)
    clearMessages: (state, action: PayloadAction<string>) => {
      delete state.messages[action.payload];
    },
    setLoadingMessages: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMessages = action.payload;
    },
    // Set inbox items (from REST fetch or STOMP update)
    setInbox: (state, action: PayloadAction<InboxItem[]>) => {
      state.inbox = action.payload;
    },
    // Update a single inbox item in-place (from STOMP delta update)
    updateInboxItem: (state, action: PayloadAction<InboxItem>) => {
      const idx = state.inbox.findIndex((item) => item.id === action.payload.id);
      if (idx !== -1) {
        state.inbox[idx] = action.payload;
      } else {
        // Insert at top if not found (new conversation)
        state.inbox.unshift(action.payload);
      }
    },
    setLoadingInbox: (state, action: PayloadAction<boolean>) => {
      state.isLoadingInbox = action.payload;
    },
  },
});

export const {
  setMessages,
  addMessage,
  clearMessages,
  setLoadingMessages,
  setInbox,
  updateInboxItem,
  setLoadingInbox,
} = chatMessageSlice.actions;

export default chatMessageSlice.reducer;
