import L from 'leaflet';
import LocationIcon from '../assets/locationIcon.svg';

export const userLocationIcon = new L.Icon({
  iconUrl: LocationIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  className: 'user-location-icon',
});
