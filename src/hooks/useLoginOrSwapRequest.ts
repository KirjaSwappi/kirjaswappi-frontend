import { useCallback } from 'react';
import { setLoginModalOpen } from '../redux/feature/open/openSlice';
import { setBookIdToSwapWith, setSwapBook, setSwapModal } from '../redux/feature/swap/swapSlice';
import { ISwapBookInformation } from '../redux/feature/swap/types/interface';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

export const useLoginModalOrSwapRequest = () => {
  const dispatch = useAppDispatch();
  const { userInformation } = useAppSelector((state) => state.auth);

  const handleLoginOrSwap = useCallback(
    (bookData?: ISwapBookInformation, id?: string) => {
      if (userInformation?.email) {
        dispatch(setSwapModal(true));
        if (bookData) dispatch(setSwapBook(bookData));
        if (id) dispatch(setBookIdToSwapWith(id));
      } else {
        dispatch(setLoginModalOpen(true));
      }
    },
    [dispatch, userInformation],
  );

  return { handleLoginOrSwap };
};
