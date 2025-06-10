import { SwapType } from '../../../../../types/enum';

export interface ISwapBook {
  id?: string;
  author: string;
  coverPhotoUrl: string;
  title: string;
}

export interface ISwapRequestForm {
  swapType: SwapType;
  selectedBook?: ISwapBook;
  note: string;
}
