import { api } from '../../api/apiSlice';

export const userInteractionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    blockUser: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/users/${id}/block`,
        method: 'POST',
      }),
      invalidatesTags: ['UpdateUser'],
    }),
    unblockUser: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/users/${id}/block`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UpdateUser'],
    }),
    muteUser: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/users/${id}/mute`,
        method: 'POST',
      }),
      invalidatesTags: ['UpdateUser'],
    }),
    unmuteUser: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/users/${id}/mute`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UpdateUser'],
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
