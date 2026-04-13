import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import BookDetails from '../../../pages/bookDetails/index';

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
    useParams: () => ({ id: 'book-123' }),
  };
});

// Mock bookApi
const mockUseGetBookByIdQuery = vi.fn();
vi.mock('../../../redux/feature/book/bookApi', () => ({
  useGetBookByIdQuery: (...args: unknown[]) => mockUseGetBookByIdQuery(...args),
  useDeleteBookByIdMutation: () => [vi.fn(), { isLoading: false }],
  useLazyGetBookByIdQuery: () => [vi.fn(), { isLoading: false }],
}));

// Mock authApi - use importActual to preserve the authApi export used by authSlice extraReducers
vi.mock('../../../redux/feature/auth/authApi', async (importActual) => {
  const actual = await importActual<typeof import('../../../redux/feature/auth/authApi')>();
  return {
    ...actual,
    useGetUserProfileImageQuery: () => ({ data: { imageUrl: 'https://example.com/img.jpg' } }),
  };
});

// Mock custom hook
vi.mock('../../../hooks/useLoginOrSwapRequest', () => ({
  useLoginModalOrSwapRequest: () => ({ handleLoginOrSwap: vi.fn() }),
}));

// Mock utility
vi.mock('../../../utility/helper', () => ({
  goToTop: vi.fn(),
}));

// Mock child components
vi.mock('../../../components/shared/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('../../../components/shared/Breadcrumb', () => ({
  default: () => <div data-testid="breadcrumb">Breadcrumb</div>,
}));

vi.mock('../../../components/shared/Image', () => ({
  default: ({
    alt,
    onClick,
  }: {
    alt?: string;
    onClick?: () => void;
    src?: string;
    className?: string;
  }) =>
    onClick ? (
      <button onClick={onClick} data-testid={`image-${alt}`}>
        {alt}
      </button>
    ) : (
      <img alt={alt} data-testid={`image-${alt}`} />
    ),
}));

vi.mock('../../../pages/bookDetails/_components/BookImageSlider', () => ({
  default: () => <div data-testid="book-image-slider">Slider</div>,
}));

vi.mock('../../../pages/bookDetails/_components/VerticalImageSlider', () => ({
  default: () => <div data-testid="vertical-image-slider">Vertical Slider</div>,
}));

vi.mock('../../../pages/bookDetails/_components/BookType', () => ({
  default: () => <div data-testid="book-type">Book Type</div>,
}));

vi.mock('../../../pages/bookDetails/_components/BookDescription', () => ({
  default: () => <div data-testid="book-description">Description</div>,
}));

vi.mock('../../../pages/bookDetails/_components/Exchanges', () => ({
  default: () => <div data-testid="exchanges">Exchanges</div>,
}));

vi.mock('../../../pages/bookDetails/_components/OfferedBy', () => ({
  default: () => <div data-testid="offered-by">Offered By</div>,
}));

vi.mock('../../../pages/bookDetails/_components/BookActionButton', () => ({
  default: ({ btnValue }: { btnValue: string; onClick?: () => void }) => (
    <button data-testid="book-action-button">{btnValue}</button>
  ),
}));

vi.mock('../../../pages/bookDetails/_components/SwapRequestButton', () => ({
  default: () => <button data-testid="swap-request-button">Swap Request</button>,
}));

vi.mock('../../../pages/bookDetails/_components/MoreFromThisUserBooks', () => ({
  default: () => <div data-testid="more-from-user">More Books</div>,
}));

const mockBookData = {
  id: 'book-123',
  title: 'Test Book Title',
  author: 'Test Author',
  genres: ['Fiction', 'Drama'],
  language: 'English',
  description: 'A description',
  condition: 'Good',
  coverPhotoUrls: ['https://example.com/photo.jpg'],
  publishedYear: 2020,
  owner: {
    id: 'owner-456',
    name: 'Book Owner',
  },
  location: { city: 'Helsinki' },
  swapCondition: {
    swapType: 'BYBOOKS',
    giveAway: false,
    openForOffers: false,
    swappableGenres: [],
    swappableBooks: [],
  },
};

describe('BookDetails Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loader when book is loading', () => {
    mockUseGetBookByIdQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    renderWithProviders(<BookDetails />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders book title and author when loaded', () => {
    mockUseGetBookByIdQuery.mockReturnValue({
      data: mockBookData,
      isLoading: false,
    });

    renderWithProviders(<BookDetails />);

    expect(screen.getByText('Test Book Title')).toBeInTheDocument();
    expect(screen.getByText('bookDetails.byAuthor')).toBeInTheDocument();
  });

  it('renders genres as tags', () => {
    mockUseGetBookByIdQuery.mockReturnValue({
      data: mockBookData,
      isLoading: false,
    });

    renderWithProviders(<BookDetails />);

    expect(screen.getByText('Fiction')).toBeInTheDocument();
    expect(screen.getByText('Drama')).toBeInTheDocument();
  });

  it('renders book details sub-components', () => {
    mockUseGetBookByIdQuery.mockReturnValue({
      data: mockBookData,
      isLoading: false,
    });

    renderWithProviders(<BookDetails />);

    expect(screen.getByTestId('book-description')).toBeInTheDocument();
    expect(screen.getByTestId('exchanges')).toBeInTheDocument();
    expect(screen.getAllByTestId('offered-by').length).toBeGreaterThan(0);
    expect(screen.getByTestId('more-from-user')).toBeInTheDocument();
  });

  it('renders Edit Book button when user is the owner', () => {
    mockUseGetBookByIdQuery.mockReturnValue({
      data: mockBookData,
      isLoading: false,
    });

    renderWithProviders(<BookDetails />, {
      preloadedState: {
        auth: {
          loading: false,
          error: null,
          message: null,
          success: false,
          userInformation: {
            id: 'owner-456',
            firstName: '',
            lastName: '',
            email: '',
            streetName: null,
            houseNumber: null,
            zipCode: 0,
            city: null,
            country: null,
            phoneNumber: null,
            aboutMe: null,
            favGenres: [],
            books: [],
          },
          otp: [],
          userEmail: '',
          isVerify: false,
        },
      },
    });

    expect(screen.getByText('books.editBook')).toBeInTheDocument();
  });

  it('renders Request Swap button when user is not the owner', () => {
    mockUseGetBookByIdQuery.mockReturnValue({
      data: mockBookData,
      isLoading: false,
    });

    renderWithProviders(<BookDetails />, {
      preloadedState: {
        auth: {
          loading: false,
          error: null,
          message: null,
          success: false,
          userInformation: {
            id: 'other-user',
            firstName: '',
            lastName: '',
            email: '',
            streetName: null,
            houseNumber: null,
            zipCode: 0,
            city: null,
            country: null,
            phoneNumber: null,
            aboutMe: null,
            favGenres: [],
            books: [],
          },
          otp: [],
          userEmail: '',
          isVerify: false,
        },
      },
    });

    expect(screen.getByText('bookDetails.requestSwap')).toBeInTheDocument();
  });

  it('renders with no data gracefully', () => {
    mockUseGetBookByIdQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    renderWithProviders(<BookDetails />);

    // Should not crash - renders the page container
    expect(screen.getByTestId('more-from-user')).toBeInTheDocument();
  });
});
