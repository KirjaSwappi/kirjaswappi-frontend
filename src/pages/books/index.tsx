import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BookCard from '../../components/shared/BookCard';
import BookSkeleton from '../../components/shared/skeleton/BookSkeleton';
import PageTitle from '../../components/shared/PageTitle';
import {
  useGetAllBooksQuery,
  useGetBooksNearLocationQuery,
} from '../../redux/feature/book/bookApi';
import {
  clearAllFilters,
  setFilterOpen,
  setIsCategoryOrFilterOrSortBy,
  setPageNumber,
} from '../../redux/feature/filter/filterSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { FilterItemEnum } from '../../utility/enum';
import Filter from './_components/Filter';
import HeroSection from './_components/Herosection';
import NoBooksAvailable from './_components/NoBooksAvailable';
import { IBook } from './types/interface';

export default function Books() {
  const { t } = useTranslation();
  const observer = useRef<IntersectionObserver>();
  const [books, setBooks] = useState<IBook[]>([]);
  const { filter } = useAppSelector((state) => state.filter);
  const {
    userInformation: { id },
  } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // =========== NEAR ME STATE ===========
  const [nearMe, setNearMe] = useState(false);
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(
    null,
  );

  const handleNearMe = () => {
    if (nearMe) {
      setNearMe(false);
      setUserCoords(null);
      dispatch(setPageNumber(0));
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setNearMe(true);
          dispatch(setPageNumber(0));
        },
        () => {
          setNearMe(false);
        },
      );
    }
  };

  // Fetch books
  const { data, isError, isLoading, isFetching } = useGetAllBooksQuery(
    { filter, notOwnerId: id },
    { refetchOnMountOrArgChange: false, skip: nearMe },
  );

  const {
    data: nearData,
    isError: nearError,
    isLoading: nearLoading,
    isFetching: nearFetching,
  } = useGetBooksNearLocationQuery(
    {
      latitude: userCoords?.latitude ?? 0,
      longitude: userCoords?.longitude ?? 0,
      page: filter.pageNumber,
    },
    { skip: !nearMe || !userCoords },
  );

  const activeData = nearMe ? nearData : data;
  const activeIsError = nearMe ? nearError : isError;
  const activeIsFetching = nearMe ? nearFetching : isFetching;
  const activeIsLoading = nearMe ? nearLoading : isLoading;

  // Merge & paginate data
  useEffect(() => {
    if (activeData?._embedded?.books?.length > 0) {
      setBooks((prevBooks) => {
        const newBooks = activeData._embedded.books;
        const allBooks = filter.pageNumber === 0 ? newBooks : [...prevBooks, ...newBooks];
        const uniqueBooks = Array.from(
          new Map<string, IBook>(allBooks.map((book: IBook) => [book.id, book])).values(),
        );
        return uniqueBooks;
      });
      return;
    }

    // If no books returned for first page, reset state
    if (activeData && (!activeData._embedded?.books || activeData._embedded.books.length === 0)) {
      if (filter.pageNumber === 0) setBooks([]);
    }
  }, [activeData, filter.pageNumber]);

  // Infinite scroll: detect filter changes
  const prevFilterRef = useRef({
    search: filter.search,
    genre: filter.genre.join(','),
    condition: filter.condition.join(','),
    language: filter.language.join(','),
    city: filter.city,
    sortBy: filter.sortBy.join(','),
  });

  useEffect(() => {
    const currentFilter = {
      search: filter.search,
      genre: filter.genre.join(','),
      condition: filter.condition.join(','),
      language: filter.language.join(','),
      city: filter.city,
      sortBy: filter.sortBy.join(','),
    };

    const prevFilter = prevFilterRef.current;

    const isFilterChanged =
      prevFilter.search !== currentFilter.search ||
      prevFilter.genre !== currentFilter.genre ||
      prevFilter.condition !== currentFilter.condition ||
      prevFilter.language !== currentFilter.language ||
      prevFilter.city !== currentFilter.city ||
      prevFilter.sortBy !== currentFilter.sortBy;

    if (isFilterChanged) {
      // goToTop();
      dispatch(setPageNumber(0));
      prevFilterRef.current = currentFilter;
    }
  }, [
    filter.search,
    filter.genre,
    filter.condition,
    filter.language,
    filter.city,
    filter.sortBy,
    dispatch,
  ]);

  useEffect(() => {
    return () => {
      dispatch(setPageNumber(0));
      dispatch(clearAllFilters());
      setNearMe(false);
      setUserCoords(null);
    };
  }, [dispatch]);

  // Intersection Observer for infinite scroll
  const lastBookRef = useCallback(
    (node: HTMLDivElement) => {
      if (activeIsFetching) return;

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          activeData != null &&
          filter.pageNumber + 1 < activeData.page.totalPages
        ) {
          dispatch(setPageNumber(filter.pageNumber + 1));
        }
      });
      if (node) observer.current.observe(node);
    },
    [activeIsFetching, activeData, filter.pageNumber, dispatch],
  );

  const isInitialLoading = activeIsFetching || activeIsLoading;

  if (activeIsError)
    return (
      <div className="container min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="font-poppins text-grayDark text-sm mb-4">{t('books.errorMessage')}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="font-poppins text-sm text-white bg-primary px-4 py-2 rounded-lg cursor-pointer"
          >
            {t('books.tryAgain')}
          </button>
        </div>
      </div>
    );

  return (
    <section>
      <PageTitle title={t('books')} />
      <div className="container min-h-[80vh] pb-24 lg:py-6">
        <HeroSection />
        <div className="flex items-center gap-2 mb-4 lg:hidden">
          <button
            type="button"
            onClick={handleNearMe}
            className={`flex-1 border flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-poppins text-xs font-medium ${
              nearMe
                ? 'bg-primary text-white border-primary'
                : 'border-platinum bg-white text-blackOlive'
            }`}
          >
            {t('books.nearMe')}
          </button>
          <button
            type="button"
            onClick={() => {
              dispatch(setIsCategoryOrFilterOrSortBy(FilterItemEnum.FILTER));
              dispatch(setFilterOpen(true));
            }}
            className="flex-1 border border-platinum bg-white flex items-center justify-center gap-2 text-blackOlive px-3 py-2 rounded-lg font-poppins text-xs font-medium"
          >
            {t('books.filter')}
          </button>
          <button
            type="button"
            onClick={() => {
              dispatch(setIsCategoryOrFilterOrSortBy(FilterItemEnum.SORTBY));
              dispatch(setFilterOpen(true));
            }}
            className="flex-1 border border-platinum bg-white flex items-center justify-center gap-2 text-blackOlive px-3 py-2 rounded-lg font-poppins text-xs font-medium"
          >
            {t('books.sort')}
          </button>
          <button
            type="button"
            onClick={() => {
              dispatch(setIsCategoryOrFilterOrSortBy(FilterItemEnum.CATEGORY));
              dispatch(setFilterOpen(true));
            }}
            className="flex-1 border border-platinum bg-white flex items-center justify-center gap-2 text-blackOlive px-3 py-2 rounded-lg font-poppins text-xs font-medium"
          >
            {t('books.category')}
          </button>
        </div>
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
