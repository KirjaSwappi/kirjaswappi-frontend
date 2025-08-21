import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { bookApi } from './bookApi';

export interface IBookInitialState {
  loading: boolean;
}

const initialState: IBookInitialState = {
  loading: false,
};
const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    setBookLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(bookApi.endpoints.getBookById.matchPending, (state) => {
      state.loading = true;
    });
    builder.addMatcher(bookApi.endpoints.getBookById.matchFulfilled, (state) => {
      state.loading = false;
    });
    builder.addMatcher(bookApi.endpoints.getBookById.matchRejected, (state) => {
      state.loading = false;
    });
  },
});

export default bookSlice.reducer;
