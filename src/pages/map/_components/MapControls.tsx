import { useMap } from 'react-leaflet';

type MapControlsProps = {
  latitude: number;
  longitude: number;
};

export default function MapControls({ latitude, longitude }: MapControlsProps) {
  const map = useMap();

  return (
    <div className="absolute bottom-28 right-7 z-[999999] flex flex-col gap-3">
      <button
        onClick={() => map.zoomIn()}
        className="w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center text-xl"
      >
        +
      </button>

      {/* ➖ Zoom Out */}
      <button
        onClick={() => map.zoomOut()}
        className="w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center text-xl"
      >
        −
      </button>

      <button
        onClick={() => map.flyTo([latitude, longitude], 16, { animate: true })}
        className="w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center"
        title="My location"
      >
        📍
      </button>
    </div>
  );
}
