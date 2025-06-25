import { SwapType } from '../../../../../types/enum';
import genre from '../../../../assets/genre.png';
import givewayIcon from '../../../../assets/givewayIcon.png';
import openToOffer from '../../../../assets/openToOffer.png';
import swap from '../../../../assets/swap.png';

export const SwapConditionList: Record<string, { image: string; label: string }> = {
  [SwapType.BYGENRES]: {
    image: genre,
    label: 'By Genre',
  },
  [SwapType.BYBOOKS]: {
    image: swap,
    label: 'By Books',
  },
  [SwapType.OPENTOOFFERS]: {
    image: openToOffer,
    label: 'Open To Offer',
  },
  [SwapType.GIVEAWAY]: {
    image: givewayIcon,
    label: 'Giveaway',
  },
};
