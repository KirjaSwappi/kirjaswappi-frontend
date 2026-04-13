import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCallback, useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as { _getIconUrl?: () => void })._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationMapProps {
  position: [number, number];
  zoom?: number;
  isEditing?: boolean;
  onPositionChange?: (newPosition: [number, number]) => void;
}

// Helper component to update map view when position changes
function ChangeView({ position, zoom }: LocationMapProps) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, zoom);
  }, [map, position, zoom]);
  return null;
}

// Map click handler component
function MapClickHandler({
  onPositionChange,
}: {
  onPositionChange: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click: (e) => {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function LocationMap({
  position,
  zoom = 13,
  isEditing,
  onPositionChange,
}: LocationMapProps) {
  const handlePositionChange = useCallback(
    (newPos: [number, number]) => {
      onPositionChange?.(newPos);
    },
    [onPositionChange],
  );

  const getCurrentLocation = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handlePositionChange([latitude, longitude]);
        },
        (error) => {
          console.warn('Geolocation error:', error);
        },
      );
    }
  }, [handlePositionChange]);

  return (
    <div className="h-[200px] w-full mt-2 rounded-lg overflow-hidden border border-platinum relative">
      {isEditing && (
        <button
          onClick={getCurrentLocation}
          className="absolute bottom-4 right-4 z-[1000] bg-white rounded-lg shadow-md p-2 hover:bg-gray-50 transition-colors"
          title="Get current location"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06z"
            />
          </svg>
        </button>
      )}
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <ChangeView position={position} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {isEditing && onPositionChange && (
          <MapClickHandler onPositionChange={handlePositionChange} />
        )}
        <Marker
          position={position}
          draggable={isEditing}
          eventHandlers={
            isEditing
              ? {
                  dragend: (e) => {
                    const marker = e.target;
                    const pos = marker.getLatLng();
                    handlePositionChange([pos.lat, pos.lng]);
                  },
                }
              : undefined
          }
        />
      </MapContainer>
    </div>
  );
}
