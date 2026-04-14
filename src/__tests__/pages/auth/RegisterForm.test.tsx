import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-hook-form', async () => {
  const actual = await vi.importActual('react-hook-form');
  return { ...actual };
});

vi.mock('@hookform/resolvers/yup', () => ({
  yupResolver: () => () => ({ values: {}, errors: {} }),
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

vi.mock('../../../components/shared/ControllerFieldPassword', () => ({
  default: ({ name, placeholder }: { name: string; placeholder: string }) => (
    <input data-testid={`password-${name}`} placeholder={placeholder} />
  ),
}));

vi.mock('../../../components/shared/ControllerField', () => ({
  default: ({ name, placeholder }: { name: string; placeholder: string }) => (
    <input data-testid={`field-${name}`} placeholder={placeholder} />
  ),
}));

vi.mock('../../../redux/feature/auth/authApi', () => ({
  useRegisterMutation: () => [vi.fn().mockResolvedValue({ data: true }), { isLoading: false }],
}));

vi.mock('../../../redux/feature/auth/authSlice', () => ({
  setAuthMessage: (p: unknown) => ({ type: 'auth/setAuthMessage', payload: p }),
  setError: (p: unknown) => ({ type: 'auth/setError', payload: p }),
  setOtp: (p: unknown) => ({ type: 'auth/setOtp', payload: p }),
  setUserEmail: (p: unknown) => ({ type: 'auth/setUserEmail', payload: p }),
}));

vi.mock('../../../redux/feature/notification/notificationSlice', () => ({
  setMessages: (p: unknown) => ({ type: 'notification/setMessages', payload: p }),
}));

vi.mock('../../../redux/feature/step/stepSlice', () => ({
  setStep: (p: unknown) => ({ type: 'step/setStep', payload: p }),
}));

vi.mock('../../../pages/auth/register/Schema', () => ({
  registerSchema: {
    fields: {},
    validate: vi.fn(),
    validateSync: vi.fn(),
    isValid: vi.fn(),
  },
}));

vi.mock('../../../pages/auth/register/interface', () => ({}));

import RegisterForm from '../../../pages/auth/register/_components/RegisterForm';

describe('RegisterForm', () => {
  const createStore = () =>
    configureStore({
      reducer: {
        auth: (state = { error: '', message: '' }) => state,
        step: (state = { step: 0 }) => state,
      },
    });

  const renderComponent = () =>
    render(
      <Provider store={createStore()}>
        <MemoryRouter>
          <RegisterForm />
        </MemoryRouter>
      </Provider>,
    );

  it('renders first name field', () => {
    renderComponent();
    expect(screen.getByTestId('field-firstName')).toBeInTheDocument();
  });

  it('renders last name field', () => {
    renderComponent();
    expect(screen.getByTestId('field-lastName')).toBeInTheDocument();
  });

  it('renders email field', () => {
    renderComponent();
    expect(screen.getByTestId('field-email')).toBeInTheDocument();
  });

  it('renders password field', () => {
    renderComponent();
    expect(screen.getByTestId('password-password')).toBeInTheDocument();
  });

  it('renders confirm password field', () => {
    renderComponent();
    expect(screen.getByTestId('password-confirmPassword')).toBeInTheDocument();
  });

  it('renders continue button', () => {
    renderComponent();
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it('renders login link', () => {
    renderComponent();
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  it('renders already have account text', () => {
    renderComponent();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
  });
});
