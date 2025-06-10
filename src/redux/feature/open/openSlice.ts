import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IOpenInitialState {
  open: boolean;
  swapModal: boolean;
  showAlert: boolean;
  message: string;
}

const initialState: IOpenInitialState = {
  open: false,
  swapModal: false,
  showAlert: false,
  message: '',
};
const openSlice = createSlice({
  name: 'open',
  initialState,
  reducers: {
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
  },
});

export const { setOpen } = openSlice.actions;
export default openSlice.reducer;
