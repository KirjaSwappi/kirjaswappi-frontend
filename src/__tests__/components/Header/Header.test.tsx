import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Header from '../../../components/Header';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../hooks/useIsMobile', () => ({
  useIsMobile: () => false,
}));

vi.mock('../../../hooks/useDrawerOutsideClick', () => ({
  default: () => ({ reference: { current: null } }),
}));

vi.mock('../../../components/Header/_components/TopBar', () => ({
  default: () => <div data-testid="top-bar">TopBar</div>,
}));

vi.mock('../../../components/Header/_components/SideDrawer', () => ({
  default: vi.fn(({ children, open }: { children: React.ReactNode; open: boolean }) => (
    <div data-testid="side-drawer" data-open={open}>
      {children}
    </div>
  )),
}));

vi.mock('../../../components/Header/_components/BookFilter/BookFilter', () => ({
  default: () => <div data-testid="book-filter">BookFilter</div>,
}));

vi.mock('../../../components/Header/_components/SideFilterDrawers', () => ({
  default: () => [
    { type: 'CATEGORY', ref: { current: null }, left: true },
    { type: 'FILTER', ref: { current: null }, left: false },
    { type: 'SORTBY', ref: { current: null }, left: false },
  ],
}));

const mockLocation = { pathname: '/', search: '', hash: '', state: null, key: '' };
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => mockLocation,
  };
});

describe('Header', () => {
  it('renders the header element', () => {
    renderWithProviders(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders the TopBar component', () => {
    renderWithProviders(<Header />);
    expect(screen.getByTestId('top-bar')).toBeInTheDocument();
  });

  it('renders side drawers for filters', () => {
    renderWithProviders(<Header />);
    const drawers = screen.getAllByTestId('side-drawer');
    expect(drawers).toHaveLength(3);
  });

  it('renders BookFilter inside each drawer', () => {
    renderWithProviders(<Header />);
    const filters = screen.getAllByTestId('book-filter');
    expect(filters).toHaveLength(3);
  });

  it('is visible on the home page path', () => {
    renderWithProviders(<Header />);
    const topBarContainer = screen.getByTestId('top-bar').closest('div.fixed');
    expect(topBarContainer).not.toBeNull();
  });

  it('renders when showOn404 prop is true', () => {
    mockLocation.pathname = '/some-unknown-path';
    renderWithProviders(<Header showOn404={true} />);
    expect(screen.getByTestId('top-bar')).toBeInTheDocument();
    mockLocation.pathname = '/';
  });
});
