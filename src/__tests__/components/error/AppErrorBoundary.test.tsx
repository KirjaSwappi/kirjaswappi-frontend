import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../components/error/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../../../components/error/GlobalError', () => ({
  default: () => <div data-testid="global-error">Error</div>,
}));

vi.mock('../../../components/error/NoInternetConnection', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import AppErrorBoundary from '../../../components/error/AppErrorBoundary';

describe('AppErrorBoundary', () => {
  it('renders children', () => {
    render(
      <MemoryRouter>
        <AppErrorBoundary>
          <div data-testid="child">Hello</div>
        </AppErrorBoundary>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
