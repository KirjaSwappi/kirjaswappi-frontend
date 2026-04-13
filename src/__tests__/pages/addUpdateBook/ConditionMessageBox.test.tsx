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
    expect(screen.getByText('Swap with specific book(s).')).toBeInTheDocument();
  });

  it('renders ByGenres message', () => {
    render(<ConditionMessageBox swapType="ByGenres" />);
    expect(screen.getByText(/Add/)).toBeInTheDocument();
  });

  it('renders GiveAway message', () => {
    render(<ConditionMessageBox swapType="GiveAway" />);
    expect(screen.getByText('You will receive offers for giveaway')).toBeInTheDocument();
  });

  it('renders OpenForOffers message', () => {
    render(<ConditionMessageBox swapType="OpenForOffers" />);
    expect(screen.getByText('You will receive offers of all sorts of books')).toBeInTheDocument();
  });

  it('returns null for empty swapType', () => {
    const { container } = render(<ConditionMessageBox swapType="" />);
    expect(container.firstChild).toBeNull();
  });
});
