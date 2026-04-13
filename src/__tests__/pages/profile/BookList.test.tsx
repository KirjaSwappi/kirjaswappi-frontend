import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { configureStore } from '@reduxjs/toolkit';

vi.mock('../../../components/shared/BookCard', () => ({
  default: ({ book }: { book: { title: string } }) => (
    <div data-testid="book-card">{book.title}</div>
  ),
}));
vi.mock('../../../components/shared/skeleton/BookSkeleton', () => ({
  default: () => <div data-testid="book-skeleton" />,
}));
vi.mock('../../../hooks/useSkeleton', () => ({
  useSkeleton: () => ({ showSkeleton: false }),
}));
vi.mock('../../../redux/feature/book/bookApi', () => ({
  useGetAllBooksQuery: () => ({
    data: {
      _embedded: {
        books: [
          { id: '1', title: 'Book One', ownerId: '1' },
          { id: '2', title: 'Book Two', ownerId: '2' },
        ],
      },
    },
    isLoading: false,
  }),
}));

import BookList from '../../../pages/profile/components/BookList';

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
          <Route path="/profile/user-profile/:id" element={<BookList />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe('BookList', () => {
  it('should render book cards', () => {
    renderWithProviders();
    expect(screen.getAllByTestId('book-card')).toHaveLength(2);
  });

  it('should display book titles', () => {
    renderWithProviders();
    expect(screen.getByText('Book One')).toBeInTheDocument();
    expect(screen.getByText('Book Two')).toBeInTheDocument();
  });
});
