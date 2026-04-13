import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import GlobalError from '../../../components/error/GlobalError';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('GlobalError', () => {
  it('renders default title and message', () => {
    render(<GlobalError />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText('An unexpected error occurred. Please try again later.'),
    ).toBeInTheDocument();
  });

  it('renders custom title and message', () => {
    render(<GlobalError title="Custom Title" message="Custom message text" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message text')).toBeInTheDocument();
  });

  it('renders Try Again button by default', () => {
    render(<GlobalError />);
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('hides Try Again button when showRetry is false', () => {
    render(<GlobalError showRetry={false} />);
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });

  it('renders Go Home button', () => {
    render(<GlobalError />);
    expect(screen.getByText('Go Home')).toBeInTheDocument();
  });

  it('navigates to home when Go Home is clicked', () => {
    render(<GlobalError />);
    screen.getByText('Go Home').click();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('calls custom onRetry when provided', () => {
    const onRetry = vi.fn();
    render(<GlobalError onRetry={onRetry} />);
    screen.getByText('Try Again').click();
    expect(onRetry).toHaveBeenCalled();
  });

  it('calls window.location.reload when no onRetry is provided', () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { ...window.location, reload: reloadMock },
      writable: true,
    });

    render(<GlobalError />);
    screen.getByText('Try Again').click();
    expect(reloadMock).toHaveBeenCalled();
  });
});
