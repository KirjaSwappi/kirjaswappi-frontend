import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-icons/io', () => ({
  IoIosSearch: () => <span>search</span>,
}));

vi.mock('../../../assets/leftArrowGray.png', () => ({ default: 'leftGray.png' }));
vi.mock('../../../assets/logo.png', () => ({ default: 'logo.png' }));
vi.mock('../../../assets/logoIcon.png', () => ({ default: 'logoIcon.png' }));

vi.mock('../../../hooks/useMouse', () => ({
  useMouseClick: () => ({
    clicked: false,
    setClicked: vi.fn(),
    reference: { current: null },
  }),
}));

vi.mock('../../../hooks/useScroll', () => ({
  default: () => ({ scrolled: false }),
}));

vi.mock('../../../redux/feature/open/openSlice', () => ({
  setSearchToggle: (p: unknown) => ({ type: 'open/setSearchToggle', payload: p }),
}));

vi.mock('../../../components/shared/Button', () => ({
  default: ({
    children,
    onClick,
    className,
    id,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    id?: string;
  }) => (
    <button onClick={onClick} className={className} data-testid={id}>
      {children}
    </button>
  ),
}));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt || ''} />,
}));

vi.mock('../../../components/shared/Search', () => ({
  default: () => <div data-testid="search">Search</div>,
}));

vi.mock('../../../components/shared/SearchBar', () => ({
  default: () => <div data-testid="searchbar">SearchBar</div>,
}));

vi.mock('../../../components/Header/_components/HeaderUserProfile', () => ({
  default: () => <div data-testid="user-profile">Profile</div>,
}));

vi.mock('../../../components/Header/_components/LanguageFlagButton', () => ({
  default: () => <div data-testid="lang-flag">Flag</div>,
}));

vi.mock('../../../components/Header/_components/LanguageMenuDropdown', () => ({
  default: () => <div>Dropdown</div>,
}));

vi.mock('../../../components/Header/_components/NotificationBell', () => ({
  default: () => <div data-testid="bell">Bell</div>,
}));

import MobileHeader from '../../../components/Header/_components/MobileHeader';

describe('MobileHeader', () => {
  const createStore = (userId = 'user-1') =>
    configureStore({
      reducer: {
        auth: (state = { userInformation: { id: userId, firstName: 'John' } }) => state,
        open: (state = { searchToggle: false }) => state,
      },
    });

  const renderComponent = (userId = 'user-1') =>
    render(
      <Provider store={createStore(userId)}>
        <MemoryRouter initialEntries={['/']}>
          <MobileHeader />
        </MemoryRouter>
      </Provider>,
    );

  it('renders logo', () => {
    renderComponent();
    expect(screen.getByAltText('KirjaSwappi Logo')).toBeInTheDocument();
  });

  it('renders user profile', () => {
    renderComponent();
    expect(screen.getByTestId('user-profile')).toBeInTheDocument();
  });

  it('renders language flag', () => {
    renderComponent();
    expect(screen.getByTestId('lang-flag')).toBeInTheDocument();
  });

  it('does not render notification bell (moved to bottom nav)', () => {
    renderComponent('user-1');
    expect(screen.queryByTestId('bell')).not.toBeInTheDocument();
  });

  it('renders search bar on home page', () => {
    renderComponent();
    expect(screen.getByTestId('searchbar')).toBeInTheDocument();
  });
});
