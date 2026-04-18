import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../../../assets/3d-condition-icon-Genre.png', () => ({ default: 'genre.png' }));
vi.mock('../../../assets/3d-condition-icon-Giveaway.png', () => ({ default: 'give.png' }));
vi.mock('../../../assets/3d-condition-icon-Open-to-Offer.png', () => ({ default: 'open.png' }));
vi.mock('../../../assets/3d-condition-icon-by-book.png', () => ({ default: 'book.png' }));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt || ''} />,
}));

import ConditionMessageBox from '../../../pages/addUpdateBook/_components/ConditionMessageBox';

describe('ConditionMessageBox', () => {
  it('renders ByBooks message', () => {
    render(<ConditionMessageBox swapType="ByBooks" />);
    expect(
      screen.getByText(
        "You want to swap with a specific book. Add the books you're interested in exchanging for.",
      ),
    ).toBeInTheDocument();
  });

  it('renders ByGenres message', () => {
    render(<ConditionMessageBox swapType="ByGenres" />);
    expect(
      screen.getByText(
        "You prefer swapping within specific genres. Select the genres you're open to receiving.",
      ),
    ).toBeInTheDocument();
  });

  it('renders GiveAway message', () => {
    render(<ConditionMessageBox swapType="GiveAway" />);
    expect(
      screen.getByText(
        "You're giving this book away for free. No swap required — anyone can request it!",
      ),
    ).toBeInTheDocument();
  });

  it('renders OpenForOffers message', () => {
    render(<ConditionMessageBox swapType="OpenForOffers" />);
    expect(
      screen.getByText(
        "You're open to any book offer. Interested readers can propose a swap with any book they'd like to exchange.",
      ),
    ).toBeInTheDocument();
  });

  it('returns null for empty swapType', () => {
    const { container } = render(<ConditionMessageBox swapType="" />);
    expect(container.firstChild).toBeNull();
  });
});
