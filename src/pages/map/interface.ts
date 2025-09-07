import { IBook } from '../books/interface';

export interface IBookWithLocation extends IBook {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
  createdAt: string;
}

export interface IMapMarker {
  id: string;
  latitude: number;
  longitude: number;
  books: IBookWithLocation[];
  userAvatars: string[];
  isCluster: boolean;
  clusterCount?: number;
}

export interface IMapState {
  center: {
    latitude: number;
    longitude: number;
  };
  zoom: number;
  selectedMarker: string | null;
  showPopup: boolean;
  userLocation: {
    latitude: number | null;
    longitude: number | null;
  };
  mapLoading: boolean;
}

export interface IMapFilter {
  genre: string[];
  condition: string[];
  language: string[];
  search?: string;
  radius?: number;
  centerLocation?: {
    latitude: number;
    longitude: number;
  };
}
