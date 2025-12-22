import { Circle } from 'react-leaflet';

interface AccuracyCircleProps {
  center: [number, number];
  accuracy: number;
}

export default function AccuracyCircle({ center, accuracy }: AccuracyCircleProps) {
  return (
    <Circle
      center={center}
      radius={accuracy}
      pathOptions={{
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.15,
        weight: 2,
      }}
    />
  );
}
