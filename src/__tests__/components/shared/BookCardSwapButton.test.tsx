import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import BookCardSwapButton from '../../../components/shared/BookCardSwapButton';

vi.mock('../../../assets/swapIcon.png', () => ({ default: 'swapIcon.png' }));
vi.mock('../../../components/shared/Image', () => ({
  default: ({ src, alt, className }: { src: string; alt?: string; className?: string }) => (
    <img src={src} alt={alt} className={className} data-testid="swap-icon" />
  ),
}));

describe('BookCardSwapButton Component', () => {
  it('renders the swap button', () => {
    render(<BookCardSwapButton />);
    expect(screen.getByRole('button', { name: 'Swap Book' })).toBeInTheDocument();
  });

  it('renders the swap icon image', () => {
    render(<BookCardSwapButton />);
    expect(screen.getByTestId('swap-icon')).toBeInTheDocument();
  });

  it('renders the "Swap Book" label span', () => {
    render(<BookCardSwapButton />);
    expect(screen.getByText('Swap Book')).toBeInTheDocument();
  });

  it('has type="button"', () => {
    render(<BookCardSwapButton />);
    expect(screen.getByRole('button', { name: 'Swap Book' })).toHaveAttribute('type', 'button');
  });

  it('has tabIndex 0 for keyboard accessibility', () => {
    render(<BookCardSwapButton />);
    expect(screen.getByRole('button', { name: 'Swap Book' })).toHaveAttribute('tabIndex', '0');
  });

  it('renders the exchange icon with correct alt text', () => {
    render(<BookCardSwapButton />);
    expect(screen.getByAltText('Exchange')).toBeInTheDocument();
  });

  it('applies overflow-hidden class for animation clipping', () => {
    render(<BookCardSwapButton />);
    expect(screen.getByRole('button', { name: 'Swap Book' })).toHaveClass('overflow-hidden');
  });
});
