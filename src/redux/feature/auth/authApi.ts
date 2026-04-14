import { FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import { setCookie } from '../../../utility/cookies';

import { api } from '../../api/apiSlice';
import { bookApi } from '../book/bookApi';

type LoginResponse = { id: string; email: string; userToken: string; userRefreshToken: string };
const handleLoginCookie = async (
  queryFulfilled: Promise<{ data: LoginResponse; meta: FetchBaseQueryMeta | undefined }>,
) => {
  try {
    const {
      data: { id, email, userToken, userRefreshToken },
    } = await queryFulfilled;
    if (id && email) {
      setCookie('user', { id, email }, 240);
    }
    if (userToken) {
      setCookie('userToken', userToken, 200);
    }
    if (userRefreshToken) {
      setCookie('userRefreshToken', userRefreshToken, 10080); // 7 days
    }
  } catch {
    // Login failure is handled by RTK Query matchers in authSlice
  }
};

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
        await handleLoginCookie(queryFulfilled);
      },
    }),
    loginWithGoogle: builder.mutation({
      query: ({ idToken }) => {
        return {
          url: '/users/login-with-google',
          method: 'POST',
          body: { idToken: idToken },
        };
      },
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        await handleLoginCookie(queryFulfilled);
        dispatch(bookApi.endpoints.getAllBooks.initiate({}));
      },
    }),
    sentOTP: builder.mutation({
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
    verifyOTP: builder.mutation({
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
          resetToken: data?.resetToken,
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
      query: ({ userId }: { userId: string }) => {
        return {
          url: `/users/${userId}`,
          method: 'GET',
        };
      },
      providesTags: ['UpdateUser', 'AddBook', 'UpdateBook', 'DeleteBook'],
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
          url: `/photos/profile/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['AddProfileImage'],
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
          url: `/photos/cover/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['AddCoverImage'],
    }),
    addFavouriteBook: builder.mutation({
      query: ({ userId, bookId }: { userId: string; bookId: string }) => ({
        url: '/users/favourite-books',
        method: 'POST',
        body: { userId, bookId },
      }),
      invalidatesTags: ['UpdateUser'],
    }),
    changePassword: builder.mutation({
      query: ({
        email,
        currentPassword,
        newPassword,
        confirmPassword,
      }: {
        email: string;
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
      }) => ({
        url: `/users/change-password/${email}`,
        method: 'POST',
        body: { currentPassword, newPassword, confirmPassword },
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useDeleteUserMutation,
  useVerifyEmailMutation,
  useSentOTPMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
  useGetUserProfileImageQuery,
  useGetUserByIdQuery,
  useUploadProfileImageMutation,
  useDeleteProfileImageMutation,
  useUpdateUserByIdMutation,
  useGetUserCoverImageQuery,
  useUploadCoverImageMutation,
  useDeleteCoverImageMutation,
  useLoginWithGoogleMutation,
  useAddFavouriteBookMutation,
  useChangePasswordMutation,
} = authApi;
