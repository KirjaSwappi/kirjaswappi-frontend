import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Register from '../../../pages/auth/register/index';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/auth/register', search: '', hash: '', state: null, key: '' }),
  };
});

// Mock Google login button
vi.mock('../../../components/shared/GoogleLoginButton', () => ({
  default: () => <button data-testid="google-login">Sign in with Google</button>,
}));

// Mock Image component
vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string; src?: string; className?: string }) => (
    <img alt={alt || 'image'} data-testid={`img-${alt || 'image'}`} />
  ),
}));

// Mock child components
vi.mock('../../../pages/auth/register/_components/RegisterForm', () => ({
  default: () => <div data-testid="register-form">Register Form</div>,
}));

vi.mock('../../../pages/auth/register/_components/ConfirmOTP', () => ({
  default: () => <div data-testid="confirm-otp">Confirm OTP</div>,
}));

describe('Register Page', () => {
  it('renders register form on step 0', () => {
    renderWithProviders(<Register />, {
      preloadedState: {
        step: { step: 0 },
      },
    });

    expect(screen.getByTestId('register-form')).toBeInTheDocument();
  });

  it('renders OTP form on step 1', () => {
    renderWithProviders(<Register />, {
      preloadedState: {
        step: { step: 1 },
      },
    });

    expect(screen.getByTestId('confirm-otp')).toBeInTheDocument();
  });

  it('renders Google login button', () => {
    renderWithProviders(<Register />);

    expect(screen.getByTestId('google-login')).toBeInTheDocument();
  });

  it('renders log in or Signup header text', () => {
    renderWithProviders(<Register />);

    expect(screen.getByText('log in or Signup')).toBeInTheDocument();
  });

  it('renders Or separator', () => {
    renderWithProviders(<Register />);

    expect(screen.getByText('Or')).toBeInTheDocument();
  });
});
