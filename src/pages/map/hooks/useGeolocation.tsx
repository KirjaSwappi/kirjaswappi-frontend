import { useEffect } from 'react';
import { useAppDispatch } from '../../../redux/hooks';
import { setMapCenter, setUserLocation } from '../../../redux/feature/map/mapSlice';

export const useGeolocation = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(setUserLocation({ latitude, longitude }));
          dispatch(setMapCenter({ latitude, longitude }));
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Fall back to Helsinki
          const defaultLocation = { latitude: 60.1699, longitude: 24.9384 };
          dispatch(setMapCenter(defaultLocation));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      );
    } else {
      // Geolocation not supported, use default location
      const defaultLocation = { latitude: 60.1699, longitude: 24.9384 };
      dispatch(setMapCenter(defaultLocation));
    }
  }, [dispatch]);
};
