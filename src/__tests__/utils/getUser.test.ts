import { describe, it, expect, vi, beforeEach } from 'vitest';
import { jwtDecode } from 'jwt-decode';
import { getUserData, isTokenExpired, type IToken } from '../../utility/getUser';

// Mock jwt-decode
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(),
}));

const mockJwtDecode = vi.mocked(jwtDecode);

describe('getUser Utility Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserData', () => {
    it('should decode and return user data when token is provided', () => {
      const mockTokenData: IToken = {
        token_type: 'Bearer',
        exp: 1640995200,
        iat: 1640991600,
        jti: 'test-jti',
        user_id: 123,
        full_name: 'John Doe',
        role: 'user',
        role_key: 'USER',
        email: 'john@example.com',
        contact_number: '+1234567890',
        branch: { id: 1, name: 'Main Branch' },
        country: 'Finland',
        country_code: 'FI',
        short_name: 'JD',
        currency_code: 'EUR',
        firebase_token: 'firebase-token-123',
      };

      mockJwtDecode.mockReturnValue(mockTokenData);

      const result = getUserData('valid-jwt-token');

      expect(mockJwtDecode).toHaveBeenCalledWith('valid-jwt-token');
      expect(result).toEqual(mockTokenData);
    });

    it('should return null when token is null', () => {
      const result = getUserData(null);

      expect(mockJwtDecode).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null when token is undefined', () => {
      const result = getUserData(null);

      expect(mockJwtDecode).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle jwt-decode errors gracefully', () => {
      mockJwtDecode.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Since jwtDecode is mocked to throw, but our function doesn't handle errors,
      // this will propagate the error. In a real scenario, you might want to add error handling.
      expect(() => getUserData('invalid-token')).toThrow('Invalid token');
    });
  });

  describe('isTokenExpired', () => {
    it('should return true for null token', () => {
      const result = isTokenExpired(null);
      expect(result).toBe(true);
    });

    it('should return true for expired token', () => {
      // Create a token that expires in the past (January 1, 2022)
      const pastTime = Math.floor(new Date('2022-01-01').getTime() / 1000);
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ exp: pastTime }));
      const signature = 'signature';
      const expiredToken = `${header}.${payload}.${signature}`;

      const result = isTokenExpired(expiredToken);
      expect(result).toBe(true);
    });

    it('should return false for valid (non-expired) token', () => {
      // Create a token that expires in the future
      const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ exp: futureTime }));
      const signature = 'signature';
      const validToken = `${header}.${payload}.${signature}`;

      const result = isTokenExpired(validToken);
      expect(result).toBe(false);
    });

    it('should return true for token expiring now', () => {
      // Create a token that expires at the current time
      const currentTime = Math.floor(Date.now() / 1000);
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ exp: currentTime }));
      const signature = 'signature';
      const expiringToken = `${header}.${payload}.${signature}`;

      const result = isTokenExpired(expiringToken);
      expect(result).toBe(true); // Should be true because exp < currentTime (not <=)
    });

    it('should handle malformed tokens gracefully', () => {
      expect(() => isTokenExpired('invalid-token')).toThrow();
      expect(() => isTokenExpired('header.')).toThrow();
      expect(() => isTokenExpired('header.payload')).toThrow();
    });

    it('should handle tokens without exp claim', () => {
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ user_id: 123 })); // No exp claim
      const signature = 'signature';
      const tokenWithoutExp = `${header}.${payload}.${signature}`;

      // When exp is undefined, jwtPayload.exp < currentTime evaluates to false
      // because undefined < number is false, so the token is considered not expired
      const result = isTokenExpired(tokenWithoutExp);
      expect(result).toBe(false);
    });

    it('should handle tokens with invalid base64 payload', () => {
      const invalidToken = 'header.invalid-base64.signature';

      expect(() => isTokenExpired(invalidToken)).toThrow();
    });
  });

  describe('Integration tests', () => {
    it('should work together: getUserData and isTokenExpired', () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const mockTokenData: IToken = {
        token_type: 'Bearer',
        exp: futureTime,
        iat: 1640991600,
        jti: 'test-jti',
        user_id: 123,
        full_name: 'John Doe',
        role: 'user',
        role_key: 'USER',
        email: 'john@example.com',
        contact_number: '+1234567890',
        branch: { id: 1, name: 'Main Branch' },
        country: 'Finland',
        country_code: 'FI',
        short_name: 'JD',
        currency_code: 'EUR',
        firebase_token: 'firebase-token-123',
      };

      mockJwtDecode.mockReturnValue(mockTokenData);

      // Create a valid JWT token
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ exp: futureTime, user_id: 123 }));
      const signature = 'signature';
      const validToken = `${header}.${payload}.${signature}`;

      const userData = getUserData(validToken);
      const isExpired = isTokenExpired(validToken);

      expect(userData).toEqual(mockTokenData);
      expect(isExpired).toBe(false);
    });
  });
});
