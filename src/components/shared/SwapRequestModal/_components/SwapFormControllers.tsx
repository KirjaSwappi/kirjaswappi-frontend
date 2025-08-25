import { Controller, useFormContext } from 'react-hook-form';
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
          swapTitle="Select from your library"
          swapType={SwapType.BYGENRES}
          books={data}
          swapDescription="You can offer from your library or, ask for genres"
        />
      )}

      {swapType === SwapType.OPENTOOFFERS && (
        <SwapController
          swapTitle="Select from your library"
          swapType={SwapType.OPENTOOFFERS}
          books={books}
          swapDescription="You can offer from your library or, ask for open to offer"
        />
      )}

      <SwapController
        swapTitle="Ask for giveaway"
        swapType={SwapType.GIVEAWAY}
        swapDescription="You can offer from your library or, ask for giveaway"
      />
    </div>
  );
};

export default SwapFormControllers;
