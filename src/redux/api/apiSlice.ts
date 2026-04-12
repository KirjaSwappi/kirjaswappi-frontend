import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getCookie, isCookieExpired, setCookie } from '../../utility/cookies';

// =========== Platform (Admin) Token ===========
let isAuthenticating = false;
let pendingAuthPromise: Promise<string | null> | null = null;

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
  if (!response.ok) {
    throw new Error(`Authentication failed with status ${response.status}`);
  }
  const { jwtToken, refreshToken } = await response.json();
  setCookie('jwtToken', jwtToken, 200);
  setCookie('refreshToken', refreshToken, 100);
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
  if (!response.ok) {
    return fetchToken();
  }
  const data = await response.json();

  setCookie('jwtToken', data.jwtToken, 100);
  return data.jwtToken;
};

const getPlatformToken = async () => {
  let token = getCookie('jwtToken');

  if (!token || isCookieExpired('jwtToken')) {
    if (!isAuthenticating) {
      isAuthenticating = true;
      pendingAuthPromise = (async () => {
        try {
          return token ? await refreshAuthToken() : await fetchToken();
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
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

// Endpoints that require user auth (must not fall back to platform token)
const USER_ONLY_ENDPOINTS = [
  'getInbox',
  'getChatMessages',
  'sendChatMessage',
  'updateSwapRequestStatus',
];

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: async (headers, { endpoint }) => {
      if (endpoint === 'authenticate') return headers;

      // Try user token first (for user-facing endpoints)
      const userToken = await getUserToken();
      if (userToken) {
        headers.set('Authorization', `Bearer ${userToken}`);
        return headers;
      }

      // Don't fall back to platform token for user-scoped endpoints
      if (USER_ONLY_ENDPOINTS.includes(endpoint)) {
        return headers;
      }

      // Fall back to platform token
      const token = await getPlatformToken();
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
