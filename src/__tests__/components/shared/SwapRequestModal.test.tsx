import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import SwapModal from '../../../components/shared/SwapRequestModal/SwapRequestModal';
import { SwapType } from '../../../../types/enum';

// Mock swapApi - use importActual to preserve the swapApi export used by swapSlice extraReducers
const mockSwapRequestMutation = vi.fn();
const mockSwapRequestReset = vi.fn();
vi.mock('../../../redux/feature/swap/swapApi', async (importActual) => {
  const actual = await importActual<typeof import('../../../redux/feature/swap/swapApi')>();
  return {
    ...actual,
    useSwapRequestMutation: () => [
      mockSwapRequestMutation,
      { isLoading: false, isSuccess: false, reset: mockSwapRequestReset },
    ],
  };
});

// Mock bookApi
vi.mock('../../../redux/feature/book/bookApi', () => ({
  useGetAllBooksQuery: () => ({ data: null }),
}));

// Mock child components
vi.mock('../../../components/shared/SwapRequestModal/_components/RequestErrorAnimation', () => ({
  default: () => <div data-testid="request-failed-animation" />,
}));

vi.mock(
  '../../../components/shared/SwapRequestModal/_components/RequestProcessingAnimation',
  () => ({
    default: () => <div data-testid="request-processing-animation" />,
  }),
);

vi.mock('../../../components/shared/SwapRequestModal/_components/RequestSuccessAnimation', () => ({
  default: () => <div data-testid="request-success-animation" />,
}));

vi.mock('../../../components/shared/SwapRequestModal/_components/SwapBookInformation', () => ({
  default: () => <div data-testid="swap-book-info">Book Info</div>,
}));

vi.mock('../../../components/shared/SwapRequestModal/_components/SwapConditionList', () => ({
  SwapConditionList: {
    ByBooks: { label: 'By Books', description: 'Swap with a book' },
    ByGenres: { label: 'By Genres', description: 'Swap by genre' },
    GiveAway: { label: 'Give Away', description: 'Give away the book' },
    OpenForOffers: { label: 'Open for Offers', description: 'Open to all offers' },
  },
}));

vi.mock('../../../components/shared/SwapRequestModal/_components/SwapFormControllers', () => ({
  default: () => <div data-testid="swap-form-controllers">Form Controllers</div>,
}));

vi.mock('../../../components/shared/SwapRequestModal/_components/SwapModalBookImage', () => ({
  default: () => <div data-testid="swap-modal-book-image">Book Image</div>,
}));

vi.mock(
  '../../../components/shared/SwapRequestModal/_components/SwapModalConditionDisplay',
  () => ({
    default: () => <div data-testid="swap-modal-condition-display">Condition</div>,
  }),
);

vi.mock('../../../components/shared/SwapRequestModal/_components/SwapModalGenreTags', () => ({
  default: () => <div data-testid="swap-modal-genre-tags">Genre Tags</div>,
}));

vi.mock('../../../components/shared/SwapRequestModal/_components/SwapModalHeader', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="swap-modal-header">
      <button onClick={onClose} data-testid="close-swap-modal">
        Close
      </button>
    </div>
  ),
}));

vi.mock('../../../components/shared/SwapRequestModal/_components/SwapModalSubmitButton', () => ({
  default: ({ disabled }: { disabled: boolean }) => (
    <button data-testid="swap-submit-button" disabled={disabled}>
      Send Request
    </button>
  ),
}));

vi.mock('../../../components/shared/SwapRequestModal/_components/SwapRequestSkeleton', () => ({
  default: () => <div data-testid="swap-request-skeleton">Loading...</div>,
}));

vi.mock('../../../components/shared/ControllerField', () => ({
  default: ({
    name,
    placeholder,
  }: {
    name: string;
    placeholder?: string;
    type?: string;
    className?: string;
  }) => <textarea data-testid={`input-${name}`} placeholder={placeholder} />,
}));

vi.mock('../../../components/shared/InputLabel', () => ({
  default: ({ label }: { label: string; className?: string }) => <label>{label}</label>,
}));

vi.mock('../../../components/shared/Line', () => ({
  default: ({ className }: { className?: string }) => <hr className={className} />,
}));

vi.mock('../../../components/shared/MessageToastify', () => ({
  default: ({ value }: { value: string; isShow?: boolean; type?: string }) => (
    <div data-testid="error-message">{value}</div>
  ),
}));

const baseSwapState = {
  swapModalOpen: true,
  swapBookInformation: {
    id: 'book-1',
    title: 'Test Book',
    author: 'Test Author',
    genres: ['Fiction'],
    language: 'English',
    description: 'A test book',
    condition: 'Good',
    coverPhotoUrls: ['https://example.com/cover.jpg'],
    owner: { id: 'owner-1', name: 'Owner Name' },
    swapCondition: {
      swapType: SwapType.BYBOOKS,
      giveAway: false,
      openForOffers: false,
      swappableGenres: [],
      swappableBooks: [],
    },
  },
  bookIdToSwapWith: 'book-to-swap-1',
  errorMessage: '',
  swapFilterGenre: [],
};

describe('SwapModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSwapRequestMutation.mockResolvedValue({});
  });

  it('renders swap modal when swapModalOpen is true', () => {
    renderWithProviders(<SwapModal />, {
      preloadedState: {
        swapBook: baseSwapState,
        book: { loading: false },
      },
    });

    expect(screen.getByTestId('swap-modal-header')).toBeInTheDocument();
  });

  it('hides modal when swapModalOpen is false', () => {
    renderWithProviders(<SwapModal />, {
      preloadedState: {
        swapBook: { ...baseSwapState, swapModalOpen: false },
        book: { loading: false },
      },
    });

    // The modal container should have 'hidden' class
    const modal = screen.getByTestId('swap-modal-header').closest('.hidden');
    expect(modal).not.toBeNull();
  });

  it('renders swap form controllers', () => {
    renderWithProviders(<SwapModal />, {
      preloadedState: {
        swapBook: baseSwapState,
        book: { loading: false },
      },
    });

    expect(screen.getByTestId('swap-form-controllers')).toBeInTheDocument();
  });

  it('renders short note textarea', () => {
    renderWithProviders(<SwapModal />, {
      preloadedState: {
        swapBook: baseSwapState,
        book: { loading: false },
      },
    });

    expect(screen.getByTestId('input-note')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    renderWithProviders(<SwapModal />, {
      preloadedState: {
        swapBook: baseSwapState,
        book: { loading: false },
      },
    });

    expect(screen.getByTestId('swap-submit-button')).toBeInTheDocument();
  });

  it('renders book image component', () => {
    renderWithProviders(<SwapModal />, {
      preloadedState: {
        swapBook: baseSwapState,
        book: { loading: false },
      },
    });

    expect(screen.getByTestId('swap-modal-book-image')).toBeInTheDocument();
  });

  it('renders condition display', () => {
    renderWithProviders(<SwapModal />, {
      preloadedState: {
        swapBook: baseSwapState,
        book: { loading: false },
      },
    });

    expect(screen.getByTestId('swap-modal-condition-display')).toBeInTheDocument();
  });

  it('shows skeleton when loading is true', () => {
    renderWithProviders(<SwapModal />, {
      preloadedState: {
        swapBook: baseSwapState,
        book: { loading: true },
      },
    });

    expect(screen.getByTestId('swap-request-skeleton')).toBeInTheDocument();
  });

  it('closes modal and resets state when close button clicked', () => {
    const { store } = renderWithProviders(<SwapModal />, {
      preloadedState: {
        swapBook: baseSwapState,
        book: { loading: false },
      },
    });

    const closeButton = screen.getByTestId('close-swap-modal');
    closeButton.click();

    expect(store.getState().swapBook.swapModalOpen).toBe(false);
  });

  it('renders animation components', () => {
    renderWithProviders(<SwapModal />, {
      preloadedState: {
        swapBook: baseSwapState,
        book: { loading: false },
      },
    });

    expect(screen.getByTestId('request-processing-animation')).toBeInTheDocument();
    expect(screen.getByTestId('request-success-animation')).toBeInTheDocument();
    expect(screen.getByTestId('request-failed-animation')).toBeInTheDocument();
  });
});
