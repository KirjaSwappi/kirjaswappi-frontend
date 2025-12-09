import { useEffect, useState } from 'react';

export const useGeolocation = () => {
  const [coords, setCoords] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });

  const [permissionChecked, setPermissionChecked] = useState(false);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ latitude, longitude });
          setPermissionChecked(true);
        },
        (error) => {
          console.warn('Geolocation error:', error);

          // ❗️SET DEFAULT ONLY IF USER REJECTED ACCESS
          if (error.code === error.PERMISSION_DENIED) {
            setCoords({ latitude: 60.1699, longitude: 24.9384 });
          }

          setPermissionChecked(true);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        },
      );
    } else {
      // If device does not support GPS
      setCoords({ latitude: 60.1699, longitude: 24.9384 });
      setPermissionChecked(true);
    }
  }, []);

  return { coords, permissionChecked };
};
