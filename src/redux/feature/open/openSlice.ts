import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IOpenInitialState {
  open: boolean;
  swapModal: boolean;
  showAlert: boolean;
  message: string;
  loginModalOpen: boolean;
}

const initialState: IOpenInitialState = {
  open: false,
  swapModal: false,
  showAlert: false,
  message: '',
  loginModalOpen: false,
};
const openSlice = createSlice({
  name: 'open',
  initialState,
  reducers: {
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
    setLoginModalOpen: (state, action: PayloadAction<boolean>) => {
      state.loginModalOpen = action.payload;
    },
  },
});

export const { setOpen, setLoginModalOpen } = openSlice.actions;
export default openSlice.reducer;
