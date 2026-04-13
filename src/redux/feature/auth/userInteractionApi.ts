import { api } from '../../api/apiSlice';

export const userInteractionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    blockUser: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/users/${id}/block`,
        method: 'POST',
      }),
    }),
    unblockUser: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/users/${id}/block`,
        method: 'DELETE',
      }),
    }),
    muteUser: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/users/${id}/mute`,
        method: 'POST',
      }),
    }),
    unmuteUser: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/users/${id}/mute`,
        method: 'DELETE',
      }),
    }),
    reportUser: builder.mutation<void, { reportedUserId: string; reason: string }>({
      query: (body) => ({
        url: '/reports',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useBlockUserMutation,
  useUnblockUserMutation,
  useMuteUserMutation,
  useUnmuteUserMutation,
  useReportUserMutation,
} = userInteractionApi;
