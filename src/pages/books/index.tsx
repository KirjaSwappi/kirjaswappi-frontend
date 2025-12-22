import { useCallback, useEffect, useRef, useState } from 'react';
import NotFound from '../../assets/notFound.png';
import BookCard from '../../components/shared/BookCard';
import Image from '../../components/shared/Image';
import BookSkeleton from '../../components/shared/skeleton/BookSkeleton';
import { useGetAllBooksQuery } from '../../redux/feature/book/bookApi';
import { setPageNumber } from '../../redux/feature/filter/filterSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { goToTop } from '../../utility/helper';
import Filter from './_components/Filter';
import HeroSection from './_components/Herosection';
import { IBook } from './types/interface';
export default function Books() {
  const observer = useRef<IntersectionObserver>();
  const [books, setBooks] = useState<IBook[]>([]);
  const { filter } = useAppSelector((state) => state.filter);
  const {
    userInformation: { id },
  } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const { data, isError, isLoading, isFetching } = useGetAllBooksQuery(
    { filter, notOwnerId: id },

    {
      refetchOnMountOrArgChange: false,
    },
  );

  console.log(data);

  // <=======Fetch data store in state=======>
  useEffect(() => {
    // If API returned books, merge/paginate them into state
    if (data?._embedded?.books && data._embedded.books.length > 0) {
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

    // If API responded but there are no books (no _embedded key or empty array),
    // reset the books state when we're on the first page so UI shows the empty state.
    if (data && (!data._embedded || !data._embedded.books || data._embedded.books.length === 0)) {
      if (filter.pageNumber === 0) {
        setBooks([]);
      }
    }
  }, [data, filter.pageNumber]);

  // <======= Reset page number =======>
  useEffect(() => {
    goToTop();
    dispatch(setPageNumber(0));
  }, [
    filter.search,
    filter.genre.join(','),
    filter.condition.join(','),
    filter.language.join(','),
    filter.city,
  ]);

  // <======= Intersection observe =======>
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
    [isLoading, data, filter.pageNumber],
  );
  const isInitialLoading = isFetching || isLoading;

  if (isError) return <p>Something went wrong</p>;
  return (
    <section>
      <div className="container min-h-[80vh] pb-24 lg:py-6">
        <div>
          <HeroSection />
        </div>
        <div className="relative hidden lg:block">
          <Filter />
        </div>
        {books.length === 0 && !isInitialLoading ? (
          <div className="flex flex-col items-center justify-center mt-6">
            <div className="bg-white w-full rounded-lg p-6 flex  min-h-[50vh] justify-center flex-col items-center">
              <h3 className="text-xl lg:text-2xl font-semibold mb-2 font-poppins text-[#262626]">
                No books available
              </h3>
              <p className="text-sm text-[#262626] mb-4 font-poppins text-center">
                We couldn&apos;t find any books matching your filters.
              </p>
              <Image src={NotFound} alt="not found" className="w-28 lg:w-40" />
            </div>
          </div>
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
