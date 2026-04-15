import 'leaflet/dist/leaflet.css';
import { useMemo } from 'react';
import {
  MapContainer as LeafletMapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from 'react-leaflet';
import { userLocationIcon } from '../../../hooks/userLocationIcon';
import { getDistanceInMeters } from '../../../utility/distance';
import { IBookWithLocation } from '../types/interface';
import BookMarker from './BookMarker';
import MapControls from './MapControls';

interface MapContainerProps {
  books: IBookWithLocation[];
  userCoords: { latitude: number | null; longitude: number | null };
}

const normalize = (num: number, precision = 4) => Number(num.toFixed(precision));

export default function MapContainer({ books, userCoords }: MapContainerProps) {
  const { latitude, longitude } = userCoords;

  /* =========================
     GROUP BOOKS BY LOCATION
  ========================= */
  const groupedBooks = useMemo(() => {
    const map = new Map<
      string,
      { latitude: number; longitude: number; books: IBookWithLocation[] }
    >();

    books.forEach((book) => {
      const lat = normalize(book.latitude);
      const lng = normalize(book.longitude);
      const key = `${lat}_${lng}`;

      if (!map.has(key)) {
        map.set(key, {
          latitude: lat,
          longitude: lng,
          books: [],
        });
      }

      map.get(key)!.books.push(book);
    });

    return Array.from(map.values());
  }, [books]);

  /* =========================
     NEAREST BOOK
  ========================= */
  const nearestBook = useMemo(() => {
    if (!latitude || !longitude || books.length === 0) return null;

    return books.reduce<IBookWithLocation | null>((closest, book) => {
      if (!closest) return book;

      const d1 = getDistanceInMeters(latitude, longitude, closest.latitude, closest.longitude);
      const d2 = getDistanceInMeters(latitude, longitude, book.latitude, book.longitude);

      return d2 < d1 ? book : closest;
    }, null);
  }, [books, latitude, longitude]);

  if (!latitude || !longitude) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <p>Loading map…</p>
      </div>
    );
  }

  return (
    <LeafletMapContainer
      center={[latitude, longitude]}
      zoom={16}
      zoomControl={false}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* USER LOCATION */}
      <Marker position={[latitude, longitude]} icon={userLocationIcon}>
        <Popup>You are here</Popup>
      </Marker>

      {/* 📚 GROUPED BOOK MARKERS */}
      {groupedBooks.map((group, index) => (
        <BookMarker
          key={`${group.latitude}_${group.longitude}_${index}`}
          books={group.books}
          position={[group.latitude, group.longitude]}
        />
      ))}

      {/* 📍 NEAREST BOOK LINE */}
      {nearestBook && (
        <Polyline
          positions={[
            [latitude, longitude],
            [nearestBook.latitude, nearestBook.longitude],
          ]}
          pathOptions={{
            color: '#3879E9',
            weight: 3,
            dashArray: '5,10',
          }}
        />
      )}

      <MapControls latitude={latitude} longitude={longitude} />
    </LeafletMapContainer>
  );
}
