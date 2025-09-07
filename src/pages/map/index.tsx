import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useGetAllBooksQuery } from '../../redux/feature/book/bookApi';
import {
  setConditionFilter,
  setGenreFilter,
  setLanguageFilter,
} from '../../redux/feature/filter/filterSlice';
import { IFilterData } from '../../interface';
import { IBookWithLocation } from './interface';
import { useGeolocation } from './hooks/useGeolocation';
import MapContainer from './_components/MapContainer';
import BookFilter from '../../components/Header/_components/BookFilter';
import SearchBar from '../../components/shared/SearchBar';
import './map.css';

// Mock function to add location data to books
const addLocationToBooks = (
  books: { id: string; title: string; author: string; [key: string]: unknown }[],
): IBookWithLocation[] => {
  return books.map((book, index) => ({
    ...book,
    latitude: 60.1699 + (Math.random() - 0.5) * 0.1, // Random locations around Helsinki
    longitude: 24.9384 + (Math.random() - 0.5) * 0.1,
    address: `Address ${index + 1}, Helsinki, Finland`,
    city: 'Helsinki',
    country: 'Finland',
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last week
  })) as IBookWithLocation[];
};

export default function Map() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.filter);
  const {
    userInformation: { id },
  } = useAppSelector((state) => state.auth);

  const [booksWithLocation, setBooksWithLocation] = useState<IBookWithLocation[]>([]);
  const [query, setQuery] = useState<string>('');

  // Initialize geolocation
  useGeolocation();

  // Form for filters
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      genre: [],
      language: [],
      condition: [],
    },
  });

  const { handleSubmit } = methods;

  // Fetch books data
  const { data, isLoading, isError } = useGetAllBooksQuery(
    { filter, notOwnerId: id },
    { refetchOnMountOrArgChange: false },
  );

  // Transform books data to include location
  useEffect(() => {
    if (data?._embedded?.books) {
      const booksWithLoc = addLocationToBooks(data._embedded.books);
      setBooksWithLocation(booksWithLoc);
    }
  }, [data]);

  const handleSubmitFn = async <T extends IFilterData>(data: T) => {
    dispatch(setGenreFilter(data.genre));
    dispatch(setConditionFilter(data.condition));
    dispatch(setLanguageFilter(data.language));
  };

  const handleMarkerClick = (bookId: string) => {
    navigate(`/book-details/${bookId}`);
  };

  if (isError) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-red-600">Error loading map data</p>
      </div>
    );
  }

  // Debug logging
  console.log('Map component rendering:', {
    isLoading,
    isError,
    booksCount: booksWithLocation.length,
  });

  return (
    <div className="flex min-h-screen">
      {/* Desktop Filter Sidebar - Exactly as shown in Figma */}
      <div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-full">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit((data) => handleSubmitFn(data))}>
            <BookFilter />
          </form>
        </FormProvider>
      </div>

      {/* Map Container - Full height as shown in Figma */}
      <div className="flex-1 relative" style={{ height: 'calc(100vh - 80px)' }}>
        {/* Search bar using existing SearchBar component */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg px-4">
          <SearchBar query={query} setQuery={setQuery} />
        </div>

        {/* Map fills entire remaining space */}
        {isLoading ? (
          <div className="h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        ) : (
          <div className="h-full w-full">
            <MapContainer books={booksWithLocation} onMarkerClick={handleMarkerClick} />
            {booksWithLocation.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                <p>No books found with location data</p>
              </div>
            )}
          </div>
        )}

        {/* Map controls positioned exactly as in Figma */}
        <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
          <button className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
          <button className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
