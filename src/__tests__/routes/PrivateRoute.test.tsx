import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PrivateRoute from '../../routes/PrivateRoute';
import { renderWithProviders } from '../utils/test-utils';

// Mock cookies so PrivateRoute can read a valid refresh token. Default: a
// non-expired token is present, so authenticated paths render children. Tests
// for the missing/expired-cookie branch override these mocks per test.
vi.mock('../../utility/cookies', () => ({
  getCookie: vi.fn((name: string) => (name === 'userRefreshToken' ? 'fake-refresh' : null)),
  setCookie: vi.fn(),
  clearCookie: vi.fn(),
  isCookieExpired: vi.fn(() => false),
  handleExpiredCookie: vi.fn(),
}));

// Mock React Router hooks
const mockUseLocation = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => mockUseLocation(),
    Navigate: ({ to, state, replace }: { to: string; state?: unknown; replace?: boolean }) => (
      <div
        data-testid="navigate"
        data-to={to}
        data-state={JSON.stringify(state)}
        data-replace={replace}
      >
        Redirecting to {to}
      </div>
    ),
  };
});

describe('PrivateRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when user is authenticated', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/protected',
    });

    renderWithProviders(
      <MemoryRouter>
        <PrivateRoute>
          <div data-testid="protected-content">Protected Content</div>
        </PrivateRoute>
      </MemoryRouter>,
      {
        preloadedState: {
          auth: {
            loading: false,
            error: null,
            message: null,
            success: false,
            userInformation: {
              id: '123',
              email: 'user@example.com',
              lastName: 'Doe',
              books: [],
            },
            otp: [],
            userEmail: '',
            isVerify: false,
          },
        },
      },
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/protected',
    });

    renderWithProviders(
      <MemoryRouter>
        <PrivateRoute>
          <div>Protected Content</div>
        </PrivateRoute>
      </MemoryRouter>,
      {
        preloadedState: {
          auth: {
            loading: false,
            error: null,
            message: null,
            success: false,
            userInformation: {
              lastName: '',
              books: [],
            },
            otp: [],
            userEmail: '',
            isVerify: false,
          },
        },
      },
    );

    const navigateElement = screen.getByTestId('navigate');
    expect(navigateElement).toBeInTheDocument();
    expect(navigateElement).toHaveAttribute('data-to', '/auth/login');
    expect(navigateElement).toHaveAttribute('data-replace', 'true');
  });

  it('redirects when user has no id', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/dashboard',
    });

    renderWithProviders(
      <MemoryRouter>
        <PrivateRoute>
          <div>Content</div>
        </PrivateRoute>
      </MemoryRouter>,
      {
        preloadedState: {
          auth: {
            loading: false,
            error: null,
            message: null,
            success: false,
            userInformation: {
              email: 'user@example.com',
              lastName: 'Doe',
              books: [],
              // missing id
            },
            otp: [],
            userEmail: '',
            isVerify: false,
          },
        },
      },
    );

    expect(screen.getByTestId('navigate')).toBeInTheDocument();
  });

  it('redirects when user has no email', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/profile',
    });

    renderWithProviders(
      <MemoryRouter>
        <PrivateRoute>
          <div>Content</div>
        </PrivateRoute>
      </MemoryRouter>,
      {
        preloadedState: {
          auth: {
            loading: false,
            error: null,
            message: null,
            success: false,
            userInformation: {
              id: '123',
              lastName: 'Doe',
              books: [],
              // missing email
            },
            otp: [],
            userEmail: '',
            isVerify: false,
          },
        },
      },
    );

    expect(screen.getByTestId('navigate')).toBeInTheDocument();
  });

  it('passes correct state to Navigate component', () => {
    const mockLocation = {
      pathname: '/protected-route',
      search: '?param=value',
      hash: '#section',
    };

    mockUseLocation.mockReturnValue(mockLocation);

    renderWithProviders(
      <MemoryRouter>
        <PrivateRoute>
          <div>Content</div>
        </PrivateRoute>
      </MemoryRouter>,
      {
        preloadedState: {
          auth: {
            loading: false,
            error: null,
            message: null,
            success: false,
            userInformation: {
              lastName: '',
              books: [],
            },
            otp: [],
            userEmail: '',
            isVerify: false,
          },
        },
      },
    );

    const navigateElement = screen.getByTestId('navigate');
    const state = JSON.parse(navigateElement.getAttribute('data-state') || '{}');

    // PrivateRoute now preserves the query string so login redirects can
    // honour deep links (audit I4): path = pathname + search.
    expect(state).toEqual({
      path: '/protected-route?param=value',
      from: mockLocation,
    });
  });

  it('handles empty userInformation object', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/test',
    });

    renderWithProviders(
      <MemoryRouter>
        <PrivateRoute>
          <div>Content</div>
        </PrivateRoute>
      </MemoryRouter>,
      {
        preloadedState: {
          auth: {
            loading: false,
            error: null,
            message: null,
            success: false,
            userInformation: {
              lastName: '',
              books: [],
            },
            otp: [],
            userEmail: '',
            isVerify: false,
          },
        },
      },
    );

    expect(screen.getByTestId('navigate')).toBeInTheDocument();
  });

  it('handles undefined userInformation', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/test',
    });

    renderWithProviders(
      <MemoryRouter>
        <PrivateRoute>
          <div>Content</div>
        </PrivateRoute>
      </MemoryRouter>,
      {
        preloadedState: {
          auth: {
            loading: false,
            error: null,
            message: null,
            success: false,
            userInformation: {
              lastName: '',
              books: [],
            },
            otp: [],
            userEmail: '',
            isVerify: false,
          },
        },
      },
    );

    expect(screen.getByTestId('navigate')).toBeInTheDocument();
  });

  it('renders children when user has both id and email', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/home',
    });

    renderWithProviders(
      <MemoryRouter>
        <PrivateRoute>
          <div data-testid="authenticated-content">Authenticated Content</div>
        </PrivateRoute>
      </MemoryRouter>,
      {
        preloadedState: {
          auth: {
            loading: false,
            error: null,
            message: null,
            success: false,
            userInformation: {
              id: '456',
              email: 'test@example.com',
              lastName: 'User',
              books: [],
            },
            otp: [],
            userEmail: '',
            isVerify: false,
          },
        },
      },
    );

    expect(screen.getByTestId('authenticated-content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });
});
