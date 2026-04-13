import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import SwapBookCarousels from '../../../components/shared/SwapRequestModal/_components/SwapBookCarousels';

vi.mock('../../../../assets/tickmarkGreen.png', () => ({ default: 'tickmark.png' }));

vi.mock('../../../components/shared/Carousel', () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="carousel">{children}</div>
  ),
  CarouselContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="carousel-content">{children}</div>
  ),
  CarouselItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div data-testid="carousel-item" onClick={onClick}>
      {children}
    </div>
  ),
}));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img src={src} alt={alt} className={className} data-testid={`image-${alt}`} />
  ),
}));

function Wrapper({
  children,
  defaultValues,
}: {
  children: React.ReactNode;
  defaultValues: Record<string, unknown>;
}) {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

const mockBooks = [
  { id: '1', title: 'Book A', author: 'Author A', coverPhotoUrl: 'cover-a.jpg' },
  { id: '2', title: 'Book B', author: 'Author B', coverPhotoUrl: 'cover-b.jpg' },
];

describe('SwapBookCarousels', () => {
  it('renders carousel with books', () => {
    render(
      <Wrapper defaultValues={{ selectedBook: null }}>
        <SwapBookCarousels swapBook={mockBooks} />
      </Wrapper>,
    );

    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getAllByTestId('carousel-item')).toHaveLength(2);
  });

  it('displays book titles and authors', () => {
    render(
      <Wrapper defaultValues={{ selectedBook: null }}>
        <SwapBookCarousels swapBook={mockBooks} />
      </Wrapper>,
    );

    expect(screen.getByText('Book A')).toBeInTheDocument();
    expect(screen.getByText('by Author A')).toBeInTheDocument();
    expect(screen.getByText('Book B')).toBeInTheDocument();
    expect(screen.getByText('by Author B')).toBeInTheDocument();
  });

  it('renders book cover images', () => {
    render(
      <Wrapper defaultValues={{ selectedBook: null }}>
        <SwapBookCarousels swapBook={mockBooks} />
      </Wrapper>,
    );

    expect(screen.getByTestId('image-Book A')).toHaveAttribute('src', 'cover-a.jpg');
    expect(screen.getByTestId('image-Book B')).toHaveAttribute('src', 'cover-b.jpg');
  });

  it('returns null when swapBook is falsy', () => {
    const { container } = render(
      <Wrapper defaultValues={{ selectedBook: null }}>
        {/* @ts-expect-error - Testing with null */}
        <SwapBookCarousels swapBook={null} />
      </Wrapper>,
    );

    expect(container.querySelector('[data-testid="carousel"]')).not.toBeInTheDocument();
  });

  it('shows tick mark when a book is selected', () => {
    render(
      <Wrapper defaultValues={{ selectedBook: { id: '1', title: 'Book A' } }}>
        <SwapBookCarousels swapBook={mockBooks} />
      </Wrapper>,
    );

    expect(screen.getByTestId('image-ticmark')).toBeInTheDocument();
  });
});
