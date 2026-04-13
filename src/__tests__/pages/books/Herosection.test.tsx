import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HeroSection from '../../../pages/books/_components/Herosection';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('react-icons/md', () => ({
  MdKeyboardArrowLeft: () => <span>Left</span>,
  MdKeyboardArrowRight: () => <span>Right</span>,
}));

vi.mock('../../../assets/heroSectionImage.png', () => ({
  default: 'hero-image.png',
}));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
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
  CarouselItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../../../utility/cn', () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(' '),
}));

describe('HeroSection', () => {
  it('renders the first slide title', () => {
    render(<HeroSection />);
    expect(screen.getByText('books.heroSlide1Title')).toBeInTheDocument();
  });

  it('renders all slide titles', () => {
    render(<HeroSection />);
    expect(screen.getByText('books.heroSlide1Title')).toBeInTheDocument();
    expect(screen.getByText('books.heroSlide2Title')).toBeInTheDocument();
    expect(screen.getByText('books.heroSlide3Title')).toBeInTheDocument();
  });

  it('renders slide descriptions', () => {
    render(<HeroSection />);
    expect(screen.getByText('books.heroSlide1Desc')).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(<HeroSection />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it('renders dot indicators for all slides', () => {
    const { container } = render(<HeroSection />);
    const dots = container.querySelectorAll('.rounded-full.bg-\\[\\#3B82F6\\]');
    expect(dots).toHaveLength(3);
  });
});
