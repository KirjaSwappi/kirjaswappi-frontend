import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
});
export const { setBookLoading } = bookSlice.actions;
export default bookSlice.reducer;
