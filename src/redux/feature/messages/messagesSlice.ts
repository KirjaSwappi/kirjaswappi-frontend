import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 📁 src/features/chat/types.ts
export interface Message {
  id: number;
  sender: 'me' | 'them';
  text: string;
  time: string;
  unread?: boolean;
}

export interface Chat {
  id: string;
  name: string;
  unread: boolean;
  messages: Message[];
}

export interface ChatState {
  chats: Chat[];
  selectedChatId: string;
}

const initialState: ChatState = {
  chats: [
    {
      id: '1',
      name: 'Harry Porter',
      unread: true,
      messages: [
        { id: 1, sender: 'them', text: 'Hi! How are you?', time: '9:00 AM', unread: true },
      ],
    },
    {
      id: '2',
      name: 'Marr’s Search for Meaning',
      unread: false,
      messages: [
        { id: 1, sender: 'them', text: 'I want to swap this book.', time: '9:12 AM' },
        { id: 2, sender: 'me', text: 'Anyone here to chat?', time: '9:17 AM' },
      ],
    },
    {
      id: '3',
      name: 'Marr’s Search for Meaning',
      unread: false,
      messages: [
        { id: 1, sender: 'them', text: 'I want to swap this book.', time: '9:12 AM' },
        { id: 2, sender: 'me', text: 'Anyone here to chat?', time: '9:17 AM' },
      ],
    },
    {
      id: '4',
      name: 'Marr’s Search for Meaning ',
      unread: false,
      messages: [
        { id: 1, sender: 'them', text: 'I want to swap this book.', time: '9:12 AM' },
        { id: 2, sender: 'me', text: 'Anyone here to chat?', time: '9:17 AM' },
      ],
    },
  ],
  selectedChatId: '2',
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    selectChat: (state, action: PayloadAction<string>) => {
      state.selectedChatId = action.payload;
      const chat = state.chats.find((c) => c.id === action.payload);
      if (chat) {
        chat.unread = false;
        chat.messages = chat.messages.map((m) => ({ ...m, unread: false }));
      }
    },
    sendMessage: (state, action: PayloadAction<{ chatId: string; text: string }>) => {
      const { chatId, text } = action.payload;
      const chat = state.chats.find((c) => c.id === chatId);
      if (chat) {
        const message = {
          id: Date.now(),
          sender: 'me' as const,
          text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        chat.messages.push(message);
      }
    },
    receiveMessage: (state, action: PayloadAction<{ chatId: string; text: string }>) => {
      const { chatId, text } = action.payload;
      const chat = state.chats.find((c) => c.id === chatId);
      if (chat) {
        const message = {
          id: Date.now(),
          sender: 'them' as const,
          text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          unread: true,
        };
        chat.messages.push(message);
        if (state.selectedChatId !== chatId) {
          chat.unread = true;
        }
      }
    },
  },
});

export const { selectChat, sendMessage, receiveMessage } = chatSlice.actions;
export default chatSlice.reducer;
