import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Books from '../../../pages/books/index';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock bookApi
const mockUseGetAllBooksQuery = vi.fn();
vi.mock('../../../redux/feature/book/bookApi', () => ({
  useGetAllBooksQuery: (...args: unknown[]) => mockUseGetAllBooksQuery(...args),
  useGetBooksNearLocationQuery: () => ({
    data: null,
    isError: false,
    isLoading: false,
    isFetching: false,
  }),
  useDeleteBookByIdMutation: () => [vi.fn(), { isLoading: false }],
  useLazyGetBookByIdQuery: () => [vi.fn(), { isLoading: false }],
}));

// Mock child components
vi.mock('../../../pages/books/_components/Filter', () => ({
  default: () => <div data-testid="filter">Filter</div>,
}));

vi.mock('../../../pages/books/_components/Herosection', () => ({
  default: () => <div data-testid="hero-section">HeroSection</div>,
}));

vi.mock('../../../pages/books/_components/NoBooksAvailable', () => ({
  default: () => <div data-testid="no-books">No Books Available</div>,
}));

vi.mock('../../../components/shared/skeleton/BookSkeleton', () => ({
  default: () => <div data-testid="book-skeleton">Loading...</div>,
}));

vi.mock('../../../components/shared/BookCard', () => ({
  default: ({ book }: { book: { title: string } }) => (
    <div data-testid="book-card">{book.title}</div>
  ),
}));

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: mockObserve,
  disconnect: mockDisconnect,
}));

describe('Books Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders hero section and filter', () => {
    mockUseGetAllBooksQuery.mockReturnValue({
      data: null,
      isError: false,
      isLoading: false,
      isFetching: false,
    });

    renderWithProviders(<Books />);

    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('filter')).toBeInTheDocument();
  });

  it('renders loading skeletons when fetching', () => {
    mockUseGetAllBooksQuery.mockReturnValue({
      data: null,
      isError: false,
      isLoading: true,
      isFetching: true,
    });

    renderWithProviders(<Books />);

    expect(screen.getAllByTestId('book-skeleton').length).toBeGreaterThan(0);
  });

  it('renders error state when isError is true', () => {
    mockUseGetAllBooksQuery.mockReturnValue({
      data: null,
      isError: true,
      isLoading: false,
      isFetching: false,
    });

    renderWithProviders(<Books />);

    expect(screen.getByText('books.errorMessage')).toBeInTheDocument();
    expect(screen.getByText('books.tryAgain')).toBeInTheDocument();
  });

  it('renders NoBooksAvailable when no books and not loading', () => {
    mockUseGetAllBooksQuery.mockReturnValue({
      data: { _embedded: { books: [] }, page: { totalPages: 0 } },
      isError: false,
      isLoading: false,
      isFetching: false,
    });

    renderWithProviders(<Books />);

    expect(screen.getByTestId('no-books')).toBeInTheDocument();
  });

  it('renders book cards when books are loaded', () => {
    mockUseGetAllBooksQuery.mockReturnValue({
      data: {
        _embedded: {
          books: [
            { id: '1', title: 'Book One', ownerId: 'user-1' },
            { id: '2', title: 'Book Two', ownerId: 'user-2' },
          ],
        },
        page: { totalPages: 1 },
      },
      isError: false,
      isLoading: false,
      isFetching: false,
    });

    renderWithProviders(<Books />);

    expect(screen.getByText('Book One')).toBeInTheDocument();
    expect(screen.getByText('Book Two')).toBeInTheDocument();
  });

  it('calls window.location.reload on Try Again click', () => {
    mockUseGetAllBooksQuery.mockReturnValue({
      data: null,
      isError: true,
      isLoading: false,
      isFetching: false,
    });

    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    });

    renderWithProviders(<Books />);

    const tryAgainButton = screen.getByText('books.tryAgain');
    tryAgainButton.click();

    expect(reloadMock).toHaveBeenCalled();
  });
});
