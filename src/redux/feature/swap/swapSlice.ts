import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SwapType } from '../../../../types/enum';
import { ISwapBookInformation, ISwapBookInitialInformation } from './types/interface';

const initialState: ISwapBookInitialInformation = {
  swapModalOpen: false,
  isSwapBookDetailsOrBookHomePage: false,
  swapBookInformation: {
    id: '',
    title: '',
    author: '',
    genres: [],
    language: '',
    description: '',
    condition: '',
    coverPhotoUrls: [],
    owner: {
      id: '',
      name: '',
    },
    swapCondition: {
      swapType: SwapType.BYBOOKS,
      giveAway: false,
      openForOffers: false,
      swappableGenres: [],
      swappableBooks: [],
    },
  },
};

const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    setSwapBook: (state, action: PayloadAction<ISwapBookInformation>) => {
      state.swapBookInformation = { ...initialState.swapBookInformation, ...action.payload };
    },
    setResetSwapBook: (state) => {
      state.swapBookInformation = { ...initialState.swapBookInformation };
    },
    setSwapBookDetailsOrBookHomePage: (state, action: PayloadAction<boolean>) => {
      state.isSwapBookDetailsOrBookHomePage = action.payload;
    },
    setSwapModal: (state, action: PayloadAction<boolean>) => {
      state.swapModalOpen = action.payload;
    },
  },
});

export const { setSwapModal, setSwapBook, setResetSwapBook, setSwapBookDetailsOrBookHomePage } =
  swapSlice.actions;
export default swapSlice.reducer;
