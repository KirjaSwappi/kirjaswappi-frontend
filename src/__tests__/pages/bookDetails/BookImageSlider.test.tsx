import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('react-icons/md', () => ({
  MdChevronLeft: () => <span>left</span>,
  MdChevronRight: () => <span>right</span>,
}));

vi.mock('../../../components/shared/Button', () => ({
  default: ({
    children,
    onClick,
    className,
    'aria-label': ariaLabel,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    'aria-label'?: string;
  }) => (
    <button onClick={onClick} className={className} aria-label={ariaLabel}>
      {children}
    </button>
  ),
}));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt, className }: { alt?: string; className?: string }) => (
    <img alt={alt || ''} className={className} />
  ),
}));

vi.mock('../../../pages/bookDetails/types/interface', () => ({}));

import BookImageSlider from '../../../pages/bookDetails/_components/BookImageSlider';

describe('BookImageSlider', () => {
  const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];

  it('renders all images', () => {
    render(<BookImageSlider images={images} />);
    expect(screen.getByAltText('Book 1')).toBeInTheDocument();
    expect(screen.getByAltText('Book 2')).toBeInTheDocument();
    expect(screen.getByAltText('Book 3')).toBeInTheDocument();
  });

  it('renders nav buttons for multiple images', () => {
    render(<BookImageSlider images={images} />);
    expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
    expect(screen.getByLabelText('Next image')).toBeInTheDocument();
  });

  it('renders dot indicators', () => {
    render(<BookImageSlider images={images} />);
    expect(screen.getByLabelText('Go to slide 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to slide 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to slide 3')).toBeInTheDocument();
  });

  it('does not render nav buttons for single image', () => {
    render(<BookImageSlider images={['single.jpg']} />);
    expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
  });

  it('navigates to next image on click', () => {
    render(<BookImageSlider images={images} />);
    fireEvent.click(screen.getByLabelText('Next image'));
    // Dot 2 should now be active (blue)
    const dot2 = screen.getByLabelText('Go to slide 2');
    expect(dot2.className).toContain('bg-blue-500');
  });
});
