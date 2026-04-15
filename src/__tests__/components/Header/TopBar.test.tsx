import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('react-icons/io5', () => ({
  IoSearch: () => <span>search</span>,
}));

vi.mock('../../../assets/logo.png', () => ({ default: 'logo.png' }));

vi.mock('../../../data/menu', () => ({
  menu: [
    { id: 1, route: '/', icon: 'home.svg', value: 'home', isShow: true },
    { id: 2, route: '/user/messages', icon: 'msg.svg', value: 'messages', isShow: true },
  ],
}));

vi.mock('../../../hooks/useMouse', () => ({
  useMouseClick: () => ({
    clicked: false,
    setClicked: vi.fn(),
    reference: { current: null },
  }),
}));

vi.mock('../../../redux/feature/messages/messagesSlice', () => ({
  selectTotalUnreadCount: () => 0,
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

vi.mock('../../../components/Header/_components/HeaderUserProfile', () => ({
  default: () => <div data-testid="header-user-profile">Profile</div>,
}));

vi.mock('../../../components/Header/_components/LanguageFlagButton', () => ({
  default: () => <div data-testid="lang-flag">Flag</div>,
}));

vi.mock('../../../components/Header/_components/LanguageMenuDropdown', () => ({
  default: () => <div data-testid="lang-dropdown">Dropdown</div>,
}));

vi.mock('../../../components/Header/_components/MobileHeader', () => ({
  default: () => <div data-testid="mobile-header">MobileHeader</div>,
}));

vi.mock('../../../components/Header/_components/NotificationBell', () => ({
  default: () => <div data-testid="notification-bell">Bell</div>,
}));

import TopBar from '../../../components/Header/_components/TopBar';

describe('TopBar', () => {
  const createStore = (userId = 'user-1') =>
    configureStore({
      reducer: {
        auth: (state = { userInformation: { id: userId } }) => state,
        chat: (state = { inboxList: [] }) => state,
      },
    });

  const renderComponent = (userId = 'user-1') =>
    render(
      <Provider store={createStore(userId)}>
        <MemoryRouter initialEntries={['/']}>
          <TopBar />
        </MemoryRouter>
      </Provider>,
    );

  it('renders mobile header', () => {
    renderComponent();
    expect(screen.getByTestId('mobile-header')).toBeInTheDocument();
  });

  it('renders logo', () => {
    renderComponent();
    expect(screen.getByAltText('Kirja Swappi Logo')).toBeInTheDocument();
  });

  it('renders menu items', () => {
    renderComponent();
    expect(screen.getByText('home')).toBeInTheDocument();
    expect(screen.getByText('messages')).toBeInTheDocument();
  });

  it('renders header user profile', () => {
    renderComponent();
    expect(screen.getByTestId('header-user-profile')).toBeInTheDocument();
  });

  it('renders language flag button', () => {
    renderComponent();
    expect(screen.getByTestId('lang-flag')).toBeInTheDocument();
  });

  it('renders notification bell when logged in', () => {
    renderComponent('user-1');
    expect(screen.getByTestId('notification-bell')).toBeInTheDocument();
  });

  it('shows notification bell even when logged out', () => {
    renderComponent('');
    expect(screen.getByTestId('notification-bell')).toBeInTheDocument();
  });
});
