import { setCookie } from '../../../utility/cookies';

import { api } from '../../api/apiSlice';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => {
        return {
          url: '/users/signup',
          method: 'POST',
          body: data,
        };
      },
    }),
    login: builder.mutation({
      query: (data) => {
        return {
          url: '/users/login',
          method: 'POST',
          body: data,
        };
      },
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const {
            data: { id, email },
          } = await queryFulfilled;
          if (id && email) {
            setCookie('user', { id, email }, 240);
          }
        } catch (error) {
          console.error("Can't set data in cookie. failed:", error);
        }
      },
    }),
    sentOTP: builder.query({
      query: ({ email }) => {
        return {
          url: `/send-otp`,
          method: 'POST',
          body: { email: email },
        };
      },
    }),
    verifyEmail: builder.mutation({
      query: ({ email, otp }) => {
        return {
          url: `/users/verify-email`,
          method: 'POST',
          body: { email: email, otp: otp },
        };
      },
    }),
    verifyOTP: builder.query({
      query: ({ email, otp }) => {
        return {
          url: `/verify-otp`,
          method: 'POST',
          body: { email: email, otp: otp },
        };
      },
    }),
    resetPassword: builder.mutation({
      query: (data) => {
        const { email } = data;
        const reset_password_data = {
          newPassword: data?.newPassword,
          confirmPassword: data?.confirmPassword,
        };
        return {
          url: `/users/reset-password/${email}`,
          method: 'POST',
          body: reset_password_data,
        };
      },
    }),
    deleteUser: builder.mutation({
      query: (id) => {
        return {
          url: `/users/${id}`,
          method: 'DELETE',
        };
      },
    }),
    getUserById: builder.query({
      query: (id) => {
        return {
          url: `/users/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['UpdateUser', 'AddBook', 'UpdateBook'],
    }),
    updateUserById: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/users/${id}`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['UpdateUser'],
    }),
    getUserProfileImage: builder.query({
      query: ({ userId }) => {
        return {
          url: `/photos/profile/by-id/${userId}`,
          method: 'GET',
        };
      },
      providesTags: ['AddProfileImage'],
    }),
    uploadProfileImage: builder.mutation({
      query: ({ id, image }) => {
        return {
          url: `/photos/profile?userId=${id}`,
          method: 'POST',
          body: image,
        };
      },
      invalidatesTags: ['AddProfileImage'],
    }),
    deleteProfileImage: builder.mutation({
      query: ({ id }) => {
        return {
          url: `/photos/profile?userId=${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['DeleteProfileImage'],
    }),
    getUserCoverImage: builder.query({
      query: ({ userId }) => {
        return {
          url: `/photos/cover/by-id/${userId}`,
          method: 'GET',
        };
      },
      providesTags: ['AddCoverImage'],
    }),
    uploadCoverImage: builder.mutation({
      query: ({ id, image }) => {
        return {
          url: `/photos/cover?userId=${id}`,
          method: 'POST',
          body: image,
        };
      },
      invalidatesTags: ['AddCoverImage', 'DeleteCoverImage'],
    }),
    deleteCoverImage: builder.mutation({
      query: ({ id }) => {
        return {
          url: `/photos/cover?userId=${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['DeleteCoverImage'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useDeleteUserMutation,
  useVerifyEmailMutation,
  useLazySentOTPQuery,
  useLazyVerifyOTPQuery,
  useResetPasswordMutation,
  useGetUserProfileImageQuery,
  useGetUserByIdQuery,
  useUploadProfileImageMutation,
  useDeleteProfileImageMutation,
  useUpdateUserByIdMutation,
  useGetUserCoverImageQuery,
  useUploadCoverImageMutation,
  useDeleteCoverImageMutation,
} = authApi;
