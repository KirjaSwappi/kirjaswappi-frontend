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
    getInbox: builder.query<InboxItem[], { userId: string }>({
      query: ({ userId }) => ({
        url: `/inbox?userId=${userId}`,
        method: 'GET',
      }),
      providesTags: ['Inbox'],
    }),

    getChatMessages: builder.query<ChatMessageApi[], { swapRequestId: string; userId: string }>({
      query: ({ swapRequestId, userId }) => ({
        url: `/swap-requests/${swapRequestId}/chat?userId=${userId}`,
        method: 'GET',
      }),
      providesTags: (result, error, { swapRequestId }) => [
        { type: 'ChatMessages', id: swapRequestId },
      ],
    }),

    sendChatMessage: builder.mutation<
      ChatMessageApi,
      { swapRequestId: string; userId: string; message?: string; images?: File[] }
    >({
      query: ({ swapRequestId, userId, message, images }) => {
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
          url: `/swap-requests/${swapRequestId}/chat?userId=${userId}`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { swapRequestId }) => [
        { type: 'ChatMessages', id: swapRequestId },
        'Inbox',
      ],
    }),
  }),
});

export const { useGetInboxQuery, useGetChatMessagesQuery, useSendChatMessageMutation } = inboxApi;
