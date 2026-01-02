import { api } from '../../api/apiSlice';

export const inboxApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getInbox: builder.query<any[], { userId: string }>({
      query: ({ userId }) => {
        return {
          url: `/inbox?userId=${userId}`,
          method: 'GET',
        };
      },
    }),
  }),
});

export const { useGetInboxQuery } = inboxApi;
