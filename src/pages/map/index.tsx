import { useEffect, useState } from 'react';
import { useGetAllBooksQuery } from '../../redux/feature/book/bookApi';
import { useAppSelector } from '../../redux/hooks';
import MapContainer from './_components/MapContainer';
import MapSearchAndFilterBooks from './_components/MapSearchAndFilterBooks';
import { useGeolocation } from './hooks/useGeolocation';
import { IBookWithLocation } from './types/interface';

export default function Map() {
  const { latitude, longitude } = useGeolocation();
  const [booksWithLocation, setBooksWithLocation] = useState<IBookWithLocation[]>([]);
  const { filter } = useAppSelector((state) => state.filter);
  const {
    userInformation: { id },
  } = useAppSelector((state) => state.auth);

  const { data, isLoading, isError } = useGetAllBooksQuery(
    {
      filter,
      notOwnerId: id,
      latitude: latitude ?? undefined,
      longitude: longitude ?? undefined,
    },
    {
      skip: !latitude || !longitude,
      refetchOnMountOrArgChange: true,
    },
  );

  useEffect(() => {
    if (data?._embedded?.books) {
      const normalizedBooks: IBookWithLocation[] = data._embedded.books
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((book: any) => book.location?.latitude != null && book.location?.longitude != null)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((book: any) => {
          console.log(book);
          return {
            ...book,
            latitude: book.location.latitude,
            longitude: book.location.longitude,
            address: book.location.address,
            city: book.location.city,
            country: book.location.country,
            createdAt: book.offeredAgo,
          };
        });

      setBooksWithLocation(normalizedBooks);
    } else {
      setBooksWithLocation([]);
    }
  }, [data]);

  if (isError) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-red-600">Error loading map data</p>
      </div>
    );
  }
  if (!latitude || !longitude) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Detecting your location...</p>
        </div>
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
            <MapContainer books={booksWithLocation} />
            {booksWithLocation.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white  font-poppins text-base h-[calc(100vh-70px)]">
                <p>No books found with location data</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
