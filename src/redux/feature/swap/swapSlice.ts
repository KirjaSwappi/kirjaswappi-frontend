import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SwapType } from '../../../../types/enum';
import { swapApi } from './swapApi';
import { ISwapBookInformation, ISwapBookInitialInformation } from './types/interface';

interface IErrorPayload {
  error?: {
    code?: string;
    message?: string;
  };
}
const initialState: ISwapBookInitialInformation = {
  errorMessage: '',
  swapModalOpen: false,
  clearStateOfSwapRequest: false,
  isSwapBookDetailsOrBookHomePage: false,
  bookIdToSwapWith: '',
  swapFilterGenre: [],
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
    setBookIdToSwapWith: (state, action: PayloadAction<string>) => {
      state.bookIdToSwapWith = action.payload;
    },
    setClearErrorMessage: (state) => {
      state.errorMessage = '';
    },
    setSwapFilterGenre: (state, action: PayloadAction<string[]>) => {
      state.swapFilterGenre = [...action.payload];
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(swapApi.endpoints.swapRequest.matchPending, (state) => {
      state.clearStateOfSwapRequest = false;
    });
    builder.addMatcher(swapApi.endpoints.swapRequest.matchFulfilled, (state) => {
      state.clearStateOfSwapRequest = true;
    });
    builder.addMatcher(
      swapApi.endpoints.swapRequest.matchRejected,
      (state, action: PayloadAction<FetchBaseQueryError | undefined>) => {
        const error = (action.payload as FetchBaseQueryError)?.data as IErrorPayload;

        let errorMessage: string | undefined;

        if (error && typeof error.error === 'object' && error.error !== null) {
          errorMessage = error.error.message;
        }
        state.errorMessage = errorMessage;
        state.clearStateOfSwapRequest = true;
      },
    );
  },
});

export const {
  setSwapModal,
  setSwapBook,
  setResetSwapBook,
  setSwapBookDetailsOrBookHomePage,
  setBookIdToSwapWith,
  setClearErrorMessage,
  setSwapFilterGenre,
} = swapSlice.actions;
export default swapSlice.reducer;
