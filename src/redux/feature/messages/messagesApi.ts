import { api } from '../../api/apiSlice';

export const messagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllMessagesByUserId: builder.query({
      query: ({ userId }: { userId: string | undefined }) => {
        return {
          url: `/inbox?userId=${userId}`,
          method: 'GET',
        };
      },
    }),
    getSwapRequestMessagesByUserId: builder.query({
      query: ({ userId }: { userId: string }) => {
        return {
          url: `/swap-requests/${userId}/chat`,
          method: 'GET',
        };
      },
    }),
    sentMessage: builder.mutation({
      query: ({
        data,
        userId,
      }: {
        userId: string;
        data: { message: string; images: string[] };
      }) => {
        return {
          url: `/swap-requests/${userId}/chat`,
          method: 'POST',
          body: { ...data },
        };
      },
    }),
  }),
});

export const {
  useGetAllMessagesByUserIdQuery,
  useGetSwapRequestMessagesByUserIdQuery,
  useSentMessageMutation,
} = messagesApi;
