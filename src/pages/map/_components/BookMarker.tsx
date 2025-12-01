import { Icon, divIcon } from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { IBookWithLocation } from '../types/interface';
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

const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

export default function BookMarker({ books, position, onMarkerClick }: BookMarkerProps) {
  const isCluster = books.length > 1;

  const createClusterIcon = (count: number) => {
    const size = count > 10 ? 50 : count > 5 ? 45 : 40;
    return divIcon({
      html: `
        <div class="flex items-center justify-center font-bold text-white shadow-lg rounded-full !bg-[#3879E9] border-4 border-white transition-transform duration-200 hover:scale-110"
             style="width:${size}px; height:${size}px; font-size:${count > 10 ? '16px' : '14px'}">
          ${count}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  const createBookIcon = (book: IBookWithLocation) => {
    const initial = book.title?.charAt(0)?.toUpperCase() || 'B';

    const colors = ['#34D399', '#F87171', '#FBBF24', '#60A5FA', '#A78BFA', '#F472B6'];

    const source = book.id || book.title || 'default';
    const colorIndex = hashString(source) % colors.length;
    const innerColor = colors[colorIndex];

    return divIcon({
      html: `
        <div class="relative w-11 h-11">
          <div class="absolute left-0 top-0 w-11 h-11 bg-[#3879E9] rounded-[50%_50%_50%_0] rotate-[360deg] flex items-center justify-center shadow-md  border border-light">
            <div class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-sm"
                 style="background:${innerColor}; transform: rotate(0deg);">
              ${initial}
            </div>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 44],
      popupAnchor: [0, -44],
    });
  };

  const markerIcon = isCluster ? createClusterIcon(books.length) : createBookIcon(books[0]);

  return (
    <Marker position={position} icon={markerIcon}>
      <Popup maxWidth={450} minWidth={320} offset={[0, -10]}>
        <BookPopup books={books} onBookClick={onMarkerClick} />
      </Popup>
    </Marker>
  );
}
