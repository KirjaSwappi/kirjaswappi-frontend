import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-icons/io5', () => ({
  IoPersonOutline: () => <span>person</span>,
  IoChatbubbleEllipsesOutline: () => <span>chat</span>,
  IoHeartOutline: () => <span>heart</span>,
  IoMailOutline: () => <span>mail</span>,
  IoShieldCheckmarkOutline: () => <span>shield</span>,
  IoLogOutOutline: () => <span>logout</span>,
}));

vi.mock('../../../redux/api/apiSlice', () => ({
  api: {
    util: { resetApiState: () => ({ type: 'api/resetApiState' }) },
    injectEndpoints: vi.fn(() => ({ endpoints: {} })),
  },
}));

vi.mock('../../../redux/feature/auth/authSlice', () => ({
  logout: () => ({ type: 'auth/logout' }),
}));

vi.mock('../../../redux/feature/auth/authApi', () => ({
  useLogoutUserMutation: () => [vi.fn(), { isLoading: false }],
}));

vi.mock('../../../redux/feature/filter/filterSlice', () => ({
  clearAllFilters: () => ({ type: 'filter/clearAllFilters' }),
}));

vi.mock('../../../redux/feature/messages/messagesSlice', () => ({
  resetChat: () => ({ type: 'chat/resetChat' }),
}));

vi.mock('../../../redux/feature/notification/notificationSlice', () => ({
  clearNotifications: () => ({ type: 'notification/clearNotifications' }),
}));

vi.mock('../../../redux/feature/open/openSlice', () => ({
  setOpen: (val: boolean) => ({ type: 'open/setOpen', payload: val }),
}));

vi.mock('../../../redux/feature/step/stepSlice', () => ({
  setStep: (val: number) => ({ type: 'step/setStep', payload: val }),
}));

vi.mock('../../../redux/feature/swap/swapSlice', () => ({
  setResetSwapBook: () => ({ type: 'swap/setResetSwapBook' }),
}));

vi.mock('../../../components/shared/Button', () => ({
  default: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

vi.mock('../../../components/shared/toast', () => ({
  showToast: vi.fn(),
}));

vi.mock('../../../utility/cookies', () => ({
  getCookie: () => 'mock-refresh-token',
}));

vi.mock('../../../components/Header/_components/DropdownItem', () => ({
  default: ({ label, icon }: { label: string; icon: React.ReactNode }) => (
    <div data-testid={`item-${label}`}>
      {icon}
      {label}
    </div>
  ),
}));

import UserMenuDropdown from '../../../components/Header/_components/UserMenuDropdown';

describe('UserMenuDropdown', () => {
  const createStore = () =>
    configureStore({
      reducer: {
        auth: (state = { userInformation: { id: 'user-1' } }) => state,
      },
    });

  const renderComponent = () =>
    render(
      <Provider store={createStore()}>
        <MemoryRouter>
          <UserMenuDropdown />
        </MemoryRouter>
      </Provider>,
    );

  it('renders all menu items', () => {
    renderComponent();
    expect(screen.getByTestId('item-View Profile')).toBeInTheDocument();
    expect(screen.getByTestId('item-Privacy Center')).toBeInTheDocument();
    expect(screen.getByTestId('item-Support Us')).toBeInTheDocument();
    expect(screen.getByTestId('item-Contact Us')).toBeInTheDocument();
    expect(screen.getByTestId('item-Feedback')).toBeInTheDocument();
    expect(screen.getByTestId('item-Log Out')).toBeInTheDocument();
  });

  it('renders logout as a button', () => {
    renderComponent();
    const logoutItem = screen.getByTestId('item-Log Out');
    expect(logoutItem.closest('button')).toBeTruthy();
  });
});
