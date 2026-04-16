/* eslint-disable @typescript-eslint/no-explicit-any */
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorState from '../../components/shared/ErrorState';
import Spinner from '../../components/shared/Spinner';
import { useGetAllBooksQuery } from '../../redux/feature/book/bookApi';
import { useAppSelector } from '../../redux/hooks';
import MapContainer from './_components/MapContainer';
import MapSearchAndFilterBooks from './_components/MapSearchAndFilterBooks';
import { useGeolocation } from './hooks/useGeolocation';
import { IBookWithLocation } from './types/interface';

export default function Map() {
  const { t } = useTranslation();
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
    return <ErrorState message={t('map.errorLoading')} onRetry={() => window.location.reload()} />;
  }

  if (!latitude || !longitude) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Spinner />
          <p className="text-grayDark font-poppins text-sm mt-4">{t('map.detectingLocation')}</p>
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
            <Spinner />
            <p className="text-grayDark font-poppins text-sm mt-4">{t('map.loadingMap')}</p>
          </div>
        </div>
      ) : (
        <MapContainer books={booksWithLocation} userCoords={coords} />
      )}
    </div>
  );
}
