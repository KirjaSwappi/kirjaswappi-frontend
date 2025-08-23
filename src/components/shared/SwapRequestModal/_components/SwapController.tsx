import Lottie from 'lottie-react';
import { Controller, useFormContext } from 'react-hook-form';
import { SwapType } from '../../../../../types/enum';
import giveaway from '../../../../assets/giveaway.png';
import library from '../../../../assets/library.png';
import notFoundData from '../../../../assets/notFoundData.json';
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
  const radioId = `swap-type-radio-${swapType}`;
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
              htmlFor={radioId}
              aria-label={swapTitle}
              className={` ${swapType === SwapType.GIVEAWAY ? 'bg-[#F2F2F2] border-platinumMix' : 'bg-[#DBEDFF] border-primary'} border  w-full h-[80px] flex items-center rounded-xl px-[18px] gap-2 mb-1`}
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
                  id={radioId}
                  type="radio"
                  value={swapType}
                  checked={field.value === swapType}
                  onChange={() => field.onChange(swapType)}
                  className="w-4 h-4"
                  tabIndex={-1}
                />
              </div>
            </label>

            {currentSwapType === swapType && swapType !== SwapType.GIVEAWAY && (
              <>
                {books && books.length > 0 ? (
                  <SwapBookCarousels
                    swapBook={books.map((book) => ({
                      ...book,
                      id: book.id ? String(book.id) : '',
                    }))}
                  />
                ) : (
                  <div
                    id="notFoundData"
                    className="py-5 bg-light rounded-xl border border-gray flex flex-col items-center justify-center mt-1 mb-1"
                  >
                    <Lottie
                      animationData={notFoundData}
                      loop={true}
                      className="w-[200px] h-[90px]"
                    />
                    <p className="text-xs font-poppins text-[#6F6E77] font-light">
                      Books not found in your library
                    </p>
                  </div>
                )}
              </>
            )}
          </Button>
        );
      }}
    />
  );
}
