import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../../../components/error/ErrorBoundary';
import GlobalError from '../../../components/error/GlobalError';

// Mock console.error to avoid noise in tests
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock GlobalError component
vi.mock('../../../components/error/GlobalError', () => ({
  default: vi.fn(({ title, message, onRetry }) => (
    <div data-testid="global-error">
      <h1>{title}</h1>
      <p>{message}</p>
      <button onClick={onRetry} data-testid="retry-button">
        Retry
      </button>
    </div>
  )),
}));

const MockGlobalError = vi.mocked(GlobalError);

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Normal content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  it('catches and displays error using default GlobalError component', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(MockGlobalError).toHaveBeenCalledWith(
      expect.objectContaining({
        onRetry: expect.any(Function),
      }),
      {},
    );
  });

  it('uses custom FallbackComponent when provided', () => {
    const CustomFallback = vi.fn(({ error, resetErrorBoundary }) => (
      <div data-testid="custom-fallback">
        <p>Custom: {error.message}</p>
        <button onClick={resetErrorBoundary} data-testid="custom-retry">
          Reset
        </button>
      </div>
    ));

    const ThrowError = () => {
      throw new Error('Custom error');
    };

    render(
      <ErrorBoundary FallbackComponent={CustomFallback}>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(CustomFallback).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(Error),
        resetErrorBoundary: expect.any(Function),
      }),
      {},
    );

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    expect(screen.getByText('Custom: Custom error')).toBeInTheDocument();
  });

  it('calls onReset prop when resetting error boundary', () => {
    const onReset = vi.fn();

    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary onReset={onReset}>
        <ThrowError />
      </ErrorBoundary>,
    );

    // Click the retry button in GlobalError
    const retryButton = screen.getByTestId('retry-button');
    fireEvent.click(retryButton);

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('logs errors to console', () => {
    const ThrowError = () => {
      throw new Error('Console error test');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Uncaught error:',
      expect.any(Error),
      expect.any(Object),
    );
  });

  it('handles errors with default message when error.message is undefined', () => {
    const ThrowError = () => {
      const error = new Error();
      error.message = '';
      throw error;
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(MockGlobalError).toHaveBeenCalledWith(
      expect.objectContaining({
        onRetry: expect.any(Function),
      }),
      {},
    );
  });

  it('handles multiple errors correctly', () => {
    const FirstThrowError = () => {
      throw new Error('First error');
    };

    const SecondThrowError = () => {
      throw new Error('Second error');
    };

    const { rerender } = render(
      <ErrorBoundary>
        <FirstThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId('global-error')).toBeInTheDocument();

    // Reset and try again with a new ErrorBoundary instance
    MockGlobalError.mockClear();

    rerender(
      <ErrorBoundary key="second">
        <SecondThrowError />
      </ErrorBoundary>,
    );

    // Should show second error
    expect(screen.getByTestId('global-error')).toBeInTheDocument();
  });
});
