import { TOrganizedData } from '../../../components/shared/SwapRequestModal/types/interface';
import { api } from '../../api/apiSlice';

export const swapApi = api.injectEndpoints({
  endpoints: (builder) => ({
    swapRequest: builder.mutation<{ success: boolean; message: string }, TOrganizedData>({
      query: (data) => {
        return {
          url: '/swap-requests',
          method: 'POST',
          body: JSON.stringify(data),
        };
      },
      invalidatesTags: ['SwapRequest'],
    }),
  }),
});

export const { useSwapRequestMutation } = swapApi;
