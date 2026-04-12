import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBook } from '../../../pages/books/types/interface';
import { clearCookie } from '../../../utility/cookies';
import { extractApiErrorMessage } from '../../../utility/rtkError';
import { authApi } from './authApi';

export interface IInitialState {
  loading: boolean;
  error: undefined | null | string;
  message: null | string;
  success: boolean;
  userInformation: {
    id?: string;
    firstName?: string;
    lastName: string;
    email?: string;
    streetName?: null;
    houseNumber?: null;
    zipCode?: number;
    city?: null;
    country?: null;
    phoneNumber?: null;
    aboutMe?: null;
    favGenres?: string[];
    books: IBook[];
  };
  otp: string[];
  userEmail: string;
  isVerify: boolean;
}

export const initialState: IInitialState = {
  loading: false,
  error: null,
  message: null,
  success: false,
  userInformation: {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    streetName: null,
    houseNumber: null,
    zipCode: 0,
    city: null,
    country: null,
    phoneNumber: null,
    aboutMe: null,
    favGenres: [],
    books: [],
  },
  otp: Array(6).fill(''),
  userEmail: '',
  isVerify: false,
};

const setRejected = (state: IInitialState, action: { payload?: unknown }, clearMessage = false) => {
  state.loading = false;
  state.error = extractApiErrorMessage(action.payload);
  state.success = false;
  if (clearMessage) state.message = '';
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      clearCookie('user');
      clearCookie('jwtToken');
      clearCookie('refreshToken');
      clearCookie('userToken');
      clearCookie('userRefreshToken');
      state.userInformation = initialState.userInformation;
      state.loading = false;
      state.error = null;
      state.message = null;
      state.otp = [];
      state.userEmail = '';
      state.success = false;
    },
    setOtp: (state, action) => {
      state.otp = action.payload;
    },
    setUserEmail: (state, action) => {
      state.userEmail = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setVerify: (state, action) => {
      state.isVerify = action.payload;
    },
    setAuthMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    setAuthSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    setUserInformation: (state, action) => {
      state.userInformation = { ...initialState.userInformation, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // =========== getUserById ===========
    builder.addMatcher(authApi.endpoints.getUserById.matchPending, (state) => {
      state.loading = true;
    });
    builder.addMatcher(authApi.endpoints.getUserById.matchFulfilled, (state) => {
      state.loading = false;
    });
    builder.addMatcher(authApi.endpoints.getUserById.matchRejected, (state) => {
      state.loading = false;
    });

    // =========== login ===========
    builder.addMatcher(authApi.endpoints.login.matchPending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
      const { id, email } = action.payload;
      state.loading = false;
      state.error = null;
      state.success = true;
      state.userInformation = { ...initialState.userInformation, id, email };
      state.message = 'Login Successfully Done.';
    });
    builder.addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
      setRejected(state, action);
    });

    // =========== loginWithGoogle ===========
    builder.addMatcher(authApi.endpoints.loginWithGoogle.matchFulfilled, (state, action) => {
      const { id, email } = action.payload;
      state.loading = false;
      state.error = null;
      state.success = true;
      state.userInformation = { ...initialState.userInformation, id, email };
      state.message = 'Login Successfully Done.';
    });

    // =========== register ===========
    builder.addMatcher(authApi.endpoints.register.matchPending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.isVerify = false;
    });
    builder.addMatcher(authApi.endpoints.register.matchFulfilled, (state) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.message = 'OTP has been sent to you email';
    });
    builder.addMatcher(authApi.endpoints.register.matchRejected, (state, action) => {
      setRejected(state, action);
    });

    // =========== sentOTP ===========
    builder.addMatcher(authApi.endpoints.sentOTP.matchPending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addMatcher(authApi.endpoints.sentOTP.matchFulfilled, (state) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.message = 'OTP has been sent to email.';
    });
    builder.addMatcher(authApi.endpoints.sentOTP.matchRejected, (state, action) => {
      setRejected(state, action);
    });

    // =========== verifyEmail ===========
    builder.addMatcher(authApi.endpoints.verifyEmail.matchPending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addMatcher(authApi.endpoints.verifyEmail.matchFulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.message = action.payload?.message;
      state.success = true;
    });
    builder.addMatcher(authApi.endpoints.verifyEmail.matchRejected, (state, action) => {
      setRejected(state, action, true);
    });

    // =========== verifyOTP ===========
    builder.addMatcher(authApi.endpoints.verifyOTP.matchPending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addMatcher(authApi.endpoints.verifyOTP.matchFulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.message = action.payload?.message;
      state.success = true;
    });
    builder.addMatcher(authApi.endpoints.verifyOTP.matchRejected, (state, action) => {
      setRejected(state, action, true);
    });

    // =========== resetPassword ===========
    builder.addMatcher(authApi.endpoints.resetPassword.matchPending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addMatcher(authApi.endpoints.resetPassword.matchFulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.message = action.payload?.message;
      state.success = true;
    });
    builder.addMatcher(authApi.endpoints.resetPassword.matchRejected, (state, action) => {
      setRejected(state, action, true);
    });
  },
});

export const {
  setOtp,
  setUserEmail,
  setError,
  setVerify,
  logout,
  setAuthMessage,
  setAuthSuccess,
  setUserInformation,
} = authSlice.actions;
export default authSlice.reducer;
