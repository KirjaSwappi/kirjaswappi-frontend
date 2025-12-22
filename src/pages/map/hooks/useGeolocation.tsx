import { useEffect, useRef, useState } from 'react';

type Coords = {
  latitude: number | null;
  longitude: number | null;
  accuracy?: number;
};

type UseGeolocationOptions = {
  watch?: boolean;
  fallback?: {
    latitude: number;
    longitude: number;
  };
};

const DEFAULT_FALLBACK = {
  latitude: 60.1699,
  longitude: 24.9384,
};

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const { watch = false, fallback = DEFAULT_FALLBACK } = options;

  const [coords, setCoords] = useState<Coords>({
    latitude: null,
    longitude: null,
  });

  const [permissionChecked, setPermissionChecked] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setCoords(fallback);
      setPermissionChecked(true);
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;

      setCoords({
        latitude,
        longitude,
        accuracy,
      });

      setPermissionChecked(true);
    };

    const onError = (error: GeolocationPositionError) => {
      console.warn('Geolocation error:', error);

      if (error.code === error.PERMISSION_DENIED) {
        setCoords(fallback);
      }

      setPermissionChecked(true);
    };

    if (watch) {
      watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      });
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      });
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [watch, fallback]);

  return {
    coords,
    permissionChecked,
  };
};
