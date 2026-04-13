import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import FilterByCondition from '../../../../components/Header/_components/BookFilter/FilterByCondition';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../../redux/feature/book/bookApi', () => ({
  useGetSupportConditionQuery: vi.fn(() => ({
    data: ['New', 'Good', 'Fair'],
    isLoading: false,
  })),
}));

vi.mock('../../../../components/shared/Button', () => ({
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

vi.mock('../../../../components/shared/Image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock('../../../../components/Header/_components/BookFilter/GenreSkelton', () => ({
  default: () => <div data-testid="genre-skeleton" />,
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm({ defaultValues: { condition: [] } });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('FilterByCondition', () => {
  it('renders Swap Condition label', () => {
    render(
      <Wrapper>
        <FilterByCondition />
      </Wrapper>,
    );

    expect(screen.getByText('filter.swapCondition')).toBeInTheDocument();
  });

  it('renders all condition options', () => {
    render(
      <Wrapper>
        <FilterByCondition />
      </Wrapper>,
    );

    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
    expect(screen.getByText('Fair')).toBeInTheDocument();
  });

  it('selects a condition on click', () => {
    render(
      <Wrapper>
        <FilterByCondition />
      </Wrapper>,
    );

    fireEvent.click(screen.getByText('New').closest('button')!);
    expect(screen.getByText('New').closest('button')).toHaveClass('bg-AntiFlashWhite');
  });

  it('collapses options when toggle is clicked', () => {
    render(
      <Wrapper>
        <FilterByCondition />
      </Wrapper>,
    );

    // Click the Swap Condition toggle to collapse
    fireEvent.click(screen.getByText('filter.swapCondition').closest('button')!);
    expect(screen.queryByText('New')).not.toBeInTheDocument();
  });
});
