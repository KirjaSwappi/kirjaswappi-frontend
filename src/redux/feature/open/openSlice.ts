import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IOpenInitialState {
  open: boolean;
  swapModal: boolean;
  showAlert: boolean;
  message: string;
  loginModalOpen: boolean;
  searchToggle: boolean;
}

const initialState: IOpenInitialState = {
  open: false,
  swapModal: false,
  showAlert: false,
  message: '',
  loginModalOpen: false,
  searchToggle: false,
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
    setSearchToggle: (state, action: PayloadAction<boolean>) => {
      state.searchToggle = action.payload;
    },
  },
});

export const { setOpen, setLoginModalOpen, setSearchToggle } = openSlice.actions;
export default openSlice.reducer;
