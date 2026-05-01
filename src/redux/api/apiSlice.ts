import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { USER_TOKEN_COOKIE_MINUTES } from '../../constants/session';
import { clearCookie, getCookie, isCookieExpired, setCookie } from '../../utility/cookies';

// =========== User Token ===========
// A single in-flight refresh promise prevents stampedes when many requests
// fire after a token expires.
let inflightRefresh: Promise<string | null> | null = null;

const performRefresh = async (): Promise<string | null> => {
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
  if (!data?.userToken) return null;
  setCookie('userToken', data.userToken, USER_TOKEN_COOKIE_MINUTES);
  // Rotation: backend now returns a new refresh token and revokes the old one.
  // Persist the rotated token so the next refresh has the live secret.
  if (data?.userRefreshToken) {
    setCookie('userRefreshToken', data.userRefreshToken, 10080);
  }
  return data.userToken as string;
};

const refreshUserToken = (): Promise<string | null> => {
  if (!inflightRefresh) {
    inflightRefresh = performRefresh().finally(() => {
      inflightRefresh = null;
    });
  }
  return inflightRefresh;
};

const getUserToken = async (): Promise<string | null> => {
  const token = getCookie('userToken');
  if (token && !isCookieExpired('userToken')) {
    return token;
  }
  return refreshUserToken();
};

const clearSession = () => {
  clearCookie('user');
  clearCookie('userToken');
  clearCookie('userRefreshToken');
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: async (headers) => {
    const userToken = await getUserToken();
    if (userToken) {
      headers.set('Authorization', `Bearer ${userToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  apiInstance,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, apiInstance, extraOptions);
  if (result.error?.status === 401) {
    const refreshed = await refreshUserToken();
    if (refreshed) {
      result = await rawBaseQuery(args, apiInstance, extraOptions);
    }
    if (result.error?.status === 401) {
      // Refresh failed (or unavailable) — drop the session and redirect once.
      clearSession();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth/')) {
        const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/auth/login?returnTo=${returnTo}`;
      }
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
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
