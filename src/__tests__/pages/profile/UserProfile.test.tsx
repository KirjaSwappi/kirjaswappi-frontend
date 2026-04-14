import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('react-icons/fa6', () => ({
  FaRegUser: () => <span data-testid="user-icon">user</span>,
}));

vi.mock('../../../assets/location-icon.png', () => ({ default: 'location.png' }));
vi.mock('../../../assets/profileCover.jpg', () => ({ default: 'cover.jpg' }));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt, src }: { alt?: string; src?: string }) => <img alt={alt} src={src} />,
}));

vi.mock('../../../redux/feature/auth/authApi', () => ({
  useGetUserByIdQuery: () => ({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      favGenres: ['Fiction', 'Science'],
      aboutMe: 'Book lover',
      city: 'Helsinki',
    },
    isLoading: false,
  }),
  useGetUserProfileImageQuery: () => ({
    data: { imageUrl: 'profile.jpg' },
    isLoading: false,
    error: null,
  }),
  useGetUserCoverImageQuery: () => ({
    data: { imageUrl: 'cover.jpg' },
    isLoading: false,
    error: null,
  }),
}));

vi.mock('../../../redux/feature/book/bookApi', () => ({
  useGetAllBooksQuery: () => ({
    data: { page: { totalElements: 5 } },
  }),
}));
vi.mock('../../../redux/feature/messages/inboxApi', () => ({
  useGetInboxByStatusQuery: () => ({ data: [], isLoading: false }),
}));

vi.mock('../../../utility/rtkError', () => ({
  isFetchBaseQueryError: () => false,
}));

import UserProfile from '../../../pages/profile/components/UserProfile';

describe('UserProfile', () => {
  const createStore = () =>
    configureStore({
      reducer: {
        auth: (state = { userInformation: { id: 'user-1' } }) => state,
      },
    });

  const renderComponent = () =>
    render(
      <Provider store={createStore()}>
        <MemoryRouter initialEntries={['/profile/user-profile/user-1']}>
          <Routes>
            <Route path="/profile/user-profile/:id" element={<UserProfile />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

  it('renders user name', () => {
    renderComponent();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders favorite genres', () => {
    renderComponent();
    expect(screen.getByText('Fiction')).toBeInTheDocument();
    expect(screen.getByText('Science')).toBeInTheDocument();
  });

  it('renders books count', () => {
    renderComponent();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders location', () => {
    renderComponent();
    expect(screen.getByText('Helsinki')).toBeInTheDocument();
  });

  it('renders profile image', () => {
    renderComponent();
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });
});
