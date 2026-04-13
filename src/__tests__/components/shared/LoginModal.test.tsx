import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import LoginModal from '../../../components/shared/LoginModal/LoginModal';

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
    <img alt={alt || 'image'} data-testid={`img-${alt || 'image'}`} />
  ),
}));

// Mock Button component
vi.mock('../../../components/shared/Button', () => ({
  default: ({
    children,
    onClick,
    className,
    'aria-label': ariaLabel,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    'aria-label'?: string;
  }) => (
    <button
      onClick={onClick}
      className={className}
      aria-label={ariaLabel}
      data-testid={ariaLabel ? `btn-${ariaLabel}` : 'button'}
    >
      {children}
    </button>
  ),
}));

// Mock ControlledInputField
vi.mock('../../../components/shared/ControllerField', () => ({
  default: ({
    name,
    placeholder,
  }: {
    name: string;
    placeholder?: string;
    className?: string;
    showErrorMessage?: boolean;
  }) => <input data-testid={`input-${name}`} placeholder={placeholder} />,
}));

// Mock ControlledPasswordField
vi.mock('../../../components/shared/ControllerFieldPassword', () => ({
  default: ({
    name,
    placeholder,
  }: {
    name: string;
    placeholder?: string;
    className?: string;
    showErrorMessage?: boolean;
  }) => <input data-testid={`password-${name}`} type="password" placeholder={placeholder} />,
}));

// Mock InputLabel
vi.mock('../../../components/shared/InputLabel', () => ({
  default: ({ label }: { label: string; className?: string }) => (
    <label data-testid={`label-${label}`}>{label}</label>
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

const openModalState = {
  open: {
    loginModalOpen: true,
    open: false,
    swapModal: false,
    showAlert: false,
    message: '',
    searchToggle: false,
  },
  auth: {
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
    otp: [],
    userEmail: '',
    isVerify: false,
  },
};

describe('LoginModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoginMutation.mockResolvedValue({ unwrap: () => Promise.resolve({}) });
  });

  it('returns null when loginModalOpen is false', () => {
    const { container } = renderWithProviders(<LoginModal />, {
      preloadedState: {
        open: {
          loginModalOpen: false,
          open: false,
          swapModal: false,
          showAlert: false,
          message: '',
          searchToggle: false,
        },
      },
    });

    expect(container.firstChild).toBeNull();
  });

  it('renders modal when loginModalOpen is true', () => {
    renderWithProviders(<LoginModal />, { preloadedState: openModalState });

    expect(screen.getByText('loginModal.title')).toBeInTheDocument();
  });

  it('renders email and password inputs', () => {
    renderWithProviders(<LoginModal />, { preloadedState: openModalState });

    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('password-password')).toBeInTheDocument();
  });

  it('renders Log In submit button', () => {
    renderWithProviders(<LoginModal />, { preloadedState: openModalState });

    expect(screen.getByRole('button', { name: /loginModal.logIn/i })).toBeInTheDocument();
  });

  it('renders Google login button', () => {
    renderWithProviders(<LoginModal />, { preloadedState: openModalState });

    expect(screen.getByTestId('google-login')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    const { store } = renderWithProviders(<LoginModal />, { preloadedState: openModalState });

    const closeBtn = screen.getByLabelText('Close');
    fireEvent.click(closeBtn);

    expect(store.getState().open.loginModalOpen).toBe(false);
  });

  it('renders Sign up link', () => {
    renderWithProviders(<LoginModal />, { preloadedState: openModalState });

    expect(screen.getByText('loginModal.signUp')).toBeInTheDocument();
  });

  it('navigates to register and closes modal on Sign up click', () => {
    const { store } = renderWithProviders(<LoginModal />, { preloadedState: openModalState });

    const signUpBtn = screen.getByText('loginModal.signUp');
    fireEvent.click(signUpBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/auth/register');
    expect(store.getState().open.loginModalOpen).toBe(false);
  });

  it('renders Or separator', () => {
    renderWithProviders(<LoginModal />, { preloadedState: openModalState });

    expect(screen.getByText('loginModal.or')).toBeInTheDocument();
  });

  it('displays error message from Redux state', () => {
    renderWithProviders(<LoginModal />, {
      preloadedState: {
        ...openModalState,
        auth: {
          ...openModalState.auth,
          error: 'Login failed',
        },
      },
    });

    expect(screen.getByTestId('message-toastify')).toBeInTheDocument();
    expect(screen.getByText('Login failed')).toBeInTheDocument();
  });
});
