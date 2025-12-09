import { SwapType } from '../../../../types/enum';

export interface ISwappableBookData {
  id?: string;
  title: string;
  author: string;
  coverPhotoUrl: string;
}

export interface ISwapConditionData<T = ISwappableBookData> {
  swapType: SwapType;
  giveAway: boolean;
  openForOffers: boolean;
  swappableGenres: {
    id: string;
    name: string;
  }[];
  swappableBooks: T[];
}
export interface IExchange {
  swapType: string;
  title: string;
  value: string;
  coverPhotoUrl?: string;
}

export interface BookImageSliderProps {
  images: string[];
  className?: string;
}
export interface ILocation {
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  postalCode: string;
  radiusKm: number;
}
