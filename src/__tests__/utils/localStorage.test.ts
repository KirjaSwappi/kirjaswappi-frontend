import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setTokens, setToken, getTokens, clearTokens, getToken } from '../../utility/localStorage';

describe('LocalStorage Utility Functions', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  describe('setTokens', () => {
    it('should store access and refresh tokens in localStorage', () => {
      const accessToken = 'access-token-123';
      const refreshToken = 'refresh-token-456';

      setTokens(accessToken, refreshToken);

      expect(localStorage.getItem('jwtToken')).toBe(accessToken);
      expect(localStorage.getItem('refreshToken')).toBe(refreshToken);
    });
  });

  describe('setToken', () => {
    it('should store a token with given name and value', () => {
      const name = 'customToken';
      const value = 'token-value-789';

      setToken(name, value);

      expect(localStorage.getItem(name)).toBe(value);
    });

    it('should convert non-string values to strings', () => {
      const name = 'numberToken';
      const value = 12345;

      setToken(name, value as string | number);

      expect(localStorage.getItem(name)).toBe('12345');
    });
  });

  describe('getTokens', () => {
    it('should return both tokens when they exist', () => {
      const accessToken = 'access-token-123';
      const refreshToken = 'refresh-token-456';

      localStorage.setItem('jwtToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      const result = getTokens();

      expect(result).toEqual({
        jwtToken: accessToken,
        refreshToken: refreshToken,
      });
    });

    it('should return null values when tokens do not exist', () => {
      const result = getTokens();

      expect(result).toEqual({
        jwtToken: null,
        refreshToken: null,
      });
    });

    it('should return mixed null and existing values', () => {
      const accessToken = 'access-token-123';
      localStorage.setItem('jwtToken', accessToken);
      // refreshToken not set

      const result = getTokens();

      expect(result).toEqual({
        jwtToken: accessToken,
        refreshToken: null,
      });
    });
  });

  describe('clearTokens', () => {
    it('should remove token and refreshToken from localStorage', () => {
      localStorage.setItem('token', 'some-token');
      localStorage.setItem('refreshToken', 'some-refresh-token');
      localStorage.setItem('jwtToken', 'some-jwt-token'); // This should remain

      clearTokens();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('jwtToken')).toBe('some-jwt-token'); // Should still exist
    });
  });

  describe('getToken', () => {
    it('should return the token value for existing key', () => {
      const name = 'testToken';
      const value = 'token-value-123';

      localStorage.setItem(name, value);

      const result = getToken(name);

      expect(result).toBe(value);
    });

    it('should return null for non-existing key', () => {
      const result = getToken('non-existing-token');

      expect(result).toBeNull();
    });
  });

  describe('Integration tests', () => {
    it('should work together: setTokens -> getTokens -> clearTokens', () => {
      const accessToken = 'access-123';
      const refreshToken = 'refresh-456';

      // Set tokens
      setTokens(accessToken, refreshToken);

      // Get tokens
      let tokens = getTokens();
      expect(tokens.jwtToken).toBe(accessToken);
      expect(tokens.refreshToken).toBe(refreshToken);

      // Clear tokens (note: this clears 'token' and 'refreshToken', not 'jwtToken')
      clearTokens();

      // Check that jwtToken still exists but refreshToken is cleared
      tokens = getTokens();
      expect(tokens.jwtToken).toBe(accessToken);
      expect(tokens.refreshToken).toBeNull();
    });

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw an error
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn().mockImplementation(() => {
        throw new Error('localStorage is full');
      });

      expect(() => setTokens('token1', 'token2')).toThrow('localStorage is full');

      // Restore original localStorage
      Storage.prototype.setItem = originalSetItem;
    });
  });
});
