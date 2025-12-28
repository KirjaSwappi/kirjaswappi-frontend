import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Carousel, CarouselContent, CarouselItem } from '../../../components/shared/Carousel';

// Mock Embla Carousel types
interface MockEmblaApi {
  canScrollPrev: Mock<() => boolean>;
  canScrollNext: Mock<() => boolean>;
  scrollPrev: Mock<() => void>;
  scrollNext: Mock<() => void>;
  on: Mock<(event: string, callback: () => void) => void>;
  off: Mock<(event: string, callback: () => void) => void>;
  destroy: Mock<() => void>;
}

let mockEmblaApi: MockEmblaApi;
let mockEmblaCarousel: Mock<(...args: unknown[]) => [{ current: null }, MockEmblaApi]>;

vi.mock('embla-carousel-react', () => ({
  default: (...args: unknown[]) => mockEmblaCarousel(...args),
}));

describe('Carousel Component', () => {
  beforeEach(() => {
    mockEmblaApi = {
      canScrollPrev: vi.fn(() => false),
      canScrollNext: vi.fn(() => true),
      scrollPrev: vi.fn(),
      scrollNext: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      destroy: vi.fn(),
    };

    mockEmblaCarousel = vi.fn(() => [{ current: null }, mockEmblaApi]);

    vi.clearAllMocks();
  });

  it('renders carousel with basic structure', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
  });

  it('applies custom className to carousel', () => {
    render(
      <Carousel className="custom-carousel">
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    const carousel = screen.getByRole('region');
    expect(carousel).toHaveClass('custom-carousel');
  });

  it('renders with horizontal orientation by default', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    // Check that embla was called with horizontal axis
    expect(mockEmblaCarousel).toHaveBeenCalledWith(
      expect.objectContaining({ axis: 'x' }),
      undefined,
    );
  });

  it('renders with vertical orientation', () => {
    render(
      <Carousel orientation="vertical">
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    // Check that embla was called with vertical axis
    expect(mockEmblaCarousel).toHaveBeenCalledWith(
      expect.objectContaining({ axis: 'y' }),
      undefined,
    );
  });

  it('passes options to embla carousel', () => {
    const options = { loop: true, skipSnaps: false };
    render(
      <Carousel opts={options}>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    expect(mockEmblaCarousel).toHaveBeenCalledWith(expect.objectContaining(options), undefined);
  });

  it('passes plugins to embla carousel', () => {
    const mockPlugin = {
      name: 'test-plugin',
      options: {},
      init: vi.fn(),
      destroy: vi.fn(),
    };
    render(
      <Carousel plugins={[mockPlugin]}>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    expect(mockEmblaCarousel).toHaveBeenCalledWith(expect.any(Object), [mockPlugin]);
  });

  it('exposes api when setApi prop is provided', () => {
    const mockSetApi = vi.fn();

    render(
      <Carousel setApi={mockSetApi}>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    expect(mockSetApi).toHaveBeenCalledWith(mockEmblaApi);
  });

  it('handles keyboard navigation with arrow keys', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    const carousel = screen.getByRole('region');

    // Test right arrow
    fireEvent.keyDown(carousel, { key: 'ArrowRight' });
    expect(mockEmblaApi.scrollNext).toHaveBeenCalled();

    // Test left arrow
    fireEvent.keyDown(carousel, { key: 'ArrowLeft' });
    expect(mockEmblaApi.scrollPrev).toHaveBeenCalled();
  });

  it('ignores other keys in keyboard navigation', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    const carousel = screen.getByRole('region');

    fireEvent.keyDown(carousel, { key: 'Enter' });
    fireEvent.keyDown(carousel, { key: ' ' });

    expect(mockEmblaApi.scrollNext).not.toHaveBeenCalled();
    expect(mockEmblaApi.scrollPrev).not.toHaveBeenCalled();
  });

  it('applies correct classes to CarouselContent', () => {
    render(
      <Carousel>
        <CarouselContent className="custom-content">
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    // The CarouselContent renders two divs: outer with overflow-hidden, inner with flex
    const content = screen.getByText('Slide 1').parentElement?.parentElement;
    expect(content).toHaveClass('overflow-hidden');
    expect(content?.firstElementChild).toHaveClass('custom-content');
  });

  it('applies horizontal layout classes to CarouselContent', () => {
    render(
      <Carousel orientation="horizontal">
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    const content = screen.getByText('Slide 1').parentElement;
    expect(content).toHaveClass('-ml-4');
    expect(content).not.toHaveClass('flex-col');
  });

  it('applies vertical layout classes to CarouselContent', () => {
    render(
      <Carousel orientation="vertical">
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    const content = screen.getByText('Slide 1').parentElement;
    expect(content).toHaveClass('-mt-4');
    expect(content).toHaveClass('flex-col');
  });

  it('applies correct classes and attributes to CarouselItem', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem className="custom-item">Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    const item = screen.getByRole('group');
    expect(item).toHaveClass('min-w-0');
    expect(item).toHaveClass('shrink-0');
    expect(item).toHaveClass('grow-0');
    expect(item).toHaveClass('pl-4');
    expect(item).toHaveClass('custom-item');
    expect(item).toHaveAttribute('aria-roledescription', 'slide');
  });

  it('applies vertical classes to CarouselItem', () => {
    render(
      <Carousel orientation="vertical">
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    const item = screen.getByRole('group');
    expect(item).toHaveClass('pt-4');
    expect(item).not.toHaveClass('pl-4');
  });

  it('handles multiple carousel items', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
          <CarouselItem>Slide 3</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
    expect(screen.getByText('Slide 3')).toBeInTheDocument();

    const items = screen.getAllByRole('group');
    expect(items).toHaveLength(3);
  });

  it('sets up and cleans up embla event listeners', () => {
    const { unmount } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    expect(mockEmblaApi.on).toHaveBeenCalledWith('reInit', expect.any(Function));
    expect(mockEmblaApi.on).toHaveBeenCalledWith('select', expect.any(Function));

    unmount();

    expect(mockEmblaApi.off).toHaveBeenCalledWith('select', expect.any(Function));
  });

  it('updates scroll state when api changes', async () => {
    mockEmblaApi.canScrollPrev.mockReturnValue(true);
    mockEmblaApi.canScrollNext.mockReturnValue(false);

    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    // The select callback should have been called during setup
    expect(mockEmblaApi.canScrollPrev).toHaveBeenCalled();
    expect(mockEmblaApi.canScrollNext).toHaveBeenCalled();
  });

  it('handles empty carousel gracefully', () => {
    render(<Carousel></Carousel>);

    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('handles carousel with only content but no items', () => {
    render(
      <Carousel>
        <CarouselContent></CarouselContent>
      </Carousel>,
    );

    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('passes through additional props to carousel container', () => {
    render(
      <Carousel data-testid="custom-carousel" aria-label="Custom Carousel">
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );

    const carousel = screen.getByTestId('custom-carousel');
    expect(carousel).toHaveAttribute('aria-label', 'Custom Carousel');
  });
});
