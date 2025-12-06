import 'leaflet/dist/leaflet.css';
import { MapContainer as LeafletMapContainer, TileLayer } from 'react-leaflet';
import { useGeolocation } from '../hooks/useGeolocation';
import { IBookWithLocation } from '../types/interface';
import BookMarker from './BookMarker';

interface MapContainerProps {
  books: IBookWithLocation[];
}

export default function MapContainer({ books }: MapContainerProps) {
  const { latitude, longitude } = useGeolocation();
  if (latitude == null || longitude == null) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
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

  const markers = Object.values(groupedBooks);
  return (
    <div className="h-full w-full">
      <LeafletMapContainer
        center={[latitude, longitude]}
        zoom={12}
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((marker, index) => (
          <BookMarker
            key={`${marker.latitude}_${marker.longitude}_${index}`}
            books={marker.books}
            position={[marker.latitude, marker.longitude]}
          />
        ))}
      </LeafletMapContainer>
    </div>
  );
}
