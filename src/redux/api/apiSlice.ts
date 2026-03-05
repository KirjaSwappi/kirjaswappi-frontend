import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getCookie, isCookieExpired, setCookie } from '../../utility/cookies';

let isAuthenticating = false;
let pendingAuthPromise: Promise<string> | null = null;

const fetchToken = async () => {
  const data = JSON.stringify({
    username: `${import.meta.env.VITE_USERNAME}`,
    password: `${import.meta.env.VITE_PASSWORD}`,
  });
  const response = await fetch(`${import.meta.env.VITE_API_URL}/authenticate`, {
    method: 'POST',
    body: data,
    headers: { 'Content-Type': 'application/json' },
  });
  const { jwtToken, refreshToken } = await response.json();
  setCookie('jwtToken', jwtToken, 200); // 1 hour
  setCookie('refreshToken', refreshToken, 100); // 2 hours
  return jwtToken;
};

const refreshAuthToken = async () => {
  const refreshToken = getCookie('refreshToken');
  if (!refreshToken || isCookieExpired('refreshToken')) {
    return fetchToken();
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL}/authenticate/refresh`, {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();

  setCookie('jwtToken', data.jwtToken, 100); // 1 hour
  return data.jwtToken;
};

const getToken = async () => {
  let token = getCookie('jwtToken');

  if (!token || isCookieExpired('jwtToken')) {
    if (!isAuthenticating) {
      isAuthenticating = true;
      pendingAuthPromise = (async () => {
        try {
          return token ? await refreshAuthToken() : await fetchToken();
        } catch (error) {
          console.error('Authentication error:', error);
        } finally {
          isAuthenticating = false;
          pendingAuthPromise = null;
        }
      })();
    }
    token = await pendingAuthPromise;
  }

  return token;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: async (headers, { endpoint }) => {
      if (endpoint === 'authenticate') return headers;

      const token = await getToken();
      if (token) headers.set('Authorization', `Bearer ${token}`);

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
