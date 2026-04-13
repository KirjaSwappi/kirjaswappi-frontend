import { TOrganizedData } from '../../../components/shared/SwapRequestModal/types/interface';
import { api } from '../../api/apiSlice';

export const swapApi = api.injectEndpoints({
  endpoints: (builder) => ({
    swapRequest: builder.mutation<{ success: boolean; message: string }, TOrganizedData>({
      query: (data) => {
        return {
          url: '/swap-requests',
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['SwapRequest', 'Inbox'],
    }),
    updateSwapRequestStatus: builder.mutation<unknown, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/swap-requests/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Inbox', 'SwapRequest'],
    }),
  }),
});

export const { useSwapRequestMutation, useUpdateSwapRequestStatusMutation } = swapApi;
