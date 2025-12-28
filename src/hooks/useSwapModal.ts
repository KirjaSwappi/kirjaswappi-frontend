import { useCallback } from 'react';
import { setSwapModal } from '../redux/feature/swap/swapSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

export function useSwapModal() {
  const dispatch = useAppDispatch();
  const swapModalOpen = useAppSelector((state) => state.swapBook.swapModalOpen);

  const setSwapModalOpen = useCallback(
    (open: boolean) => {
      dispatch(setSwapModal(open));
    },
    [dispatch],
  );

  const openSwapModal = useCallback(() => {
    dispatch(setSwapModal(true));
  }, [dispatch]);

  const closeSwapModal = useCallback(() => {
    dispatch(setSwapModal(false));
  }, [dispatch]);

  const toggleSwapModal = useCallback(() => {
    dispatch(setSwapModal(!swapModalOpen));
  }, [dispatch, swapModalOpen]);

  return {
    swapModalOpen,
    setSwapModalOpen,
    openSwapModal,
    closeSwapModal,
    toggleSwapModal,
  };
}
