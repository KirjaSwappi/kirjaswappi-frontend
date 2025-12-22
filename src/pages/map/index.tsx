/* eslint-disable @typescript-eslint/no-explicit-any */
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useState } from 'react';
import { useGetAllBooksQuery } from '../../redux/feature/book/bookApi';
import { useAppSelector } from '../../redux/hooks';
import MapContainer from './_components/MapContainer';
import MapSearchAndFilterBooks from './_components/MapSearchAndFilterBooks';
import { useGeolocation } from './hooks/useGeolocation';
import { IBookWithLocation } from './types/interface';

export default function Map() {
  const { coords, permissionChecked } = useGeolocation();
  const { latitude, longitude } = coords;

  const [booksWithLocation, setBooksWithLocation] = useState<IBookWithLocation[]>([]);

  const { filter } = useAppSelector((state) => state.filter);
  const {
    userInformation: { id },
  } = useAppSelector((state) => state.auth);

  const queryArgs =
    permissionChecked && latitude != null && longitude != null
      ? {
          filter,
          notOwnerId: id,
          latitude,
          longitude,
        }
      : skipToken;

  const { data, isLoading, isError } = useGetAllBooksQuery(queryArgs, {
    refetchOnMountOrArgChange: false,
  });

  useEffect(() => {
    if (data?._embedded?.books) {
      const normalized: IBookWithLocation[] = data._embedded.books
        .filter((b: any) => b.location?.latitude && b.location?.longitude)
        .map((b: any) => ({
          ...b,
          latitude: b.location.latitude,
          longitude: b.location.longitude,
          address: b.location.address,
          city: b.location.city,
          country: b.location.country,
          createdAt: b.offeredAgo,
        }));

      setBooksWithLocation(normalized);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Detecting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <MapSearchAndFilterBooks />

      {isLoading ? (
        <div className="h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      ) : (
        <MapContainer books={booksWithLocation} />
      )}
    </div>
  );
}
