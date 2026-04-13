import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../../../components/shared/Carousel', () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselItem: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div onClick={onClick}>{children}</div>
  ),
}));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt, src }: { alt?: string; src?: string }) => <img alt={alt || ''} src={src} />,
}));

import SwapBookCarousels from '../../../pages/bookDetails/_components/SwapBookCarousels';

describe('SwapBookCarousels', () => {
  const books = [
    { id: '1', title: 'Book A', author: 'Author A', coverPhotoUrl: 'a.jpg' },
    { id: '2', title: 'Book B', author: 'Author B', coverPhotoUrl: 'b.jpg' },
  ];

  it('renders book titles', () => {
    render(<SwapBookCarousels swapBook={books} handleSelectBookForSwapRequest={vi.fn()} />);
    expect(screen.getByText('Book A')).toBeInTheDocument();
    expect(screen.getByText('Book B')).toBeInTheDocument();
  });

  it('renders authors', () => {
    render(<SwapBookCarousels swapBook={books} handleSelectBookForSwapRequest={vi.fn()} />);
    expect(screen.getByText('by Author A')).toBeInTheDocument();
    expect(screen.getByText('by Author B')).toBeInTheDocument();
  });

  it('renders cover images', () => {
    render(<SwapBookCarousels swapBook={books} handleSelectBookForSwapRequest={vi.fn()} />);
    expect(screen.getByAltText('Book A')).toBeInTheDocument();
    expect(screen.getByAltText('Book B')).toBeInTheDocument();
  });

  it('calls handler on item click', () => {
    const handler = vi.fn();
    render(<SwapBookCarousels swapBook={books} handleSelectBookForSwapRequest={handler} />);
    fireEvent.click(screen.getByText('Book A'));
    expect(handler).toHaveBeenCalledWith(books[0]);
  });

  it('returns null when swapBook is null', () => {
    const { container } = render(
      <SwapBookCarousels swapBook={null} handleSelectBookForSwapRequest={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
