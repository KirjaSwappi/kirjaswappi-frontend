import 'leaflet/dist/leaflet.css';
import { Circle, MapContainer as LeafletMapContainer, Marker, TileLayer } from 'react-leaflet';
import { useGeolocation } from '../hooks/useGeolocation';
import { IBookWithLocation } from '../types/interface';
import BookMarker from './BookMarker';
import { userLocationIcon } from '../../../hooks/userLocationIcon';

interface MapContainerProps {
  books: IBookWithLocation[];
}

export default function MapContainer({ books }: MapContainerProps) {
  const { coords } = useGeolocation();
  const { latitude, longitude, accuracy } = coords;

  if (latitude == null || longitude == null) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <p>Loading map...</p>
      </div>
    );
  }

  const groupedBooks = books.reduce(
    (acc, book) => {
      const key = `${book.latitude.toFixed(4)}_${book.longitude.toFixed(4)}`;
      if (!acc[key]) {
        acc[key] = {
          latitude: book.latitude,
          longitude: book.longitude,
          books: [],
        };
      }
      acc[key].books.push(book);
      return acc;
    },
    {} as Record<string, { latitude: number; longitude: number; books: IBookWithLocation[] }>,
  );

  return (
    <LeafletMapContainer
      center={[latitude, longitude]}
      zoom={16}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[latitude, longitude]} icon={userLocationIcon} />

      {accuracy && (
        <Circle
          center={[latitude, longitude]}
          radius={accuracy}
          pathOptions={{
            fillColor: '#3b82f6',
            fillOpacity: 0.15,
            color: '#3b82f6',
          }}
        />
      )}

      {/* 📚 BOOK MARKERS */}
      {Object.values(groupedBooks).map((marker, index) => (
        <BookMarker
          key={`${marker.latitude}_${marker.longitude}_${index}`}
          books={marker.books}
          position={[marker.latitude, marker.longitude]}
        />
      ))}
    </LeafletMapContainer>
  );
}
