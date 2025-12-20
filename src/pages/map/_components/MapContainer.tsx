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
import { useGeolocation } from '../hooks/useGeolocation';
import { IBookWithLocation } from '../types/interface';
import BookMarker from './BookMarker';
import MapControls from './MapControls';

interface MapContainerProps {
  books: IBookWithLocation[];
}

export default function MapContainer({ books }: MapContainerProps) {
  const { coords, permissionChecked } = useGeolocation();
  const { latitude, longitude } = coords;

  // ✅ Nearest book calculation
  const nearestBook = useMemo(() => {
    if (!latitude || !longitude || books.length === 0) return null;

    return books.reduce<IBookWithLocation | null>((closest, book) => {
      if (!closest) return book;

      const d1 = getDistanceInMeters(latitude, longitude, closest.latitude, closest.longitude);
      const d2 = getDistanceInMeters(latitude, longitude, book.latitude, book.longitude);

      return d2 < d1 ? book : closest;
    }, null);
  }, [books, latitude, longitude]);

  if (!permissionChecked || !latitude || !longitude) {
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

      {/* User location marker */}
      <Marker position={[latitude, longitude]} icon={userLocationIcon}>
        <Popup>You are here</Popup>
      </Marker>

      {/* All books */}
      {books.map((book) => (
        <BookMarker key={book.id} books={[book]} position={[book.latitude, book.longitude]} />
      ))}

      {/* Only nearest book: distance line */}
      {nearestBook && (
        <Polyline
          positions={[
            [latitude, longitude],
            [nearestBook.latitude, nearestBook.longitude],
          ]}
          pathOptions={{ color: 'blue', weight: 3, dashArray: '5,10' }}
        />
      )}

      {/* Bottom controls */}
      <MapControls latitude={latitude} longitude={longitude} />
    </LeafletMapContainer>
  );
}
