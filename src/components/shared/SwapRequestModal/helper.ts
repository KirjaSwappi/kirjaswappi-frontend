import { SwapType } from '../../../../types/enum';

export const swapRequestDefaultValues = () => ({
  swapType: SwapType.BYBOOKS,
  selectedBook: undefined,
  note: '',
});
