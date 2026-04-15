import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@hookform/resolvers/yup', () => ({
  yupResolver: () => () => ({ values: {}, errors: {} }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('react-otp-input', () => ({
  default: ({ value, numInputs }: { value: string; numInputs: number }) => (
    <div data-testid="otp-input">
      {Array(numInputs)
        .fill(0)
        .map((_, i) => (
          <input key={i} data-testid={`otp-digit-${i}`} value={value[i] || ''} readOnly />
        ))}
    </div>
  ),
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

vi.mock('../../../components/shared/MessageToastify', () => ({
  default: ({ value }: { value?: string }) =>
    value ? <div data-testid="message">{value}</div> : null,
}));

vi.mock('../../../constant/MESSAGETYPE', () => ({
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
}));

vi.mock('../../../redux/feature/auth/authApi', () => ({
  useSentOTPMutation: () => [vi.fn(), { isLoading: false }],
  useVerifyEmailMutation: () => [vi.fn().mockResolvedValue({ data: true }), { isLoading: false }],
}));

vi.mock('../../../redux/feature/auth/authSlice', () => ({
  setOtp: (p: unknown) => ({ type: 'auth/setOtp', payload: p }),
}));

vi.mock('../../../redux/feature/notification/notificationSlice', () => ({
  setMessages: (p: unknown) => ({ type: 'notification/setMessages', payload: p }),
}));

vi.mock('../../../redux/feature/step/stepSlice', () => ({
  setStep: (p: unknown) => ({ type: 'step/setStep', payload: p }),
}));

vi.mock('../../../pages/auth/register/Schema', () => ({
  otpSchema: {
    fields: {},
    validate: vi.fn(),
    validateSync: vi.fn(),
    isValid: vi.fn(),
  },
}));

vi.mock('../../../pages/auth/register/interface', () => ({}));

import ConfirmOTP from '../../../pages/auth/register/_components/ConfirmOTP';

describe('ConfirmOTP', () => {
  const createStore = () =>
    configureStore({
      reducer: {
        auth: (state = { userEmail: 'test@test.com', otp: ['', '', '', '', '', ''] }) => state,
        step: (state = { step: 1 }) => state,
      },
    });

  const renderComponent = () =>
    render(
      <Provider store={createStore()}>
        <MemoryRouter>
          <ConfirmOTP />
        </MemoryRouter>
      </Provider>,
    );

  it('renders confirm email heading', () => {
    renderComponent();
    expect(screen.getByText('Confirm your Email')).toBeInTheDocument();
  });

  it('renders OTP input', () => {
    renderComponent();
    expect(screen.getByTestId('otp-input')).toBeInTheDocument();
  });

  it('renders verify button', () => {
    renderComponent();
    expect(screen.getByText('auth.otpVerify')).toBeInTheDocument();
  });

  it('renders resend button', () => {
    renderComponent();
    expect(screen.getByText('Send again')).toBeInTheDocument();
  });

  it('renders instruction text', () => {
    renderComponent();
    expect(screen.getByText(/Enter the code/)).toBeInTheDocument();
  });

  it('renders "Haven\'t received" text', () => {
    renderComponent();
    expect(screen.getByText(/Haven't received a code/)).toBeInTheDocument();
  });
});
