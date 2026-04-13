import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Exchanges from '../../../pages/bookDetails/_components/Exchanges';
import { SwapType } from '../../../../types/enum';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock('../../../components/shared/Carousel', () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('Exchanges', () => {
  it('returns null when swapCondition is falsy', () => {
    // @ts-expect-error - testing null prop
    const { container } = render(<Exchanges swapCondition={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders books for BYBOOKS swap type', () => {
    render(
      <Exchanges
        swapCondition={{
          swapType: SwapType.BYBOOKS,
          giveAway: false,
          openForOffers: false,
          swappableGenres: [],
          swappableBooks: [
            { id: '1', title: 'Test Book', author: 'Author A', coverPhotoUrl: 'url1' },
          ],
        }}
      />,
    );

    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText(/Author A/)).toBeInTheDocument();
  });

  it('renders genres for BYGENRES swap type', () => {
    render(
      <Exchanges
        swapCondition={{
          swapType: SwapType.BYGENRES,
          giveAway: false,
          openForOffers: false,
          swappableGenres: [{ id: 'g1', name: 'Fiction' }],
          swappableBooks: [],
        }}
      />,
    );

    expect(screen.getByText('Fiction')).toBeInTheDocument();
    expect(screen.getByText('exchange.anyOfThisGenre')).toBeInTheDocument();
  });

  it('renders open for offers message', () => {
    render(
      <Exchanges
        swapCondition={{
          swapType: SwapType.OPENTOOFFERS,
          giveAway: false,
          openForOffers: true,
          swappableGenres: [],
          swappableBooks: [],
        }}
      />,
    );

    expect(screen.getByText('openForOffers')).toBeInTheDocument();
    expect(screen.getByText('exchange.flexibleExchange')).toBeInTheDocument();
  });

  it('renders give away message', () => {
    render(
      <Exchanges
        swapCondition={{
          swapType: SwapType.GIVEAWAY,
          giveAway: true,
          openForOffers: false,
          swappableGenres: [],
          swappableBooks: [],
        }}
      />,
    );

    expect(screen.getByText('giveAway')).toBeInTheDocument();
    expect(screen.getByText('exchange.giveAwayOffers')).toBeInTheDocument();
  });

  it('renders multiple swappable books', () => {
    render(
      <Exchanges
        swapCondition={{
          swapType: SwapType.BYBOOKS,
          giveAway: false,
          openForOffers: false,
          swappableGenres: [],
          swappableBooks: [
            { id: '1', title: 'Book One', author: 'Author 1', coverPhotoUrl: 'url1' },
            { id: '2', title: 'Book Two', author: 'Author 2', coverPhotoUrl: 'url2' },
          ],
        }}
      />,
    );

    expect(screen.getByText('Book One')).toBeInTheDocument();
    expect(screen.getByText('Book Two')).toBeInTheDocument();
  });
});
