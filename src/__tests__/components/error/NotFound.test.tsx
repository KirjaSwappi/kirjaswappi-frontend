import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import NotFound from '../../../components/error/NotFound';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock Header
vi.mock('../../../components/Header', () => ({
  default: () => <header data-testid="header">Header</header>,
}));

// Mock MobileHeader
vi.mock('../../../components/Header/_components/MobileHeader', () => ({
  default: () => <div data-testid="mobile-header">Mobile Header</div>,
}));

describe('NotFound Component', () => {
  it('renders without crashing', () => {
    const { container } = renderWithProviders(<NotFound />);
    expect(container).toBeInTheDocument();
  });

  it('renders the 404 error heading', () => {
    renderWithProviders(<NotFound />);

    // t('notFound.heading') returns 'notFound.heading' in our mock
    expect(screen.getByText('notFound.heading')).toBeInTheDocument();
  });

  it('renders the 404 error description', () => {
    renderWithProviders(<NotFound />);

    expect(screen.getByText('notFound.title')).toBeInTheDocument();
  });

  it('renders the header', () => {
    renderWithProviders(<NotFound />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders the mobile header', () => {
    renderWithProviders(<NotFound />);

    expect(screen.getByTestId('mobile-header')).toBeInTheDocument();
  });

  it('renders the 404 error image', () => {
    renderWithProviders(<NotFound />);

    const errorImg = screen.getByAltText('404Error');
    expect(errorImg).toBeInTheDocument();
  });
});
