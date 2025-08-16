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
export interface ISwapSenderInformation {
  id: string;
}
export interface ISwapBookInitialInformation {
  senderInformation: ISwapSenderInformation;
  swapModalOpen: boolean;
  isSwapBookDetailsOrBookHomePage: boolean;
  swapBookInformation: ISwapBookInformation;
}
