import { SwapType } from '../../../../../types/enum';

export interface ISwapBookInformation {
  id: string;
  title: string;
  author: string;
  genres: string[];
  language: string;
  description: string;
  condition: string;
  coverPhotoUrls: string[];
  owner: {
    id: string;
    name: string;
  };
  swapCondition: {
    swapType: SwapType;
    giveAway: boolean;
    openForOffers: boolean;
    swappableGenres: string[];
    swappableBooks: {
      id: string;
      title: string;
      author: string;
      coverPhoto: File | string;
    }[];
  };
}

export interface ISwapBookInitialInformation {
  clearStateOfSwapRequest: boolean;
  swapFilterGenre: string[];
  errorMessage: string | undefined;
  swapModalOpen: boolean;
  bookIdToSwapWith: string;
  isSwapBookDetailsOrBookHomePage: boolean;
  swapBookInformation: ISwapBookInformation;
}
