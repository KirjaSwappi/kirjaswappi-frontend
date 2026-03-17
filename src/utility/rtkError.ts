import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error;
}

interface ApiErrorPayload {
  error?: {
    code?: string;
    message?: string;
  };
}

export function extractApiErrorMessage(
  payload: FetchBaseQueryError | undefined,
): string | undefined {
  const data = (payload as FetchBaseQueryError | undefined)?.data as ApiErrorPayload | undefined;
  if (data && typeof data.error === 'object' && data.error !== null) {
    return data.error.message;
  }
  return undefined;
}
