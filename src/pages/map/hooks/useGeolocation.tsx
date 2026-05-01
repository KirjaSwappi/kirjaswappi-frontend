import { useEffect, useRef, useState } from 'react';

type Coords = {
  latitude: number | null;
  longitude: number | null;
  accuracy?: number;
};

type UseGeolocationOptions = {
  watch?: boolean;
  enabled?: boolean;
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
  const { watch = false, enabled = true, fallback = DEFAULT_FALLBACK } = options;

  const [coords, setCoords] = useState<Coords>({
    latitude: null,
    longitude: null,
  });

  const [permissionChecked, setPermissionChecked] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

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

      // Always end in a usable state. PERMISSION_DENIED, POSITION_UNAVAILABLE,
      // and TIMEOUT all fall back to the same coords so the map renders.
      setCoords(fallback);
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
  }, [watch, enabled, fallback]);

  return {
    coords,
    permissionChecked,
  };
};
