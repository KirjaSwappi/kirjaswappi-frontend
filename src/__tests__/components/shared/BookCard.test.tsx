import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import BookCard from '../../../components/shared/BookCard';
import { renderWithProviders } from '../../utils/test-utils';

// Mock React Router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Redux hooks
const mockDispatch = vi.fn();
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: vi.fn(),
  };
});

// Mock custom hooks
interface UseMouseClickResult {
  clicked: boolean;
  setClicked: (value: boolean) => void;
  reference: React.RefObject<HTMLElement>;
}

let mockUseMouseClick: Mock<() => UseMouseClickResult>;

vi.mock('../../../hooks/useMouse', () => ({
  useMouseClick: () => mockUseMouseClick(),
}));

// Mock API calls
vi.mock('../../../redux/feature/book/bookApi', () => ({
  useDeleteBookByIdMutation: () => [vi.fn(), { isLoading: false }],
  useLazyGetBookByIdQuery: () => [vi.fn(), { isLoading: false }],
}));

// Mock toast
vi.mock('../../../components/shared/toast', () => ({
  showToast: vi.fn(),
}));

// Mock child components
vi.mock('../../../components/shared/BookCardSwapButton', () => ({
  default: () => <div data-testid="swap-button">Swap Button</div>,
}));

// Mock child components
interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  isLoading: boolean;
}

vi.mock('../../../components/shared/DeleteConfirmModal', () => ({
  default: ({ open, onClose, onDelete, isLoading }: DeleteConfirmModalProps) =>
    open ? (
      <div data-testid="delete-modal">
        <button onClick={onClose} data-testid="close-delete-modal">
          Close
        </button>
        <button onClick={onDelete} data-testid="confirm-delete" disabled={isLoading}>
          {isLoading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    ) : null,
}));

interface ImageProps {
  src: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
}

vi.mock('../../../components/shared/Image', () => ({
  default: ({ src, alt, className, onClick }: ImageProps) =>
    onClick ? (
      <button
        onClick={onClick}
        className={className}
        data-testid={`image-${alt?.replace(/\s+/g, '-').toLowerCase() || 'image'}`}
        type="button"
      >
        <img src={src} alt={alt} />
      </button>
    ) : (
      <img
        src={src}
        alt={alt}
        className={className}
        data-testid={`image-${alt?.replace(/\s+/g, '-').toLowerCase() || 'image'}`}
      />
    ),
}));

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

vi.mock('../../../components/shared/Button', () => ({
  default: ({ children, onClick, className, type }: ButtonProps) => (
    <button onClick={onClick} className={className} type={type || 'button'} data-testid="button">
      {children}
    </button>
  ),
}));

describe('BookCard Component', () => {
  beforeEach(() => {
    mockUseMouseClick = vi.fn(() => ({
      clicked: false,
      setClicked: vi.fn(),
      reference: { current: null },
    }));
  });

  const mockBook = {
    id: '1',
    title: 'Test Book',
    author: 'Test Author',
    genres: ['Fiction'],
    language: 'English',
    description: 'A test book description',
    condition: 'Good',
    coverPhotoUrl: 'https://example.com/cover.jpg',
    ownerName: 'John Doe',
    ownerId: 'owner-1',
    ownerProfilePhoto: 'https://example.com/profile.jpg',
    coverPhotoUrls: ['https://example.com/cover1.jpg', 'https://example.com/cover2.jpg'],
    owner: {
      id: 'owner-1',
      name: 'John Doe',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders book information correctly', () => {
    renderWithProviders(<BookCard book={mockBook} />);

    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('by Test Author')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Helsinki')).toBeInTheDocument();
    expect(screen.getByText('29 mins. ago')).toBeInTheDocument();
  });

  it('renders with cover photo from coverPhotoUrls array', () => {
    renderWithProviders(<BookCard book={mockBook} />);

    const image = screen.getByTestId("image-test-book-||-'your-favorite-book'");
    expect(image).toHaveAttribute('src', 'https://example.com/cover1.jpg');
  });

  it('renders with cover photo from coverPhotoUrl when no array', () => {
    const bookWithoutArray = { ...mockBook, coverPhotoUrls: undefined };
    renderWithProviders(<BookCard book={bookWithoutArray} />);

    const image = screen.getByTestId("image-test-book-||-'your-favorite-book'");
    expect(image).toHaveAttribute('src', 'https://example.com/cover.jpg');
  });

  it('navigates to book details on card click', () => {
    renderWithProviders(<BookCard book={mockBook} />);

    // Find the main card by its title and get the button parent
    const titleElement = screen.getByText('Test Book');
    const card = titleElement.closest('div[role="button"]');
    fireEvent.click(card!);

    expect(mockNavigate).toHaveBeenCalledWith('/book-details/1', {
      state: 'book-details',
    });
  });

  it('navigates to book details on Enter key press', () => {
    renderWithProviders(<BookCard book={mockBook} />);

    const titleElement = screen.getByText('Test Book');
    const card = titleElement.closest('div[role="button"]');
    fireEvent.keyDown(card!, { key: 'Enter' });

    expect(mockNavigate).toHaveBeenCalledWith('/book-details/1', {
      state: 'book-details',
    });
  });

  it('navigates to book details on Space key press', () => {
    renderWithProviders(<BookCard book={mockBook} />);

    // Find the main card by its title text and get its parent button
    const titleElement = screen.getByText('Test Book');
    const card = titleElement.closest('div[role="button"]');
    fireEvent.keyDown(card!, { key: ' ' });

    expect(mockNavigate).toHaveBeenCalledWith('/book-details/1', {
      state: 'book-details',
    });
  });

  it('shows edit/delete menu when hasPermission is true', () => {
    // Mock useMouseClick to return clicked: true for this test
    mockUseMouseClick.mockReturnValueOnce({
      clicked: true,
      setClicked: vi.fn(),
      reference: { current: null },
    });

    renderWithProviders(<BookCard book={mockBook} hasPermission={true} />);

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('does not show edit/delete menu when hasPermission is false', () => {
    renderWithProviders(<BookCard book={mockBook} hasPermission={false} />);

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('shows swap button when hasPermission is false', () => {
    renderWithProviders(<BookCard book={mockBook} hasPermission={false} />);

    expect(screen.getByTestId('swap-button')).toBeInTheDocument();
  });

  it('does not show swap button when hasPermission is true', () => {
    renderWithProviders(<BookCard book={mockBook} hasPermission={true} />);

    expect(screen.queryByTestId('swap-button')).not.toBeInTheDocument();
  });

  it('applies different styles for profile view', () => {
    renderWithProviders(<BookCard book={mockBook} isProfile={true} />);

    // Profile view should not have shadow and different padding
    const titleElement = screen.getByText('Test Book');
    const card = titleElement.closest('div[role="button"]');
    expect(card).not.toHaveClass('shadow-lg');
  });

  it('applies shadow for regular view', () => {
    renderWithProviders(<BookCard book={mockBook} isProfile={false} />);

    const titleElement = screen.getByText('Test Book');
    const card = titleElement.closest('div[role="button"]');
    expect(card).toHaveClass('shadow-lg');
  });

  it('hides location and owner info in profile view', () => {
    renderWithProviders(<BookCard book={mockBook} isProfile={true} />);

    // In profile view, the location/owner section should be hidden
    const locationSection = screen.getByText('Helsinki').parentElement?.parentElement;
    expect(locationSection).toHaveClass('hidden');
  });

  it('shows location and owner info in regular view', () => {
    renderWithProviders(<BookCard book={mockBook} isProfile={false} />);

    expect(screen.getByText('Helsinki')).toBeInTheDocument();
    expect(screen.getByText('29 mins. ago')).toBeInTheDocument();
  });

  it('returns null when book is not provided', () => {
    // @ts-expect-error - Testing with null book
    const { container } = renderWithProviders(<BookCard book={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows owner profile photo when available', () => {
    renderWithProviders(<BookCard book={mockBook} />);

    const profileImage = screen.getByTestId('image-profile');
    expect(profileImage).toHaveAttribute('src', 'https://example.com/profile.jpg');
  });

  it('shows default profile image when ownerProfilePhoto is not available', () => {
    const bookWithoutProfile = { ...mockBook, ownerProfilePhoto: '' };
    renderWithProviders(<BookCard book={bookWithoutProfile} />);

    // Should not render profile image when ownerProfilePhoto is empty
    expect(screen.queryByTestId('image-profile')).not.toBeInTheDocument();
  });

  it('shows owner name when available', () => {
    renderWithProviders(<BookCard book={mockBook} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('truncates long titles', () => {
    const bookWithLongTitle = {
      ...mockBook,
      title: 'This is a very long book title that should be truncated in the UI display',
    };
    renderWithProviders(<BookCard book={bookWithLongTitle} />);

    const titleElement = screen.getByText(
      'This is a very long book title that should be truncated in the UI display',
    );
    expect(titleElement).toHaveClass('truncate');
  });

  it('renders with correct accessibility attributes', () => {
    renderWithProviders(<BookCard book={mockBook} />);

    // Get the main card button (not the swap button)
    const card = screen.getByText('Test Book').closest('[role="button"]');
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('navigates to edit page when Edit button is clicked', () => {
    // Mock useMouseClick to return clicked: true for this test
    mockUseMouseClick.mockReturnValueOnce({
      clicked: true,
      setClicked: vi.fn(),
      reference: { current: null },
    });

    renderWithProviders(<BookCard book={mockBook} hasPermission={true} />);

    // The menu should be visible, click the Edit button
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    // Should navigate to the edit page
    expect(mockNavigate).toHaveBeenCalledWith('/profile/update-book/1');
  });
});
