import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import FilterByGenre from '../../../../components/Header/_components/BookFilter/FilterByGenre';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../../redux/feature/genre/genreApi', () => ({
  useGetGenreQuery: vi.fn(() => ({
    data: {
      parentGenres: [
        {
          id: 'p1',
          name: 'Fiction',
          childGenres: [
            { id: 'c1', name: 'Fantasy' },
            { id: 'c2', name: 'Sci-Fi' },
          ],
        },
        {
          id: 'p2',
          name: 'Non-Fiction',
          childGenres: [{ id: 'c3', name: 'Biography' }],
        },
        {
          id: 'p3',
          name: 'Thriller',
          childGenres: [],
        },
      ],
    },
    isLoading: false,
  })),
}));

vi.mock('../../../../components/Header/_components/BookFilter/genreIcons', () => {
  const MockIcon = (props: Record<string, unknown>) => <span data-testid="genre-icon" {...props} />;
  return {
    getGenreIcon: () => MockIcon,
    defaultGenreIcon: MockIcon,
  };
});

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
  default: ({ alt, style }: { alt: string; style?: React.CSSProperties }) => (
    <img alt={alt} style={style} />
  ),
}));

vi.mock('../../../../components/Header/_components/BookFilter/GenreSkelton', () => ({
  default: () => <div data-testid="genre-skeleton" />,
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm({ defaultValues: { genre: [] } });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('FilterByGenre', () => {
  it('renders Genre label', () => {
    render(
      <Wrapper>
        <FilterByGenre />
      </Wrapper>,
    );

    expect(screen.getByText('editProfile.genre')).toBeInTheDocument();
  });

  it('renders parent genre names', () => {
    render(
      <Wrapper>
        <FilterByGenre />
      </Wrapper>,
    );

    expect(screen.getByText('Fiction')).toBeInTheDocument();
    expect(screen.getByText('Non-Fiction')).toBeInTheDocument();
  });

  it('shows child genres when parent is expanded', () => {
    render(
      <Wrapper>
        <FilterByGenre />
      </Wrapper>,
    );

    fireEvent.click(screen.getByText('Fiction').closest('button')!);
    expect(screen.getByText('Fantasy')).toBeInTheDocument();
    expect(screen.getByText('Sci-Fi')).toBeInTheDocument();
  });

  it('hides child genres when parent is collapsed', () => {
    render(
      <Wrapper>
        <FilterByGenre />
      </Wrapper>,
    );

    fireEvent.click(screen.getByText('Fiction').closest('button')!);
    expect(screen.getByText('Fantasy')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Fiction').closest('button')!);
    expect(screen.queryByText('Fantasy')).not.toBeInTheDocument();
  });

  it('selects a child genre on click', () => {
    render(
      <Wrapper>
        <FilterByGenre />
      </Wrapper>,
    );

    fireEvent.click(screen.getByText('Fiction').closest('button')!);
    fireEvent.click(screen.getByText('Fantasy').closest('button')!);
    expect(screen.getByText('Fantasy').closest('button')).toHaveClass('bg-AntiFlashWhite');
  });

  it('directly selects a parent genre without children', () => {
    render(
      <Wrapper>
        <FilterByGenre />
      </Wrapper>,
    );

    const thrillerButton = screen.getByText('Thriller').closest('button')!;
    fireEvent.click(thrillerButton);
    expect(thrillerButton).toHaveClass('bg-AntiFlashWhite');
  });
});
