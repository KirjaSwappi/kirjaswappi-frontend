import { api } from '../../api/apiSlice';
import type { InboxItem } from './messagesSlice';

// API response shape for chat messages
export interface ChatMessageApi {
  id: string;
  imageUrls: string[] | null;
  message: string | null;
  ownMessage: boolean;
  readByReceiver: boolean;
  sender: { id: string; name: string } | null;
  sentAt: string;
  swapContext?: unknown | null;
  swapRequestId: string;
}

export const inboxApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInbox: builder.query<InboxItem[], { userId: string }>({
      query: ({ userId }) => ({
        url: `/inbox?userId=${userId}`,
        method: 'GET',
      }),
    }),

    getChatMessages: builder.query<ChatMessageApi[], { swapRequestId: string; userId: string }>({
      query: ({ swapRequestId, userId }) => ({
        url: `/swap-requests/${swapRequestId}/chat?userId=${userId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetInboxQuery, useGetChatMessagesQuery } = inboxApi;
