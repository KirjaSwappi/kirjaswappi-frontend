import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { SwapType } from '../../../../types/enum';
import SwapController from '../../../components/shared/SwapRequestModal/_components/SwapController';

vi.mock('lottie-react', () => ({
  default: () => <div data-testid="lottie-animation" />,
}));

vi.mock('../../../../assets/giveaway.png', () => ({ default: 'giveaway.png' }));
vi.mock('../../../../assets/library.png', () => ({ default: 'library.png' }));
vi.mock('../../../../assets/notFoundData.json', () => ({ default: {} }));

vi.mock('../../../components/shared/SwapRequestModal/_components/SwapBookCarousels', () => ({
  default: () => <div data-testid="swap-book-carousels">Carousels</div>,
}));

vi.mock('../../../components/shared/Button', () => ({
  default: ({ children, ...props }: { children: React.ReactNode }) => (
    <button {...props}>{children}</button>
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

const mockBooks = [{ id: '1', title: 'Book A', author: 'Author A', coverPhotoUrl: 'url-a' }];

describe('SwapController', () => {
  it('renders the swap title and description', () => {
    render(
      <Wrapper defaultValues={{ swapType: SwapType.BYGENRES }}>
        <SwapController
          swapTitle="Select from your library"
          swapType={SwapType.BYGENRES}
          books={mockBooks}
          swapDescription="You can offer from your library"
        />
      </Wrapper>,
    );

    expect(screen.getByText('Select from your library')).toBeInTheDocument();
    expect(screen.getByText('You can offer from your library')).toBeInTheDocument();
  });

  it('renders radio input with correct value', () => {
    render(
      <Wrapper defaultValues={{ swapType: SwapType.GIVEAWAY }}>
        <SwapController
          swapTitle="Ask for giveaway"
          swapType={SwapType.GIVEAWAY}
          swapDescription="Ask for giveaway"
        />
      </Wrapper>,
    );

    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('value', SwapType.GIVEAWAY);
  });

  it('shows book carousels when selected and books available', () => {
    render(
      <Wrapper defaultValues={{ swapType: SwapType.BYGENRES }}>
        <SwapController
          swapTitle="Select from your library"
          swapType={SwapType.BYGENRES}
          books={mockBooks}
          swapDescription="You can offer from your library"
        />
      </Wrapper>,
    );

    expect(screen.getByTestId('swap-book-carousels')).toBeInTheDocument();
  });

  it('shows not found message when selected with no books', () => {
    render(
      <Wrapper defaultValues={{ swapType: SwapType.BYGENRES }}>
        <SwapController
          swapTitle="Select from your library"
          swapType={SwapType.BYGENRES}
          books={[]}
          swapDescription="You can offer from your library"
        />
      </Wrapper>,
    );

    expect(screen.getByText('Books not found in your library')).toBeInTheDocument();
  });

  it('does not show carousels for GIVEAWAY type even when selected', () => {
    render(
      <Wrapper defaultValues={{ swapType: SwapType.GIVEAWAY }}>
        <SwapController
          swapTitle="Ask for giveaway"
          swapType={SwapType.GIVEAWAY}
          books={mockBooks}
          swapDescription="Ask for giveaway"
        />
      </Wrapper>,
    );

    expect(screen.queryByTestId('swap-book-carousels')).not.toBeInTheDocument();
  });
});
