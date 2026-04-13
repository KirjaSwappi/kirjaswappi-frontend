import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import FilterByLanguage from '../../../../components/Header/_components/BookFilter/FilterByLanguage';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../../redux/feature/book/bookApi', () => ({
  useGetSupportLanguageQuery: vi.fn(() => ({
    data: ['English', 'Finnish', 'Swedish'],
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
  const methods = useForm({ defaultValues: { language: [] } });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('FilterByLanguage', () => {
  it('renders Language label', () => {
    render(
      <Wrapper>
        <FilterByLanguage />
      </Wrapper>,
    );

    expect(screen.getByText('filter.language')).toBeInTheDocument();
  });

  it('renders all language options', () => {
    render(
      <Wrapper>
        <FilterByLanguage />
      </Wrapper>,
    );

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Finnish')).toBeInTheDocument();
    expect(screen.getByText('Swedish')).toBeInTheDocument();
  });

  it('selects a language on click', () => {
    render(
      <Wrapper>
        <FilterByLanguage />
      </Wrapper>,
    );

    fireEvent.click(screen.getByText('Finnish').closest('button')!);
    expect(screen.getByText('Finnish').closest('button')).toHaveClass('bg-AntiFlashWhite');
  });

  it('collapses options when toggle is clicked', () => {
    render(
      <Wrapper>
        <FilterByLanguage />
      </Wrapper>,
    );

    fireEvent.click(screen.getByText('filter.language').closest('button')!);
    expect(screen.queryByText('English')).not.toBeInTheDocument();
  });
});
