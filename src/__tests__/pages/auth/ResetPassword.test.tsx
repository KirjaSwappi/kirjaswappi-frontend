import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../assets/authShape.png', () => ({ default: 'shape.png' }));
vi.mock('../../../assets/leftArrow.png', () => ({ default: 'left.png' }));
vi.mock('../../../assets/logo.png', () => ({ default: 'logo.png' }));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../components/shared/Button', () => ({
  default: ({
    children,
    onClick,
    className,
    type,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: string;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={className}
      type={type as 'button' | 'submit'}
      disabled={disabled}
    >
      {children}
    </button>
  ),
}));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt || ''} />,
}));

vi.mock('../../../components/shared/MessageToastify', () => ({
  default: ({ value }: { value?: string }) =>
    value ? <div data-testid="message">{value}</div> : null,
}));

vi.mock('../../../components/shared/OTP', () => ({
  default: () => <div data-testid="otp-input">OTP</div>,
}));

vi.mock('../../../components/shared/toast', () => ({
  showToast: vi.fn(),
}));

vi.mock('../../../constant/MESSAGETYPE', () => ({
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
}));

vi.mock('../../../redux/feature/auth/authApi', () => ({
  useSentOTPMutation: () => [vi.fn().mockResolvedValue({ data: true }), { isLoading: false }],
  useVerifyOTPMutation: () => [vi.fn().mockResolvedValue({ data: true }), { isLoading: false }],
  useResetPasswordMutation: () => [vi.fn().mockResolvedValue({ data: true }), { isLoading: false }],
}));

vi.mock('../../../redux/feature/auth/authSlice', () => ({
  setAuthMessage: (payload: unknown) => ({ type: 'auth/setAuthMessage', payload }),
  setError: (payload: unknown) => ({ type: 'auth/setError', payload }),
  setOtp: (payload: unknown) => ({ type: 'auth/setOtp', payload }),
}));

vi.mock('../../../redux/feature/notification/notificationSlice', () => ({
  setMessages: (payload: unknown) => ({ type: 'notification/setMessages', payload }),
}));

vi.mock('../../../redux/feature/step/stepSlice', () => ({
  setStep: (payload: unknown) => ({ type: 'step/setStep', payload }),
}));

vi.mock('../../../pages/auth/resetPassword/_component/GetOTPByEmail', () => ({
  default: ({
    handleChange,
    error,
  }: {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
  }) => (
    <div data-testid="get-otp">
      <input data-testid="email-input" name="email" onChange={handleChange} placeholder="Email" />
      {error && <span>{error}</span>}
    </div>
  ),
}));

vi.mock('../../../pages/auth/resetPassword/_component/NewPassword', () => ({
  default: () => <div data-testid="new-password">NewPassword</div>,
}));

import ResetPassword from '../../../pages/auth/resetPassword';

describe('ResetPassword', () => {
  const createStore = (step = 0) =>
    configureStore({
      reducer: {
        notification: (state = { messageType: '', message: '', isShow: false }) => state,
        auth: (state = { loading: false, error: '', message: '', otp: ['', '', '', '', '', ''] }) =>
          state,
        step: (state = { step }) => state,
      },
    });

  const renderComponent = (step = 0) =>
    render(
      <Provider store={createStore(step)}>
        <MemoryRouter>
          <ResetPassword />
        </MemoryRouter>
      </Provider>,
    );

  it('renders step 0 - email input', () => {
    renderComponent(0);
    expect(screen.getByTestId('get-otp')).toBeInTheDocument();
  });

  it('renders step 1 - OTP input', () => {
    renderComponent(1);
    expect(screen.getByTestId('otp-input')).toBeInTheDocument();
  });

  it('renders step 2 - new password', () => {
    renderComponent(2);
    expect(screen.getByTestId('new-password')).toBeInTheDocument();
  });

  it('renders continue button', () => {
    renderComponent(0);
    expect(screen.getByText('auth.continue')).toBeInTheDocument();
  });

  it('renders Forget Password heading', () => {
    renderComponent(0);
    expect(screen.getByText('resetPassword.title')).toBeInTheDocument();
  });

  it('renders back button', () => {
    renderComponent(0);
    expect(screen.getByLabelText('Go back')).toBeInTheDocument();
  });

  it('renders brand description', () => {
    renderComponent(0);
    expect(screen.getByText('auth.tagline')).toBeInTheDocument();
  });

  it('renders confirm email heading on step 1', () => {
    renderComponent(1);
    expect(screen.getByText('resetPassword.confirmEmail')).toBeInTheDocument();
  });

  it('renders email instruction on step 1', () => {
    renderComponent(1);
    expect(screen.getByText(/resetPassword\.enterCode/)).toBeInTheDocument();
  });
});
