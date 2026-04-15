import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../../assets/plus.png', () => ({ default: 'plus.png' }));
vi.mock('../../../../assets/tickmark.png', () => ({ default: 'tick.png' }));

vi.mock('../../../../components/shared/Button', () => ({
  default: ({
    children,
    onClick,
    className,
    type,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: string;
  }) => (
    <button onClick={onClick} className={className} type={type as 'button' | 'submit'}>
      {children}
    </button>
  ),
}));

vi.mock('../../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt || ''} />,
}));

vi.mock('../../../../components/shared/Line', () => ({
  default: () => <hr />,
}));

vi.mock('../../../../redux/feature/book/bookApi', () => ({
  useGetSupportLanguageQuery: () => ({
    data: ['English', 'Finnish', 'Swedish'],
    isLoading: false,
  }),
  useGetSupportConditionQuery: () => ({
    data: ['New', 'Like New', 'Used'],
    isLoading: false,
  }),
}));

vi.mock('../../../../redux/feature/genre/genreApi', () => ({
  useGetGenreQuery: () => ({
    data: {
      parentGenres: [
        {
          id: '1',
          name: 'Fiction',
          childGenres: [
            { id: 'c1', name: 'Fantasy' },
            { id: 'c2', name: 'Sci-Fi' },
          ],
        },
      ],
    },
    isLoading: false,
  }),
}));

vi.mock('../../../../components/Header/_components/BookFilter/genreIcons', () => {
  const MockIcon = (props: Record<string, unknown>) => <span data-testid="genre-icon" {...props} />;
  return {
    getGenreIcon: () => MockIcon,
    defaultGenreIcon: MockIcon,
  };
});

vi.mock('../../../../components/Header/_components/BookFilter/GenreSkelton', () => ({
  default: () => <div data-testid="skeleton">...</div>,
}));

vi.mock('../../../../components/Header/types/interface', () => ({}));
vi.mock('react-icons/io', () => ({
  IoIosArrowDown: () => <span>down</span>,
  IoIosArrowUp: () => <span>up</span>,
}));

vi.mock('react-icons/lu', () => ({
  LuArrowUpAZ: () => <span>asc</span>,
  LuArrowDownAZ: () => <span>desc</span>,
}));

vi.mock('../../../../redux/hooks', () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: () => 'asc',
}));

import FilterByLanguage from '../../../../components/Header/_components/BookFilter/FilterByLanguage';
import FilterByCondition from '../../../../components/Header/_components/BookFilter/FilterByCondition';
import FilterBySort from '../../../../components/Header/_components/BookFilter/FilterBySort';
import FilterByGenre from '../../../../components/Header/_components/BookFilter/FilterByGenre';

function Wrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm({
    defaultValues: { genre: [], language: [], condition: [], sortBy: [] },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('FilterByLanguage', () => {
  it('renders language options', () => {
    render(
      <Wrapper>
        <FilterByLanguage />
      </Wrapper>,
    );
    expect(screen.getByText('filter.language')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Finnish')).toBeInTheDocument();
    expect(screen.getByText('Swedish')).toBeInTheDocument();
  });
});

describe('FilterByCondition', () => {
  it('renders condition options', () => {
    render(
      <Wrapper>
        <FilterByCondition />
      </Wrapper>,
    );
    expect(screen.getByText('filter.swapCondition')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Like New')).toBeInTheDocument();
    expect(screen.getByText('Used')).toBeInTheDocument();
  });
});

describe('FilterBySort', () => {
  it('renders sort options', () => {
    render(
      <Wrapper>
        <FilterBySort />
      </Wrapper>,
    );
    expect(screen.getByText('filter.sortBy')).toBeInTheDocument();
    expect(screen.getByText('filter.sortTitle')).toBeInTheDocument();
    expect(screen.getByText('filter.sortAuthor')).toBeInTheDocument();
  });
});

describe('FilterByGenre', () => {
  it('renders genre label', () => {
    render(
      <Wrapper>
        <FilterByGenre />
      </Wrapper>,
    );
    expect(screen.getByText('editProfile.genre')).toBeInTheDocument();
    expect(screen.getByText('Fiction')).toBeInTheDocument();
  });
});
