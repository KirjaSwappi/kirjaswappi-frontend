import { SwapType } from '../../../../types/enum';

export type TOptions = {
  label: string;
  value: string;
};

export interface IBookDetailsProps {
  languageOptions: TOptions[] | undefined;
  conditionOptions: TOptions[] | undefined;
}

export interface ISwappableBook {
  title: string;
  author: string;
  coverPhoto: string | File;
  flag?: boolean;
}

export interface IAddUpdateBookData {
  title: string;
  author: string;
  description: string;
  language: string;
  condition: string;
  genres: string[]; // what is it?
  coverPhotos: (File | string)[];
  swapType: SwapType;
  swappableBooks: ISwappableBook[];
  swappableGenres: string[];
}

// ===================
interface ISwappableBookData {
  id: string;
  title: string;
  author: string;
  coverPhotoUrl: string;
}

interface ISwappableGenreData {
  name: string;
}

interface ISwapConditionData {
  swapType: string;
  giveAway: boolean;
  openForOffers: boolean;
  swappableBooks?: ISwappableBookData[];
  swappableGenres?: ISwappableGenreData[];
}

export interface IBookData {
  ownerId?: string;
  id?: string;
  title: string;
  author: string;
  description: string;
  language: string;
  condition: string;
  genres: string[];
  coverPhotoUrls: (string | File)[];
  swapCondition?: ISwapConditionData;
}

// Form data interface that extends BookData with form-specific fields
export interface IAddUpdateBook {
  title: string;
  author: string;
  description: string;
  language: string;
  condition: string;
  genres: string[];
  coverPhotos: (File | string)[];
  swapType: SwapType;
  swappableBooks: {
    title: string;
    author: string;
    coverPhoto: File | string;
  }[];
  swappableGenres: string[];
}
