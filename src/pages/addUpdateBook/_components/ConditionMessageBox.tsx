import byGenres from '../../../assets/3d-condition-icon-Genre.png';
import Giveaway from '../../../assets/3d-condition-icon-Giveaway.png';
import Open from '../../../assets/3d-condition-icon-Open-to-Offer.png';
import book from '../../../assets/3d-condition-icon-by-book.png';
import Image from '../../../components/shared/Image';

import { SwapType } from '../../../../types/enum';

export default function ConditionMessageBox({ swapType }: { swapType: string }) {
  if (!swapType) return null;

  const swapConditionList: Record<string, { image: string; message: string }> = {
    [SwapType.BYGENRES]: {
      image: byGenres,
      message: 'Add your preferred genre to swap with.',
    },
    [SwapType.BYBOOKS]: {
      image: book,
      message: 'Swap with specific book(s).',
    },
    [SwapType.OPENTOOFFERS]: {
      image: Open,
      message: 'Receive swap offers of all sorts.',
    },
    [SwapType.GIVEAWAY]: {
      image: Giveaway,
      message: 'Give away this book.',
    },
  };

  const swapCondition = swapConditionList[swapType];

  return (
    <div className="border border-yellow bg-yellow-light flex flex-col items-center justify-center p-5 gap-2 rounded-lg ">
      <Image src={swapCondition.image} alt={swapType} className="h-[64px]" />
      <p className="text-smokyBlack font-poppins text-sm font-normal text-center">
        {swapCondition.message}
      </p>
    </div>
  );
}
