import byGenres from '../../../assets/3d-condition-icon-Genre.png';
import Giveaway from '../../../assets/3d-condition-icon-Giveaway.png';
import Open from '../../../assets/3d-condition-icon-Open-to-Offer.png';
import book from '../../../assets/3d-condition-icon-by-book.png';
import Image from '../../../components/shared/Image';

import { useTranslation } from 'react-i18next';
import { SwapType } from '../../../../types/enum';

export default function ConditionMessageBox({ swapType }: { swapType: string }) {
  const { t } = useTranslation();
  if (!swapType) return null;

  const swapConditionList: Record<string, { image: string; message: string }> = {
    [SwapType.BYGENRES]: {
      image: byGenres,
      message: t('addBook.conditionByGenres'),
    },
    [SwapType.BYBOOKS]: {
      image: book,
      message: t('addBook.conditionByBooks'),
    },
    [SwapType.OPENTOOFFERS]: {
      image: Open,
      message: t('addBook.conditionOpenToOffers'),
    },
    [SwapType.GIVEAWAY]: {
      image: Giveaway,
      message: t('addBook.conditionGiveAway'),
    },
  };

  const swapCondition = swapConditionList[swapType];

  return (
    <div
      className={`border border-yellow bg-yellow-light flex flex-col items-center justify-center p-5 gap-2 rounded-lg 
      lg:min-h-[258px] ${SwapType.GIVEAWAY === swapType || SwapType.OPENTOOFFERS === swapType ? 'lg:mt-[26px]' : ''}`}
    >
      <Image src={swapCondition.image} alt={swapType} className="h-[64px]" />
      <p className="text-smokyBlack font-poppins text-sm font-normal text-center">
        {swapCondition.message}
      </p>
    </div>
  );
}
