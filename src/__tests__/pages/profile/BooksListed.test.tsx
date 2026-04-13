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
          { id: '1', title: 'Book Alpha', ownerId: '1' },
          { id: '2', title: 'Book Beta', ownerId: '1' },
        ],
      },
    },
    isLoading: false,
  }),
}));
vi.mock('../../../pages/profile/components/AddBookAction', () => ({
  default: () => <div data-testid="add-book-action">Add a Book</div>,
}));

import BooksListed from '../../../pages/profile/components/BooksListed';

const authReducer = () => ({
  loading: false,
  error: null,
  message: null,
  success: false,
  userInformation: { id: '1', firstName: '', lastName: '', email: 'test@test.com', books: [] },
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
          <Route path="/profile/user-profile/:id" element={<BooksListed />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe('BooksListed', () => {
  it('should render book cards', () => {
    renderWithProviders();
    expect(screen.getAllByTestId('book-card')).toHaveLength(2);
  });

  it('should display book titles', () => {
    renderWithProviders();
    expect(screen.getByText('Book Alpha')).toBeInTheDocument();
    expect(screen.getByText('Book Beta')).toBeInTheDocument();
  });

  it('should show the add book action when user is the owner', () => {
    renderWithProviders('1');
    expect(screen.getByTestId('add-book-action')).toBeInTheDocument();
  });
});
