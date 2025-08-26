import { SwapType } from '../../../../../types/enum';

export interface ISwapBook {
  id?: string;
  author: string;
  coverPhotoUrl?: string;
  title: string;
}

export interface ISwapRequestForm {
  swapType: SwapType;
  selectedBook?: ISwapBook;
  note: string;
}
export type TOrganizedData = {
  senderId: string | undefined;
  receiverId: string;
  swapType: SwapType;
  note: string;
  bookIdToSwapWith: string;
  askForGiveaway: boolean;
  swapOffer?: {
    offeredBookId?: string;
    offeredGenreId?: string;
  };
};

export interface IGenre {
  id: string;
  name: string;
  parent: IGenre | null;
}
