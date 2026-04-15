import { describe, it, expect, vi, beforeEach } from 'vitest';
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
    ...rest
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    'aria-label'?: string;
    'aria-pressed'?: boolean;
  }) => (
    <button onClick={onClick} className={className} {...rest}>
      {children}
    </button>
  ),
}));

vi.mock('react-icons/lu', () => ({
  LuArrowUpAZ: () => <span data-testid="icon-asc">asc</span>,
  LuArrowDownAZ: () => <span data-testid="icon-desc">desc</span>,
}));

const mockDispatch = vi.fn();
vi.mock('../../../../redux/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: { filter: { filter: { sortOrder: string } } }) => string) =>
    selector({ filter: { filter: { sortOrder: 'asc' } } }),
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm({ defaultValues: { sortBy: [] } });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('FilterBySort', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

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

    expect(screen.getByText('filter.sortTitle')).toBeInTheDocument();
    expect(screen.getByText('filter.sortAuthor')).toBeInTheDocument();
    expect(screen.getByText('filter.sortLanguage')).toBeInTheDocument();
    expect(screen.getByText('filter.sortCondition')).toBeInTheDocument();
    expect(screen.getByText('filter.sortDateAdded')).toBeInTheDocument();
  });

  it('renders asc/desc toggle icons', () => {
    render(
      <Wrapper>
        <FilterBySort />
      </Wrapper>,
    );

    expect(screen.getByTestId('icon-asc')).toBeInTheDocument();
    expect(screen.getByTestId('icon-desc')).toBeInTheDocument();
  });

  it('dispatches setSortOrder on asc/desc click', () => {
    render(
      <Wrapper>
        <FilterBySort />
      </Wrapper>,
    );

    const descButton = screen.getByTestId('icon-desc').closest('button')!;
    fireEvent.click(descButton);
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: 'desc' }));
  });

  it('selects a sort option on click', () => {
    render(
      <Wrapper>
        <FilterBySort />
      </Wrapper>,
    );

    const titleOption = screen.getByText('filter.sortTitle').closest('button')!;
    fireEvent.click(titleOption);
    expect(titleOption).toHaveClass('bg-AntiFlashWhite');
  });

  it('deselects a sort option on second click', () => {
    render(
      <Wrapper>
        <FilterBySort />
      </Wrapper>,
    );

    const titleOption = screen.getByText('filter.sortTitle').closest('button')!;
    fireEvent.click(titleOption);
    expect(titleOption).toHaveClass('bg-AntiFlashWhite');

    fireEvent.click(titleOption);
    expect(titleOption).not.toHaveClass('bg-AntiFlashWhite');
  });

  it('allows only one selection at a time', () => {
    render(
      <Wrapper>
        <FilterBySort />
      </Wrapper>,
    );

    fireEvent.click(screen.getByText('filter.sortTitle').closest('button')!);
    fireEvent.click(screen.getByText('filter.sortAuthor').closest('button')!);

    expect(screen.getByText('filter.sortTitle').closest('button')).not.toHaveClass(
      'bg-AntiFlashWhite',
    );
    expect(screen.getByText('filter.sortAuthor').closest('button')).toHaveClass(
      'bg-AntiFlashWhite',
    );
  });

  it('collapses and expands the sort options', () => {
    render(
      <Wrapper>
        <FilterBySort />
      </Wrapper>,
    );

    expect(screen.getByText('filter.sortTitle')).toBeInTheDocument();

    fireEvent.click(screen.getByText('filter.sortBy').closest('button')!);
    expect(screen.queryByText('filter.sortTitle')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('filter.sortBy').closest('button')!);
    expect(screen.getByText('filter.sortTitle')).toBeInTheDocument();
  });
});
