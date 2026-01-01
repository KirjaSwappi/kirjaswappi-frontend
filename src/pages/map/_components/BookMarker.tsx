import { Icon, divIcon } from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { IBookWithLocation } from '../types/interface';
import BookPopup from './BookPopup';

interface BookMarkerProps {
  books: IBookWithLocation[];
  position: [number, number];
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

export default function BookMarker({ books, position }: BookMarkerProps) {
  const isCluster = books.length > 1;

  const createClusterIcon = (books: IBookWithLocation[]) => {
    const maxVisible = 3;
    const visibleBooks = books.slice(0, maxVisible);
    const extraCount = books.length - maxVisible;

    const colors = ['#60A5FA', '#F87171', '#FBBF24', '#34D399', '#A78BFA'];

    const circlesHtml = visibleBooks
      .map((book, index) => {
        const initial = book.title?.charAt(0)?.toUpperCase() || 'B';
        const color = colors[hashString(book.id) % colors.length];
        const left = index * 14;

        return `
        <div
          style="
            position:absolute;
            left:${left}px;
            width:28px;
            height:28px;
            border-radius:50%;
            background:${color};
            display:flex;
            align-items:center;
            justify-content:center;
            color:white;
            font-weight:600;
            font-size:12px;
            border:2px solid #fff;
            z-index:${10 - index};
          "
        >
          ${initial}
        </div>
      `;
      })
      .join('');

    const extraHtml =
      extraCount > 0
        ? `
        <div
          style="
            position:absolute;
            left:${maxVisible * 14}px;
            width:28px;
            height:28px;
            border-radius:50%;
            background:#111;
            display:flex;
            align-items:center;
            justify-content:center;
            color:white;
            font-size:11px;
            border:2px solid #fff;
          "
        >
          +${extraCount}
        </div>
      `
        : '';

    const width = 28 + (visibleBooks.length - 1) * 14 + (extraCount > 0 ? 14 : 0);

    return divIcon({
      html: `
      <div style="position:relative;width:${width}px;height:28px">
        ${circlesHtml}
        ${extraHtml}
      </div>
    `,
      iconSize: [width, 28],
      iconAnchor: [width / 2, 28],
      popupAnchor: [0, -28],
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

  const markerIcon = isCluster ? createClusterIcon(books) : createBookIcon(books[0]);

  return (
    <Marker position={position} icon={markerIcon}>
      <Popup offset={[0, -10]}>
        <BookPopup books={books} />
      </Popup>
    </Marker>
  );
}
