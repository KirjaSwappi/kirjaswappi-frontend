import { api } from '../../api/apiSlice';
import type { InboxItem } from './messagesSlice';

export interface SwapContextResponse {
  requestedBook: {
    id: string;
    title: string;
    author: string;
    condition: string;
    coverPhotoUrl: string | null;
  };
  offeredBook?: {
    id: string;
    title: string;
    author: string;
    condition: string | null;
    coverPhotoUrl: string | null;
  };
  offeredGenreName?: string;
  swapType: string;
  swapStatus: string;
  askForGiveaway: boolean;
}

export interface ChatMessageApi {
  id: string;
  swapRequestId: string;
  sender: { id: string; name: string };
  message: string | null;
  imageUrls: string[] | null;
  sentAt: string;
  readByReceiver: boolean;
  ownMessage: boolean;
  swapContext?: SwapContextResponse | null;
}

export const inboxApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInbox: builder.query<InboxItem[], void>({
      query: () => ({
        url: '/inbox',
        method: 'GET',
      }),
      providesTags: ['Inbox'],
    }),

    getChatMessages: builder.query<ChatMessageApi[], { swapRequestId: string }>({
      query: ({ swapRequestId }) => ({
        url: `/swap-requests/${swapRequestId}/chat`,
        method: 'GET',
      }),
      providesTags: (_result, _error, { swapRequestId }) => [
        { type: 'ChatMessages', id: swapRequestId },
      ],
    }),

    getInboxByStatus: builder.query<InboxItem[], { status: string }>({
      query: ({ status }) => ({
        url: `/inbox?status=${status}`,
        method: 'GET',
      }),
      providesTags: ['Inbox'],
    }),

    sendChatMessage: builder.mutation<
      ChatMessageApi,
      { swapRequestId: string; message?: string; images?: File[] }
    >({
      query: ({ swapRequestId, message, images }) => {
        const formData = new FormData();
        if (message) {
          formData.append('message', message);
        }
        if (images && images.length > 0) {
          images.forEach((image) => {
            formData.append('images', image);
          });
        }

        return {
          url: `/swap-requests/${swapRequestId}/chat`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { swapRequestId }) => [
        { type: 'ChatMessages', id: swapRequestId },
        'Inbox',
      ],
    }),

    markChatAsRead: builder.mutation<void, { swapRequestId: string }>({
      query: ({ swapRequestId }) => ({
        url: `/swap-requests/${swapRequestId}/chat/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Inbox'],
    }),
  }),
});

export const {
  useGetInboxQuery,
  useGetInboxByStatusQuery,
  useGetChatMessagesQuery,
  useSendChatMessageMutation,
  useMarkChatAsReadMutation,
} = inboxApi;
