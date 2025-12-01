import { useEffect, useState } from 'react';

export const useGeolocation = () => {
  const [coords, setCoords] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ latitude, longitude });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          setCoords({ latitude: 60.1699, longitude: 24.9384 });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        },
      );
    } else {
      setCoords({ latitude: 60.1699, longitude: 24.9384 });
    }
  }, []);

  return coords;
};
