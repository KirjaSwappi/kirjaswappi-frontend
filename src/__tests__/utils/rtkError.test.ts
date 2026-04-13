import { describe, it, expect } from 'vitest';
import { isFetchBaseQueryError, extractApiErrorMessage } from '../../utility/rtkError';

describe('rtkError utilities', () => {
  describe('isFetchBaseQueryError', () => {
    it('returns true for FetchBaseQueryError-like objects', () => {
      expect(isFetchBaseQueryError({ status: 400, data: {} })).toBe(true);
    });

    it('returns false for null', () => {
      expect(isFetchBaseQueryError(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isFetchBaseQueryError(undefined)).toBe(false);
    });

    it('returns false for string', () => {
      expect(isFetchBaseQueryError('error')).toBe(false);
    });

    it('returns false for number', () => {
      expect(isFetchBaseQueryError(404)).toBe(false);
    });

    it('returns false for object without status', () => {
      expect(isFetchBaseQueryError({ data: {} })).toBe(false);
    });

    it('returns true for object with status property', () => {
      expect(isFetchBaseQueryError({ status: 'PARSING_ERROR' })).toBe(true);
    });
  });

  describe('extractApiErrorMessage', () => {
    it('extracts message from valid API error', () => {
      const error = {
        status: 400,
        data: {
          error: {
            code: 'INVALID_INPUT',
            message: 'Email is required',
          },
        },
      };
      expect(extractApiErrorMessage(error)).toBe('Email is required');
    });

    it('returns undefined for non-FetchBaseQueryError', () => {
      expect(extractApiErrorMessage('some error')).toBeUndefined();
    });

    it('returns undefined when data has no error object', () => {
      const error = { status: 400, data: {} };
      expect(extractApiErrorMessage(error)).toBeUndefined();
    });

    it('returns undefined when data is undefined', () => {
      const error = { status: 400, data: undefined };
      expect(extractApiErrorMessage(error)).toBeUndefined();
    });

    it('returns undefined when error is not an object', () => {
      const error = { status: 400, data: { error: 'string error' } };
      expect(extractApiErrorMessage(error)).toBeUndefined();
    });

    it('returns undefined when error.message is missing', () => {
      const error = { status: 400, data: { error: { code: 'ERR' } } };
      expect(extractApiErrorMessage(error)).toBeUndefined();
    });
  });
});
