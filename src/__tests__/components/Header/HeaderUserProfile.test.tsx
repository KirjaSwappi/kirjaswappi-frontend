import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-icons/md', () => ({
  MdOutlineKeyboardArrowDown: () => <span>down</span>,
  MdOutlineKeyboardArrowUp: () => <span>up</span>,
}));

vi.mock('../../../assets/blankProfileIcon.png', () => ({ default: 'blank.png' }));

vi.mock('../../../hooks/useMouse', () => ({
  useMouseClick: () => ({
    clicked: false,
    setClicked: vi.fn(),
    reference: { current: null },
  }),
}));

vi.mock('../../../redux/feature/auth/authApi', () => ({
  useGetUserProfileImageQuery: () => ({
    data: { imageUrl: 'profile.jpg' },
    isLoading: false,
  }),
}));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt, src }: { alt?: string; src?: string }) => <img alt={alt || ''} src={src} />,
}));

vi.mock('../../../components/Header/_components/UserMenuDropdown', () => ({
  default: () => <div data-testid="menu-dropdown">Menu</div>,
}));

vi.mock('../../../components/Header/_components/UserProfileSkeleton', () => ({
  default: () => <div data-testid="skeleton">Loading</div>,
}));

import HeaderUserProfile from '../../../components/Header/_components/HeaderUserProfile';

describe('HeaderUserProfile', () => {
  const createStore = (userId = 'user-1') =>
    configureStore({
      reducer: {
        auth: (state = { userInformation: { id: userId, firstName: 'John' } }) => state,
      },
    });

  it('renders login link when not logged in', () => {
    const store = configureStore({
      reducer: {
        auth: (state = { userInformation: { id: '', firstName: '' } }) => state,
      },
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <HeaderUserProfile />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByAltText('profile')).toBeInTheDocument();
  });

  it('renders user profile button when logged in', () => {
    render(
      <Provider store={createStore()}>
        <MemoryRouter>
          <HeaderUserProfile />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByAltText('profile')).toBeInTheDocument();
  });

  it('renders user first name', () => {
    render(
      <Provider store={createStore()}>
        <MemoryRouter>
          <HeaderUserProfile />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
