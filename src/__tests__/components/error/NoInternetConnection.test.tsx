import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import NoInternetConnection from '../../../components/error/NoInternetConnection';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../components/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('../../../components/Header/_components/MobileHeader', () => ({
  default: () => <div data-testid="mobile-header">MobileHeader</div>,
}));

vi.mock('../../../components/error/ErrorPageHeader', () => ({
  default: ({ title, paragraph }: { title: string; paragraph: string }) => (
    <div data-testid="error-page-header">
      <h1>{title}</h1>
      <p>{paragraph}</p>
    </div>
  ),
}));

describe('NoInternetConnection', () => {
  it('renders children when online', () => {
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true });

    render(
      <NoInternetConnection>
        <div data-testid="child-content">App Content</div>
      </NoInternetConnection>,
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('shows offline UI when navigator is offline', () => {
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true });

    render(
      <NoInternetConnection>
        <div data-testid="child-content">App Content</div>
      </NoInternetConnection>,
    );

    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('error-page-header')).toBeInTheDocument();
  });

  it('displays translated offline heading and title', () => {
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true });

    render(
      <NoInternetConnection>
        <div>Content</div>
      </NoInternetConnection>,
    );

    expect(screen.getByText('offline.heading')).toBeInTheDocument();
    expect(screen.getByText('offline.title')).toBeInTheDocument();
  });

  it('shows the offline image', () => {
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true });

    render(
      <NoInternetConnection>
        <div>Content</div>
      </NoInternetConnection>,
    );

    expect(screen.getByAltText('offlineImage')).toBeInTheDocument();
  });

  it('renders header components when offline', () => {
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true });

    render(
      <NoInternetConnection>
        <div>Content</div>
      </NoInternetConnection>,
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-header')).toBeInTheDocument();
  });

  it('switches to offline UI when going offline', () => {
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true });

    render(
      <NoInternetConnection>
        <div data-testid="child-content">App Content</div>
      </NoInternetConnection>,
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('error-page-header')).toBeInTheDocument();
  });

  it('switches back to children when going online', () => {
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true });

    render(
      <NoInternetConnection>
        <div data-testid="child-content">App Content</div>
      </NoInternetConnection>,
    );

    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });
});
