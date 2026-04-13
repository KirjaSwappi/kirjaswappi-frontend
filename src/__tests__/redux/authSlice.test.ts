import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock clearCookie before importing the slice
vi.mock('../../utility/cookies', () => ({
  clearCookie: vi.fn(),
  setCookie: vi.fn(),
}));

import authReducer, {
  initialState,
  logout,
  setOtp,
  setUserEmail,
  setError,
  setAuthMessage,
  setAuthSuccess,
  setUserInformation,
} from '../../redux/feature/auth/authSlice';

describe('authSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('logout', () => {
    it('should reset state to initial values', () => {
      const loggedInState = {
        ...initialState,
        loading: true,
        success: true,
        error: 'some error',
        message: 'some message',
        otp: ['1', '2', '3', '4', '5', '6'],
        userEmail: 'test@example.com',
        userInformation: {
          ...initialState.userInformation,
          id: 'user-123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          books: [],
        },
      };

      const result = authReducer(loggedInState, logout());

      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.message).toBeNull();
      expect(result.success).toBe(false);
      expect(result.otp).toEqual([]);
      expect(result.userEmail).toBe('');
      expect(result.userInformation).toEqual(initialState.userInformation);
    });

    it('should call clearCookie for all auth cookies', async () => {
      const { clearCookie } = await import('../../utility/cookies');
      authReducer(initialState, logout());

      expect(clearCookie).toHaveBeenCalledWith('user');
      expect(clearCookie).toHaveBeenCalledWith('jwtToken');
      expect(clearCookie).toHaveBeenCalledWith('refreshToken');
      expect(clearCookie).toHaveBeenCalledWith('userToken');
      expect(clearCookie).toHaveBeenCalledWith('userRefreshToken');
    });
  });

  describe('setOtp', () => {
    it('should set the OTP array', () => {
      const otp = ['1', '2', '3', '4', '5', '6'];
      const result = authReducer(initialState, setOtp(otp));

      expect(result.otp).toEqual(otp);
    });

    it('should replace existing OTP', () => {
      const stateWithOtp = { ...initialState, otp: ['9', '9', '9', '9', '9', '9'] };
      const newOtp = ['0', '0', '0', '0', '0', '0'];

      const result = authReducer(stateWithOtp, setOtp(newOtp));

      expect(result.otp).toEqual(newOtp);
    });
  });

  describe('setUserEmail', () => {
    it('should set the user email', () => {
      const result = authReducer(initialState, setUserEmail('user@example.com'));

      expect(result.userEmail).toBe('user@example.com');
    });

    it('should overwrite an existing email', () => {
      const stateWithEmail = { ...initialState, userEmail: 'old@example.com' };
      const result = authReducer(stateWithEmail, setUserEmail('new@example.com'));

      expect(result.userEmail).toBe('new@example.com');
    });
  });

  describe('setError', () => {
    it('should set an error string', () => {
      const result = authReducer(initialState, setError('Something went wrong'));

      expect(result.error).toBe('Something went wrong');
    });

    it('should clear error when set to null', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const result = authReducer(stateWithError, setError(null));

      expect(result.error).toBeNull();
    });
  });

  describe('setAuthMessage', () => {
    it('should set the message', () => {
      const result = authReducer(initialState, setAuthMessage('Operation successful'));

      expect(result.message).toBe('Operation successful');
    });

    it('should overwrite existing message', () => {
      const stateWithMessage = { ...initialState, message: 'Old message' };
      const result = authReducer(stateWithMessage, setAuthMessage('New message'));

      expect(result.message).toBe('New message');
    });
  });

  describe('setAuthSuccess', () => {
    it('should set success to true', () => {
      const result = authReducer(initialState, setAuthSuccess(true));

      expect(result.success).toBe(true);
    });

    it('should set success to false', () => {
      const stateWithSuccess = { ...initialState, success: true };
      const result = authReducer(stateWithSuccess, setAuthSuccess(false));

      expect(result.success).toBe(false);
    });
  });

  describe('setUserInformation', () => {
    it('should merge user information with defaults', () => {
      const userInfo = {
        id: 'user-123',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
      };

      const result = authReducer(initialState, setUserInformation(userInfo));

      expect(result.userInformation.id).toBe('user-123');
      expect(result.userInformation.firstName).toBe('Jane');
      expect(result.userInformation.lastName).toBe('Doe');
      expect(result.userInformation.email).toBe('jane@example.com');
      // Defaults retained
      expect(result.userInformation.books).toEqual([]);
      expect(result.userInformation.favGenres).toEqual([]);
    });

    it('should overwrite existing user information', () => {
      const stateWithUser = {
        ...initialState,
        userInformation: {
          ...initialState.userInformation,
          id: 'old-id',
          firstName: 'Old',
          lastName: 'User',
        },
      };

      const result = authReducer(
        stateWithUser,
        setUserInformation({ id: 'new-id', firstName: 'New', lastName: 'User' }),
      );

      expect(result.userInformation.id).toBe('new-id');
      expect(result.userInformation.firstName).toBe('New');
    });

    it('should reset to initial userInformation defaults when partial data provided', () => {
      const stateWithUser = {
        ...initialState,
        userInformation: {
          ...initialState.userInformation,
          id: 'user-123',
          email: 'test@test.com',
          firstName: 'Test',
          lastName: 'User',
          aboutMe: 'Some bio' as unknown as null,
        },
      };

      const result = authReducer(
        stateWithUser,
        setUserInformation({ id: 'user-456', lastName: '' }),
      );

      // aboutMe not passed → falls back to initialState default (null)
      expect(result.userInformation.aboutMe).toBeNull();
    });
  });

  describe('extraReducers - getUserById', () => {
    it('should set loading true on pending', () => {
      const result = authReducer(initialState, {
        type: 'api/executeQuery/pending',
        meta: { arg: { endpointName: 'getUserById' }, requestStatus: 'pending' },
      });
      expect(result.loading).toBe(true);
    });

    it('should set loading false on fulfilled', () => {
      const loadingState = { ...initialState, loading: true };
      const result = authReducer(loadingState, {
        type: 'api/executeQuery/fulfilled',
        payload: {},
        meta: { arg: { endpointName: 'getUserById' }, requestStatus: 'fulfilled' },
      });
      expect(result.loading).toBe(false);
    });

    it('should set loading false on rejected', () => {
      const loadingState = { ...initialState, loading: true };
      const result = authReducer(loadingState, {
        type: 'api/executeQuery/rejected',
        meta: { arg: { endpointName: 'getUserById' }, requestStatus: 'rejected' },
      });
      expect(result.loading).toBe(false);
    });
  });

  describe('extraReducers - login', () => {
    it('should set loading true and clear error on pending', () => {
      const stateWithError = { ...initialState, error: 'old error', success: true };
      const result = authReducer(stateWithError, {
        type: 'api/executeMutation/pending',
        meta: { arg: { endpointName: 'login' }, requestStatus: 'pending' },
      });
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
      expect(result.success).toBe(false);
    });

    it('should set user info and success message on fulfilled', () => {
      const result = authReducer(initialState, {
        type: 'api/executeMutation/fulfilled',
        payload: { id: 'user-1', email: 'user@example.com' },
        meta: { arg: { endpointName: 'login' }, requestStatus: 'fulfilled' },
      });
      expect(result.loading).toBe(false);
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.userInformation.id).toBe('user-1');
      expect(result.userInformation.email).toBe('user@example.com');
      expect(result.message).toBe('Login Successfully Done.');
    });

    it('should set error on rejected', () => {
      const result = authReducer(initialState, {
        type: 'api/executeMutation/rejected',
        payload: { status: 401, data: { error: { message: 'Invalid credentials' } } },
        meta: { arg: { endpointName: 'login' }, requestStatus: 'rejected' },
      });
      expect(result.loading).toBe(false);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });
  });

  describe('extraReducers - loginWithGoogle', () => {
    it('should set user info and success message on fulfilled', () => {
      const result = authReducer(initialState, {
        type: 'api/executeMutation/fulfilled',
        payload: { id: 'google-user-1', email: 'google@example.com' },
        meta: { arg: { endpointName: 'loginWithGoogle' }, requestStatus: 'fulfilled' },
      });
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.userInformation.id).toBe('google-user-1');
      expect(result.userInformation.email).toBe('google@example.com');
      expect(result.message).toBe('Login Successfully Done.');
    });
  });

  describe('extraReducers - register', () => {
    it('should set loading and clear flags on pending', () => {
      const result = authReducer(initialState, {
        type: 'api/executeMutation/pending',
        meta: { arg: { endpointName: 'register' }, requestStatus: 'pending' },
      });
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
      expect(result.success).toBe(false);
      expect(result.isVerify).toBe(false);
    });

    it('should set success and OTP message on fulfilled', () => {
      const result = authReducer(initialState, {
        type: 'api/executeMutation/fulfilled',
        payload: {},
        meta: { arg: { endpointName: 'register' }, requestStatus: 'fulfilled' },
      });
      expect(result.loading).toBe(false);
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.message).toBe('OTP has been sent to you email');
    });

    it('should set error on rejected', () => {
      const result = authReducer(initialState, {
        type: 'api/executeMutation/rejected',
        payload: { status: 409, data: { error: { message: 'Email already exists' } } },
        meta: { arg: { endpointName: 'register' }, requestStatus: 'rejected' },
      });
      expect(result.loading).toBe(false);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Email already exists');
    });
  });

  describe('extraReducers - sentOTP', () => {
    it('should set loading on pending', () => {
      const result = authReducer(initialState, {
        type: 'api/executeMutation/pending',
        meta: { arg: { endpointName: 'sentOTP' }, requestStatus: 'pending' },
      });
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
      expect(result.success).toBe(false);
    });

    it('should set success message on fulfilled', () => {
      const result = authReducer(initialState, {
        type: 'api/executeMutation/fulfilled',
        payload: {},
        meta: { arg: { endpointName: 'sentOTP' }, requestStatus: 'fulfilled' },
      });
      expect(result.loading).toBe(false);
      expect(result.success).toBe(true);
      expect(result.message).toBe('OTP has been sent to email.');
    });

    it('should set error on rejected', () => {
      const result = authReducer(initialState, {
        type: 'api/executeMutation/rejected',
        payload: { status: 400, data: { error: { message: 'User not found' } } },
        meta: { arg: { endpointName: 'sentOTP' }, requestStatus: 'rejected' },
      });
      expect(result.loading).toBe(false);
      expect(result.success).toBe(false);
      expect(result.error).toBe('User not found');
    });
  });

  describe('extraReducers - verifyEmail', () => {
    it('should set loading on pending', () => {
      const result = authReducer(initialState, {
        type: 'api/executeMutation/pending',
        meta: { arg: { endpointName: 'verifyEmail' }, requestStatus: 'pending' },
      });
      expect(result.loading).toBe(true);
    });

    it('should set success and message from payload on fulfilled', () => {
      const result = authReducer(initialState, {
        type: 'api/executeMutation/fulfilled',
        payload: { message: 'Email verified successfully' },
        meta: { arg: { endpointName: 'verifyEmail' }, requestStatus: 'fulfilled' },
      });
      expect(result.loading).toBe(false);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Email verified successfully');
    });

    it('should set error and clear message on rejected', () => {
      const stateWithMessage = { ...initialState, message: 'old message' };
      const result = authReducer(stateWithMessage, {
        type: 'api/executeMutation/rejected',
        payload: { status: 400, data: { error: { message: 'Invalid OTP' } } },
        meta: { arg: { endpointName: 'verifyEmail' }, requestStatus: 'rejected' },
      });
      expect(result.loading).toBe(false);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid OTP');
      expect(result.message).toBe('');
    });
  });

  describe('extraReducers - verifyOTP', () => {
    it('should set loading on pending', () => {
      const result = authReducer(initialState, {
        type: 'api/executeMutation/pending',
        meta: { arg: { endpointName: 'verifyOTP' }, requestStatus: 'pending' },
      });
      expect(result.loading).toBe(true);
    });

    it('should set success and message from payload on fulfilled', () => {
      const result = authReducer(initialState, {
        type: 'api/executeMutation/fulfilled',
        payload: { message: 'OTP verified' },
        meta: { arg: { endpointName: 'verifyOTP' }, requestStatus: 'fulfilled' },
      });
      expect(result.loading).toBe(false);
      expect(result.success).toBe(true);
      expect(result.message).toBe('OTP verified');
    });

    it('should set error and clear message on rejected', () => {
      const result = authReducer(initialState, {
        type: 'api/executeMutation/rejected',
        payload: { status: 400, data: { error: { message: 'OTP expired' } } },
        meta: { arg: { endpointName: 'verifyOTP' }, requestStatus: 'rejected' },
      });
      expect(result.loading).toBe(false);
      expect(result.error).toBe('OTP expired');
      expect(result.message).toBe('');
    });
  });

  describe('extraReducers - resetPassword', () => {
    it('should set loading on pending', () => {
      const result = authReducer(initialState, {
        type: 'api/executeMutation/pending',
        meta: { arg: { endpointName: 'resetPassword' }, requestStatus: 'pending' },
      });
      expect(result.loading).toBe(true);
    });

    it('should set success and message from payload on fulfilled', () => {
      const result = authReducer(initialState, {
        type: 'api/executeMutation/fulfilled',
        payload: { message: 'Password reset successfully' },
        meta: { arg: { endpointName: 'resetPassword' }, requestStatus: 'fulfilled' },
      });
      expect(result.loading).toBe(false);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Password reset successfully');
    });

    it('should set error and clear message on rejected', () => {
      const result = authReducer(initialState, {
        type: 'api/executeMutation/rejected',
        payload: { status: 400, data: { error: { message: 'Invalid token' } } },
        meta: { arg: { endpointName: 'resetPassword' }, requestStatus: 'rejected' },
      });
      expect(result.loading).toBe(false);
      expect(result.error).toBe('Invalid token');
      expect(result.message).toBe('');
    });
  });

  describe('initial state shape', () => {
    it('should have correct initial OTP array', () => {
      expect(initialState.otp).toHaveLength(6);
      expect(initialState.otp.every((v) => v === '')).toBe(true);
    });

    it('should have empty userInformation books', () => {
      expect(initialState.userInformation.books).toEqual([]);
    });

    it('should have isVerify false by default', () => {
      expect(initialState.isVerify).toBe(false);
    });

    it('should have loading false by default', () => {
      expect(initialState.loading).toBe(false);
    });

    it('should have null error by default', () => {
      expect(initialState.error).toBeNull();
    });
  });
});
