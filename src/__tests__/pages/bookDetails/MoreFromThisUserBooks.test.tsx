import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import MoreFromThisUserBooks from '../../../pages/bookDetails/_components/MoreFromThisUserBooks';
import { setupTestStore } from '../../utils/test-utils';
import { useGetMoreBooksByBookIdQuery } from '../../../redux/feature/book/bookApi';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../redux/hooks', () => ({
  useAppSelector: vi.fn((selector) => selector({ auth: { userInformation: { id: 'user-1' } } })),
}));

vi.mock('../../../redux/feature/book/bookApi', () => ({
  useGetMoreBooksByBookIdQuery: vi.fn(() => ({
    data: [
      {
        id: 'b1',
        title: 'More Book 1',
        author: 'Author 1',
        genres: [],
        language: 'English',
        description: '',
        condition: 'Good',
        coverPhotoUrl: 'url1',
        ownerId: 'user-1',
        owner: { id: 'user-1', name: 'Owner' },
      },
    ],
    isFetching: false,
    isLoading: false,
  })),
}));

vi.mock('../../../components/shared/BookCard', () => ({
  default: ({ book }: { book: { title: string } }) => (
    <div data-testid="book-card">{book.title}</div>
  ),
}));

vi.mock('../../../components/shared/skeleton/BookSkeleton', () => ({
  default: () => <div data-testid="book-skeleton" />,
}));

vi.mock('../../../components/shared/Button', () => ({
  default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <button className={className}>{children}</button>
  ),
}));

describe('MoreFromThisUserBooks', () => {
  const renderComponent = (bookId?: string) => {
    const store = setupTestStore();
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <MoreFromThisUserBooks bookId={bookId} />
        </MemoryRouter>
      </Provider>,
    );
  };

  it('returns null when bookId is undefined', () => {
    const { container } = renderComponent(undefined);
    expect(container.firstChild).toBeNull();
  });

  it('renders section heading', () => {
    renderComponent('book-1');
    expect(screen.getByText('bookDetails.moreFromThisUser')).toBeInTheDocument();
  });

  it('renders See all button', () => {
    renderComponent('book-1');
    expect(screen.getByText('bookDetails.seeAll')).toBeInTheDocument();
  });

  it('renders book cards from the query data', () => {
    renderComponent('book-1');
    expect(screen.getByText('More Book 1')).toBeInTheDocument();
  });

  it('shows skeletons when loading', () => {
    vi.mocked(useGetMoreBooksByBookIdQuery).mockReturnValueOnce({
      data: undefined,
      isFetching: true,
      isLoading: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    renderComponent('book-1');
    const skeletons = screen.getAllByTestId('book-skeleton');
    expect(skeletons).toHaveLength(6);
  });
});
