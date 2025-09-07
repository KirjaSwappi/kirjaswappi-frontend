import { Marker, Popup } from 'react-leaflet';
import { Icon, divIcon } from 'leaflet';
import { IBookWithLocation } from '../interface';
import BookPopup from './BookPopup';

interface BookMarkerProps {
  books: IBookWithLocation[];
  position: [number, number];
  onMarkerClick: (bookId: string) => void;
}

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as { _getIconUrl?: () => void })._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function BookMarker({ books, position, onMarkerClick }: BookMarkerProps) {
  const isCluster = books.length > 1;

  // Create custom marker icon for clusters
  const createClusterIcon = (count: number) => {
    const size = count > 10 ? 50 : count > 5 ? 45 : 40;
    return divIcon({
      html: `
        <div style="
          background: #3879E9;
          border: 3px solid white;
          border-radius: 50%;
          width: ${size}px;
          height: ${size}px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${count > 10 ? '16px' : '14px'};
          box-shadow: 0 4px 12px rgba(56, 121, 233, 0.4);
          font-family: 'Poppins', sans-serif;
        ">
          ${count}
        </div>
      `,
      className: 'custom-cluster-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  // Create user avatar marker for single book
  const createUserIcon = (book: IBookWithLocation) => {
    const initial = book.ownerName?.charAt(0)?.toUpperCase() || 'U';
    return divIcon({
      html: `
        <div style="
          background: #3879E9;
          border: 3px solid white;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(56, 121, 233, 0.4);
          font-family: 'Poppins', sans-serif;
          ${
            book.ownerProfilePhoto
              ? `
            background-image: url('${book.ownerProfilePhoto}');
            background-size: cover;
            background-position: center;
          `
              : ''
          }
        ">
          ${!book.ownerProfilePhoto ? initial : ''}
        </div>
      `,
      className: 'custom-user-marker',
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });
  };

  const markerIcon = isCluster ? createClusterIcon(books.length) : createUserIcon(books[0]);

  return (
    <Marker position={position} icon={markerIcon}>
      <Popup
        closeButton={true}
        className="custom-popup"
        maxWidth={450}
        minWidth={320}
        offset={[0, -10]}
      >
        <BookPopup books={books} onBookClick={onMarkerClick} />
      </Popup>
    </Marker>
  );
}
