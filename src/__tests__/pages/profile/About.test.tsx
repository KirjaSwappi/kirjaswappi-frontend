import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { configureStore } from '@reduxjs/toolkit';

vi.mock('../../../assets/location-icon.png', () => ({ default: 'location-icon.png' }));
vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));
vi.mock('../../../redux/feature/auth/authApi', () => ({
  useGetUserByIdQuery: () => ({
    data: { aboutMe: 'I love reading!', city: 'Helsinki' },
  }),
  authApi: {
    reducerPath: 'authApi',
    reducer: () => ({}),
    middleware: () => (next: (a: unknown) => unknown) => (action: unknown) => next(action),
  },
}));
vi.mock('../../../redux/feature/book/bookApi', () => ({
  useGetAllBooksQuery: () => ({
    data: { page: { totalElements: 5 }, _embedded: { books: [] } },
  }),
}));
vi.mock('../../../redux/feature/messages/inboxApi', () => ({
  useGetInboxByStatusQuery: () => ({ data: [], isLoading: false }),
}));
vi.mock('../../../pages/profile/components/BookList', () => ({
  default: () => <div data-testid="book-list">BookList</div>,
}));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'profile.totalSwaps': 'Total Swaps',
        'profile.booksListed': 'Books Listed',
        'profile.myLibrary': 'My Library',
      };
      return map[key] ?? key;
    },
  }),
}));

import About from '../../../pages/profile/components/About';

const authReducer = () => ({
  loading: false,
  error: null,
  message: null,
  success: false,
  userInformation: { id: '1', firstName: '', lastName: '', email: '', books: [] },
  otp: [],
  userEmail: '',
  isVerify: false,
});

function renderWithProviders(userId = '1') {
  const store = configureStore({ reducer: { auth: authReducer } });
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/profile/user-profile/${userId}`]}>
        <Routes>
          <Route path="/profile/user-profile/:id" element={<About />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe('About', () => {
  it('should render the about me text', () => {
    renderWithProviders();
    expect(screen.getByText('I love reading!')).toBeInTheDocument();
  });

  it('should render the city', () => {
    renderWithProviders();
    expect(screen.getByText('Helsinki')).toBeInTheDocument();
  });

  it('should render total swaps and books listed labels', () => {
    renderWithProviders();
    expect(screen.getByText('Total Swaps')).toBeInTheDocument();
    expect(screen.getByText('Books Listed')).toBeInTheDocument();
  });

  it('should render the books count', () => {
    renderWithProviders();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render My Library heading and BookList', () => {
    renderWithProviders();
    expect(screen.getByText('My Library')).toBeInTheDocument();
    expect(screen.getByTestId('book-list')).toBeInTheDocument();
  });
});
