import { Controller, useFormContext } from 'react-hook-form';
import { SwapType } from '../../../../../types/enum';
import giveaway from '../../../../assets/giveaway.png';
import library from '../../../../assets/library.png';
import Button from '../../Button';
import Image from '../../Image';
import { ISwapBook } from '../types/interface';
import SwapBookCarousels from './SwapBookCarousels';
export default function SwapController({
  swapType,
  books,
  swapTitle,
  swapDescription,
}: {
  swapType: SwapType;
  swapTitle: string;
  swapDescription: string;
  books?: ISwapBook[];
}) {
  const { control, watch } = useFormContext();
  const currentSwapType = watch('swapType');
  return (
    <Controller
      name="swapType"
      control={control}
      render={({ field }) => {
        return (
          <Button
            type="button"
            onClick={() => field.onChange(swapType)}
            aria-pressed={field.value === swapType}
            className="w-full"
          >
            <label
              className={` ${swapType === SwapType.GIVEAWAY ? 'bg-[#F2F2F2] border-[#E5E5E5]' : 'bg-[#DBEDFF] border-primary'} border  w-full h-[80px] flex items-center rounded-xl px-[18px] gap-2 mb-1`}
              aria-label="Ask for giveaway"
            >
              <div className="w-2/12">
                <div
                  className={`w-10 h-10 flex items-center justify-center ${swapType === SwapType.GIVEAWAY ? 'bg-yellow' : 'bg-primary'} rounded-full`}
                >
                  <Image
                    src={swapType === SwapType.GIVEAWAY ? giveaway : library}
                    alt="library"
                    className="w-4 h-4"
                  />
                </div>
              </div>
              <div className="w-8/12 text-left">
                <h3 className="text-sm font-poppins font-normal text-smokyBlack">{swapTitle}</h3>
                <p className="text-xs font-poppins font-normal text-[#8C8C8C]">{swapDescription}</p>
              </div>
              <div className="w-1/12 flex items-end justify-end">
                <input
                  type="radio"
                  value={currentSwapType}
                  checked={field.value === swapType}
                  onChange={() => field.onChange(swapType)}
                  className="w-4 h-4"
                />
              </div>
            </label>
            {swapType !== SwapType.GIVEAWAY && currentSwapType === swapType && (
              <SwapBookCarousels swapBook={books} />
            )}
          </Button>
        );
      }}
    />
  );
}
