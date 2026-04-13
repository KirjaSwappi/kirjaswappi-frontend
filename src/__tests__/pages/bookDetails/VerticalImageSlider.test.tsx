import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-icons/bi', () => ({
  BiChevronLeft: () => <span>left</span>,
  BiChevronRight: () => <span>right</span>,
}));

vi.mock('../../../components/shared/Button', () => ({
  default: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

vi.mock('../../../components/shared/Carousel', () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselItem: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div onClick={onClick}>{children}</div>
  ),
}));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt || ''} />,
}));

import VerticalImageSlider from '../../../pages/bookDetails/_components/VerticalImageSlider';

describe('VerticalImageSlider', () => {
  const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];

  it('renders slide thumbnails', () => {
    render(<VerticalImageSlider images={images} />);
    expect(screen.getByAltText('Slide 0')).toBeInTheDocument();
    expect(screen.getByAltText('Slide 1')).toBeInTheDocument();
    expect(screen.getByAltText('Slide 2')).toBeInTheDocument();
  });

  it('renders preview image', () => {
    render(<VerticalImageSlider images={images} />);
    expect(screen.getByAltText('Preview-0')).toBeInTheDocument();
  });

  it('renders prev/next buttons', () => {
    render(<VerticalImageSlider images={images} />);
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });
});
