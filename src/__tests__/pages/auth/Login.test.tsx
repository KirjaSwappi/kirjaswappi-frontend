import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Login from '../../../pages/auth/login/index';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
  };
});

// Mock authApi - use importActual to preserve the authApi export used by authSlice extraReducers
const mockLoginMutation = vi.fn();
vi.mock('../../../redux/feature/auth/authApi', async (importActual) => {
  const actual = await importActual<typeof import('../../../redux/feature/auth/authApi')>();
  return {
    ...actual,
    useLoginMutation: () => [mockLoginMutation, { isLoading: false }],
  };
});

// Mock toast
vi.mock('../../../components/shared/toast', () => ({
  showToast: vi.fn(),
}));

// Mock Google login button
vi.mock('../../../components/shared/GoogleLoginButton', () => ({
  default: () => <button data-testid="google-login">Sign in with Google</button>,
}));

// Mock Image component
vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string; src?: string; className?: string }) => (
    <img alt={alt} data-testid={`img-${alt || 'image'}`} />
  ),
}));

// Mock ControlledInputField
vi.mock('../../../components/shared/ControllerField', () => ({
  default: ({ name, placeholder }: { name: string; placeholder?: string; className?: string }) => (
    <input data-testid={`input-${name}`} placeholder={placeholder} />
  ),
}));

// Mock ControlledPasswordField
vi.mock('../../../components/shared/ControllerFieldPassword', () => ({
  default: ({ name, placeholder }: { name: string; placeholder?: string; className?: string }) => (
    <input data-testid={`password-${name}`} type="password" placeholder={placeholder} />
  ),
}));

// Mock MessageToastify
vi.mock('../../../components/shared/MessageToastify', () => ({
  default: ({ value, type }: { value: string; type: string; isShow?: boolean }) => (
    <div data-testid="message-toastify" data-type={type}>
      {value}
    </div>
  ),
}));

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoginMutation.mockResolvedValue({ unwrap: () => Promise.resolve({}) });
  });

  it('renders sign in heading', () => {
    renderWithProviders(<Login />);

    expect(screen.getByText('auth.signIn')).toBeInTheDocument();
  });

  it('renders email input field', () => {
    renderWithProviders(<Login />);

    expect(screen.getByTestId('input-email')).toBeInTheDocument();
  });

  it('renders password input field', () => {
    renderWithProviders(<Login />);

    expect(screen.getByTestId('password-password')).toBeInTheDocument();
  });

  it('renders Continue button', () => {
    renderWithProviders(<Login />);

    expect(screen.getByText('auth.continue')).toBeInTheDocument();
  });

  it('renders Forgot Password link', () => {
    renderWithProviders(<Login />);

    expect(screen.getByText('auth.forgotPassword')).toBeInTheDocument();
  });

  it('renders Create an account button', () => {
    renderWithProviders(<Login />);

    expect(screen.getByText('auth.createAccount')).toBeInTheDocument();
  });

  it('renders Google login button', () => {
    renderWithProviders(<Login />);

    expect(screen.getByTestId('google-login')).toBeInTheDocument();
  });

  it('navigates to register on Create an account click', () => {
    renderWithProviders(<Login />);

    const createAccountBtn = screen.getByText('auth.createAccount');
    fireEvent.click(createAccountBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/auth/register');
  });

  it('does not render message toastify when there is no error', () => {
    renderWithProviders(<Login />);

    // No error in initial state — message toastify should not be present
    expect(screen.queryByTestId('message-toastify')).not.toBeInTheDocument();
  });

  it('renders submit button', () => {
    renderWithProviders(<Login />);

    const submitButton = screen.getByRole('button', { name: /auth\.continue/i });
    expect(submitButton).toBeInTheDocument();
  });
});
