import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { api } from '../../../redux/api/apiSlice';

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

// Mock @react-oauth/google before importing the component
vi.mock('@react-oauth/google', () => ({
  GoogleLogin: ({
    onSuccess,
    onError,
  }: {
    onSuccess: (res: unknown) => void;
    onError: () => void;
  }) => (
    <button
      data-testid="google-login-btn"
      onClick={() => onSuccess({ credential: 'mock-id-token' })}
      onKeyDown={() => onError()}
    >
      Sign in with Google
    </button>
  ),
}));

vi.mock('../../../components/shared/toast', () => ({
  showToast: vi.fn(),
}));

vi.mock('../../../redux/hooks', () => ({
  useAppDispatch: () => vi.fn(),
}));

// Mock the auth API mutation
const mockLoginWithGoogle = vi.fn(() =>
  Promise.resolve({ data: { id: '1', email: 'test@test.com' } }),
);
vi.mock('../../../redux/feature/auth/authApi', () => ({
  useLoginWithGoogleMutation: () => [mockLoginWithGoogle],
}));

import GoogleLoginButton from '../../../components/shared/GoogleLoginButton';

describe('GoogleLoginButton', () => {
  const renderComponent = () => {
    const store = configureStore({
      reducer: {
        [api.reducerPath]: api.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
    });
    return render(
      <Provider store={store}>
        <GoogleLoginButton />
      </Provider>,
    );
  };

  it('renders the Google login button', () => {
    renderComponent();
    expect(screen.getByTestId('google-login-btn')).toBeInTheDocument();
  });

  it('renders button text', () => {
    renderComponent();
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
  });

  it('calls loginWithGoogle on successful Google response', async () => {
    renderComponent();
    screen.getByTestId('google-login-btn').click();
    expect(mockLoginWithGoogle).toHaveBeenCalledWith({ idToken: 'mock-id-token' });
  });
});
