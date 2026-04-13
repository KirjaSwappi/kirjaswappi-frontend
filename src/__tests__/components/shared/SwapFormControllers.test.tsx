import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { SwapType } from '../../../../types/enum';
import SwapFormControllers from '../../../components/shared/SwapRequestModal/_components/SwapFormControllers';

vi.mock('../../../components/shared/SwapRequestModal/_components/SwapBookCarousels', () => ({
  default: () => <div data-testid="swap-book-carousels">Carousels</div>,
}));

vi.mock('../../../components/shared/SwapRequestModal/_components/SwapController', () => ({
  default: ({ swapTitle, swapType }: { swapTitle: string; swapType: string }) => (
    <div data-testid={`swap-controller-${swapType}`}>{swapTitle}</div>
  ),
}));

vi.mock('../../../components/shared/Button', () => ({
  default: ({ children, ...props }: { children: React.ReactNode }) => (
    <button {...props}>{children}</button>
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
  { id: '1', title: 'Book A', author: 'Author A', coverPhotoUrl: 'url-a' },
  { id: '2', title: 'Book B', author: 'Author B', coverPhotoUrl: 'url-b' },
];

describe('SwapFormControllers', () => {
  it('renders giveaway controller for all swap types', () => {
    render(
      <Wrapper defaultValues={{ swapType: SwapType.BYBOOKS }}>
        <SwapFormControllers
          swapType={SwapType.BYBOOKS}
          swappableBooks={mockBooks}
          books={mockBooks}
          data={mockBooks}
        />
      </Wrapper>,
    );

    expect(screen.getByTestId(`swap-controller-${SwapType.GIVEAWAY}`)).toBeInTheDocument();
    expect(screen.getByText('Ask for giveaway')).toBeInTheDocument();
  });

  it('renders BYGENRES controller when swapType is BYGENRES', () => {
    render(
      <Wrapper defaultValues={{ swapType: SwapType.BYGENRES }}>
        <SwapFormControllers
          swapType={SwapType.BYGENRES}
          swappableBooks={mockBooks}
          books={mockBooks}
          data={mockBooks}
        />
      </Wrapper>,
    );

    expect(screen.getByTestId(`swap-controller-${SwapType.BYGENRES}`)).toBeInTheDocument();
    expect(screen.getByText('Select from your library')).toBeInTheDocument();
  });

  it('renders OPENTOOFFERS controller when swapType is OPENTOOFFERS', () => {
    render(
      <Wrapper defaultValues={{ swapType: SwapType.OPENTOOFFERS }}>
        <SwapFormControllers
          swapType={SwapType.OPENTOOFFERS}
          swappableBooks={mockBooks}
          books={mockBooks}
          data={mockBooks}
        />
      </Wrapper>,
    );

    expect(screen.getByTestId(`swap-controller-${SwapType.OPENTOOFFERS}`)).toBeInTheDocument();
  });

  it('does not render BYGENRES controller when swapType is BYBOOKS', () => {
    render(
      <Wrapper defaultValues={{ swapType: SwapType.BYBOOKS }}>
        <SwapFormControllers
          swapType={SwapType.BYBOOKS}
          swappableBooks={mockBooks}
          books={mockBooks}
          data={mockBooks}
        />
      </Wrapper>,
    );

    expect(screen.queryByTestId(`swap-controller-${SwapType.BYGENRES}`)).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(`swap-controller-${SwapType.OPENTOOFFERS}`),
    ).not.toBeInTheDocument();
  });

  it('renders swap book carousels', () => {
    render(
      <Wrapper defaultValues={{ swapType: SwapType.BYBOOKS }}>
        <SwapFormControllers
          swapType={SwapType.BYBOOKS}
          swappableBooks={mockBooks}
          books={mockBooks}
          data={mockBooks}
        />
      </Wrapper>,
    );

    expect(screen.getByTestId('swap-book-carousels')).toBeInTheDocument();
  });
});
