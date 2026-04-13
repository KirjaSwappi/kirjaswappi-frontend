import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
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

vi.mock('../../../redux/feature/book/bookApi', () => ({
  useGetAllBooksQuery: () => ({
    data: { page: { totalElements: 3 } },
  }),
}));

vi.mock('../../../pages/profile/components/About', () => ({
  default: () => <div data-testid="about">About</div>,
}));

vi.mock('../../../pages/profile/components/BooksListed', () => ({
  default: () => <div data-testid="books-listed">BooksListed</div>,
}));

vi.mock('../../../pages/profile/components/Skeletons/TabsSkeleton', () => ({
  default: () => <div>Loading...</div>,
}));

vi.mock('../../../pages/profile/components/UserActionNavigation', () => ({
  default: () => <div data-testid="user-actions">Actions</div>,
}));

vi.mock('../../../pages/profile/components/UserProfile', () => ({
  default: () => <div data-testid="user-profile">UserProfile</div>,
}));

import ProfileDashboard from '../../../pages/profile/components/ProfileDashboard';

describe('ProfileDashboard', () => {
  const createStore = (userId = 'user-1') =>
    configureStore({
      reducer: {
        auth: (
          state = {
            userInformation: { id: userId, email: 'test@test.com' },
            loading: false,
          },
        ) => state,
      },
    });

  const renderComponent = (userId = 'user-1') =>
    render(
      <Provider store={createStore(userId)}>
        <MemoryRouter initialEntries={['/profile/user-profile/user-1']}>
          <Routes>
            <Route path="/profile/user-profile/:id" element={<ProfileDashboard />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

  it('renders user profile component', () => {
    renderComponent();
    expect(screen.getByTestId('user-profile')).toBeInTheDocument();
  });

  it('renders tab buttons', () => {
    renderComponent();
    expect(screen.getByText('about')).toBeInTheDocument();
    expect(screen.getByText('profile.booksListed')).toBeInTheDocument();
  });

  it('renders user actions when viewing own profile', () => {
    renderComponent('user-1');
    expect(screen.getByTestId('user-actions')).toBeInTheDocument();
  });

  it('switches tabs on click', () => {
    renderComponent();
    const booksTab = screen.getByText('profile.booksListed');
    fireEvent.click(booksTab);
    expect(booksTab).toHaveClass('bg-primary');
  });

  it('hides permission-restricted tabs for other users', () => {
    render(
      <Provider store={createStore('other-user')}>
        <MemoryRouter initialEntries={['/profile/user-profile/user-1']}>
          <Routes>
            <Route path="/profile/user-profile/:id" element={<ProfileDashboard />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.queryByText('Pending Swaps')).not.toBeInTheDocument();
  });
});
