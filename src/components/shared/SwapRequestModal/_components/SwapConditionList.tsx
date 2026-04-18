import { SwapType } from '../../../../../types/enum';
import genre from '../../../../assets/genre.png';
import givewayIcon from '../../../../assets/givewayIcon.png';
import openToOffer from '../../../../assets/openToOffer.png';
import swap from '../../../../assets/swap.png';

export const SwapConditionList: Record<string, { image: string; labelKey: string }> = {
  [SwapType.BYGENRES]: {
    image: genre,
    labelKey: 'swap.byGenre',
  },
  [SwapType.BYBOOKS]: {
    image: swap,
    labelKey: 'swap.byBooks',
  },
  [SwapType.OPENTOOFFERS]: {
    image: openToOffer,
    labelKey: 'swap.openToOffer',
  },
  [SwapType.GIVEAWAY]: {
    image: givewayIcon,
    labelKey: 'swap.giveaway',
  },
};
