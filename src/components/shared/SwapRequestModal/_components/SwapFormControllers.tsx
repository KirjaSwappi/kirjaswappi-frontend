import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SwapType } from '../../../../../types/enum';
import Button from '../../Button';
import { ISwapBook } from '../types/interface';
import SwapBookCarousels from './SwapBookCarousels';
import SwapController from './SwapController';

const SwapFormControllers = ({
  swapType,
  swappableBooks,
  books,
  data,
}: {
  swapType: string;
  data: ISwapBook[];
  swappableBooks: ISwapBook[] | [];
  books: ISwapBook[];
}) => {
  const { control } = useFormContext();
  const { t } = useTranslation();
  return (
    <div className="-mt-3">
      <Controller
        name="swapType"
        control={control}
        render={({ field }) => (
          <Button
            type="button"
            onClick={() => field.onChange(SwapType.BYBOOKS)}
            aria-pressed={field.value === SwapType.BYBOOKS}
            className="w-full"
          >
            <input type="radio" value={SwapType.BYBOOKS} hidden readOnly />
            <div className={field.value === SwapType.BYBOOKS ? 'pb-2.5' : ''}></div>
            <SwapBookCarousels swapBook={swappableBooks} />
          </Button>
        )}
      />

      {swapType === SwapType.BYGENRES && (
        <SwapController
          swapTitle={t('swap.selectFromLibrary')}
          swapType={SwapType.BYGENRES}
          books={data}
          swapDescription={t('swap.selectFromLibraryDesc')}
        />
      )}

      {swapType === SwapType.OPENTOOFFERS && (
        <SwapController
          swapTitle={t('swap.selectFromLibrary')}
          swapType={SwapType.OPENTOOFFERS}
          books={books}
          swapDescription={t('swap.selectFromLibraryDesc')}
        />
      )}

      <SwapController
        swapTitle={t('swap.askForGiveaway')}
        swapType={SwapType.GIVEAWAY}
        swapDescription={t('swap.askForGiveawayDesc')}
      />
    </div>
  );
};

export default SwapFormControllers;
