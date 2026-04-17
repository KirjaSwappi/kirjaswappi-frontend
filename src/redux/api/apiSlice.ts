import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getCookie, isCookieExpired, setCookie } from '../../utility/cookies';

// =========== User Token ===========
const refreshUserToken = async () => {
  const userRefreshToken = getCookie('userRefreshToken');
  if (!userRefreshToken || isCookieExpired('userRefreshToken')) {
    return null;
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL}/users/refresh-token`, {
    method: 'POST',
    body: JSON.stringify({ userRefreshToken }),
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  setCookie('userToken', data.userToken, 100);
  return data.userToken;
};

const getUserToken = async (): Promise<string | null> => {
  let token = getCookie('userToken');
  if (token && !isCookieExpired('userToken')) {
    return token;
  }
  // Try refreshing
  token = await refreshUserToken();
  return token;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: async (headers) => {
      const userToken = await getUserToken();
      if (userToken) {
        headers.set('Authorization', `Bearer ${userToken}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'AddProfileImage',
    'UpdateUser',
    'AddCoverImage',
    'DeleteCoverImage',
    'DeleteProfileImage',
    'AddBook',
    'UpdateBook',
    'DeleteBook',
    'SwapRequest',
    'Inbox',
    'ChatMessages',
  ],
  endpoints: () => ({}),
});
