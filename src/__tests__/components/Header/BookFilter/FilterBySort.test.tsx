import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import FilterBySort from '../../../../components/Header/_components/BookFilter/FilterBySort';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
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

vi.mock('../../../../components/shared/Line', () => ({
  default: () => <hr />,
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm({ defaultValues: { sortBy: [] } });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('FilterBySort', () => {
  it('renders Sort By label', () => {
    render(
      <Wrapper>
        <FilterBySort />
      </Wrapper>,
    );

    expect(screen.getByText('filter.sortBy')).toBeInTheDocument();
  });

  it('renders all sort option labels', () => {
    render(
      <Wrapper>
        <FilterBySort />
      </Wrapper>,
    );

    expect(screen.getByText('filter.sortTitleAZ')).toBeInTheDocument();
    expect(screen.getByText('filter.sortAuthorAZ')).toBeInTheDocument();
    expect(screen.getByText('filter.sortLanguageAZ')).toBeInTheDocument();
    expect(screen.getByText('filter.sortConditionAZ')).toBeInTheDocument();
  });

  it('selects a sort option on click', () => {
    render(
      <Wrapper>
        <FilterBySort />
      </Wrapper>,
    );

    const titleOption = screen.getByText('filter.sortTitleAZ').closest('button')!;
    fireEvent.click(titleOption);
    expect(titleOption).toHaveClass('bg-primary');
  });

  it('deselects a sort option on second click', () => {
    render(
      <Wrapper>
        <FilterBySort />
      </Wrapper>,
    );

    const titleOption = screen.getByText('filter.sortTitleAZ').closest('button')!;
    fireEvent.click(titleOption);
    expect(titleOption).toHaveClass('bg-primary');

    fireEvent.click(titleOption);
    expect(titleOption).not.toHaveClass('bg-primary');
  });

  it('allows multiple selections', () => {
    render(
      <Wrapper>
        <FilterBySort />
      </Wrapper>,
    );

    fireEvent.click(screen.getByText('filter.sortTitleAZ').closest('button')!);
    fireEvent.click(screen.getByText('filter.sortAuthorAZ').closest('button')!);

    expect(screen.getByText('filter.sortTitleAZ').closest('button')).toHaveClass('bg-primary');
    expect(screen.getByText('filter.sortAuthorAZ').closest('button')).toHaveClass('bg-primary');
  });
});
