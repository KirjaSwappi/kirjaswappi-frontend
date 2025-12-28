import { useCallback, useEffect, useRef, useState } from 'react';
import BookCard from '../../components/shared/BookCard';
import BookSkeleton from '../../components/shared/skeleton/BookSkeleton';
import { useGetAllBooksQuery } from '../../redux/feature/book/bookApi';
import { clearAllFilters, setPageNumber } from '../../redux/feature/filter/filterSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { goToTop } from '../../utility/helper';
import Filter from './_components/Filter';
import HeroSection from './_components/Herosection';
import NoBooksAvailable from './_components/NoBooksAvailable';
import { IBook } from './types/interface';

export default function Books() {
  const observer = useRef<IntersectionObserver>();
  const [books, setBooks] = useState<IBook[]>([]);
  const { filter } = useAppSelector((state) => state.filter);
  const {
    userInformation: { id },
  } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // Fetch books
  const { data, isError, isLoading, isFetching } = useGetAllBooksQuery(
    { filter, notOwnerId: id },
    { refetchOnMountOrArgChange: false },
  );

  // Merge & paginate data
  useEffect(() => {
    if (data?._embedded?.books?.length > 0) {
      setBooks((prevBooks) => {
        const newBooks = data._embedded.books;
        const allBooks = filter.pageNumber === 0 ? newBooks : [...prevBooks, ...newBooks];
        const uniqueBooks = Array.from(
          new Map<string, IBook>(allBooks.map((book: IBook) => [book.id, book])).values(),
        );
        return uniqueBooks;
      });
      return;
    }

    // If no books returned for first page, reset state
    if (data && (!data._embedded?.books || data._embedded.books.length === 0)) {
      if (filter.pageNumber === 0) setBooks([]);
    }
  }, [data, filter.pageNumber]);

  // Infinite scroll: detect filter changes
  const prevFilterRef = useRef({
    search: filter.search,
    genre: filter.genre.join(','),
    condition: filter.condition.join(','),
    language: filter.language.join(','),
    city: filter.city,
  });

  useEffect(() => {
    const currentFilter = {
      search: filter.search,
      genre: filter.genre.join(','),
      condition: filter.condition.join(','),
      language: filter.language.join(','),
      city: filter.city,
    };

    const prevFilter = prevFilterRef.current;

    const isFilterChanged =
      prevFilter.search !== currentFilter.search ||
      prevFilter.genre !== currentFilter.genre ||
      prevFilter.condition !== currentFilter.condition ||
      prevFilter.language !== currentFilter.language ||
      prevFilter.city !== currentFilter.city;

    if (isFilterChanged) {
      goToTop();
      dispatch(setPageNumber(0));
      prevFilterRef.current = currentFilter;
    }
  }, [filter.search, filter.genre, filter.condition, filter.language, filter.city, dispatch]);

  // Reset search & page when leaving the page
  useEffect(() => {
    return () => {
      dispatch(setPageNumber(0));
      dispatch(clearAllFilters());
    };
  }, [dispatch]);

  // Intersection Observer for infinite scroll
  const lastBookRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetching) return;

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          data != null &&
          filter.pageNumber + 1 < data.page.totalPages
        ) {
          dispatch(setPageNumber(filter.pageNumber + 1));
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetching, data, filter.pageNumber, dispatch],
  );

  const isInitialLoading = isFetching || isLoading;

  if (isError) return <p>Something went wrong</p>;

  return (
    <section>
      <div className="container min-h-[80vh] pb-24 lg:py-6">
        <HeroSection />
        <div className="relative hidden lg:block">
          <Filter />
        </div>

        {books.length === 0 && !isInitialLoading ? (
          <NoBooksAvailable />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 lg:gap-3 xl:gap-6 mt-4 lg:mt-0">
            {books.map((book: IBook, idx: number) => {
              if (idx === books.length - 1) {
                return (
                  <div ref={lastBookRef} key={idx}>
                    <BookCard book={book} hasPermission={id === book.ownerId} />
                  </div>
                );
              }
              return <BookCard book={book} key={idx} hasPermission={id === book.ownerId} />;
            })}
            {isInitialLoading &&
              Array.from({ length: 6 }, (_, index) => <BookSkeleton key={index} />)}
          </div>
        )}
      </div>
    </section>
  );
}
