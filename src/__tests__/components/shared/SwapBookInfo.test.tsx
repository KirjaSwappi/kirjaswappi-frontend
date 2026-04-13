import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import SwapBookInformation from '../../../components/shared/SwapRequestModal/_components/SwapBookInformation';
import { SwapType } from '../../../../types/enum';

describe('SwapBookInformation', () => {
  const baseSwapState = {
    swapModalOpen: false,
    swapBookInformation: {
      id: 'book-1',
      title: 'Test Book',
      author: 'Jane Doe',
      genres: ['Fiction', 'Drama'],
      language: 'English',
      description: 'A test book',
      condition: 'Good',
      coverPhotoUrls: [],
      owner: { id: 'owner-1', name: 'Owner' },
      swapCondition: {
        swapType: SwapType.BYBOOKS,
        giveAway: false,
        openForOffers: false,
        swappableGenres: [],
        swappableBooks: [],
      },
    },
    bookIdToSwapWith: '',
    errorMessage: '',
    swapFilterGenre: [],
  };

  it('renders book title', () => {
    renderWithProviders(<SwapBookInformation />, {
      preloadedState: { swapBook: baseSwapState },
    });

    expect(screen.getByText('Test Book')).toBeInTheDocument();
  });

  it('renders book author', () => {
    renderWithProviders(<SwapBookInformation />, {
      preloadedState: { swapBook: baseSwapState },
    });

    expect(screen.getByText('by Jane Doe')).toBeInTheDocument();
  });

  it('renders all genres', () => {
    renderWithProviders(<SwapBookInformation />, {
      preloadedState: { swapBook: baseSwapState },
    });

    expect(screen.getByText('Fiction')).toBeInTheDocument();
    expect(screen.getByText('Drama')).toBeInTheDocument();
  });

  it('renders book condition', () => {
    renderWithProviders(<SwapBookInformation />, {
      preloadedState: { swapBook: baseSwapState },
    });

    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  it('renders condition label', () => {
    renderWithProviders(<SwapBookInformation />, {
      preloadedState: { swapBook: baseSwapState },
    });

    expect(screen.getByText('Book Condition:')).toBeInTheDocument();
  });
});
