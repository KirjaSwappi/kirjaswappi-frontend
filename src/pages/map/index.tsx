import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/shared/Button';
import { useGetAllBooksQuery } from '../../redux/feature/book/bookApi';
import { useAppSelector } from '../../redux/hooks';
import { IBook } from '../books/interface';
import MapContainer from './_components/MapContainer';
import MapSearchAndFilterBooks from './_components/MapSearchAndFilterBooks';
import { useGeolocation } from './hooks/useGeolocation';
import { IBookWithLocation } from './interface';

const getRandomInRange = (base: number, range: number) => base + (Math.random() - 0.5) * range;

const getRandomDateWithinDays = (days: number) =>
  new Date(Date.now() - Math.random() * days * 24 * 60 * 60 * 1000);

export const addLocationToBooks = (books: IBook[]): IBookWithLocation[] => {
  return books.map((book, index) => ({
    ...book,
    latitude: getRandomInRange(60.1699, 0.1),
    longitude: getRandomInRange(24.9384, 0.1),
    address: `Address ${index + 1}, Helsinki, Finland`,
    city: 'Helsinki',
    country: 'Finland',
    createdAt: getRandomDateWithinDays(7).toISOString(),
  }));
};

export default function Map() {
  useGeolocation();
  const navigate = useNavigate();
  const [booksWithLocation, setBooksWithLocation] = useState<IBookWithLocation[]>([]);
  const { filter } = useAppSelector((state) => state.filter);
  const {
    userInformation: { id },
  } = useAppSelector((state) => state.auth);

  const { data, isLoading, isError } = useGetAllBooksQuery(
    { filter, notOwnerId: id },
    { refetchOnMountOrArgChange: false },
  );

  useEffect(() => {
    if (data?._embedded?.books) {
      const booksWithLoc = addLocationToBooks(data._embedded.books);
      setBooksWithLocation(booksWithLoc);
    } else {
      setBooksWithLocation([]);
    }
  }, [data]);

  const handleMarkerClick = (bookId: string) => navigate(`/book-details/${bookId}`);

  if (isError) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-red-600">Error loading map data</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen lg:min-h-[calc(100vh-80px)] relative">
      <MapSearchAndFilterBooks />
      <div className="flex-1">
        {isLoading ? (
          <div className="h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        ) : (
          <div className="h-full w-full relative">
            <MapContainer books={booksWithLocation} onMarkerClick={handleMarkerClick} />
            {booksWithLocation.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white z-[999999] font-poppins text-base">
                <p>No books found with location data</p>
              </div>
            )}
          </div>
        )}

        <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
          <Button className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
            <svg
              className="w-5 h-5 text-gray"
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
          </Button>
          <Button className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </Button>
          <Button className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
            <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06z" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
