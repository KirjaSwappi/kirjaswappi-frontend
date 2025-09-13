import 'leaflet/dist/leaflet.css';
import { MapContainer as LeafletMapContainer, TileLayer } from 'react-leaflet';
import { useAppSelector } from '../../../redux/hooks';
import { IBookWithLocation } from '../interface';
import BookMarker from './BookMarker';

interface MapContainerProps {
  books: IBookWithLocation[];
  onMarkerClick: (bookId: string) => void;
}

export default function MapContainer({ books, onMarkerClick }: MapContainerProps) {
  const { center, zoom } = useAppSelector((state) => state.map);

  // Group books by location for clustering
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
        center={[center.latitude, center.longitude]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
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
            onMarkerClick={onMarkerClick}
          />
        ))}
      </LeafletMapContainer>
    </div>
  );
}
