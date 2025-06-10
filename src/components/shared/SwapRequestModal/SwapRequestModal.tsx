/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { SwapType } from '../../../../types/enum';
import close from '../../../assets/close.svg';
import sendMessageIcon from '../../../assets/sendMessageIcon.png';
import { setSwapModal } from '../../../redux/feature/swap/swapSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import Button from '../Button';
import ControlledInputField from '../ControllerField';
import Image from '../Image';
import InputLabel from '../InputLabel';
import SwapBookCarousels from './_components/SwapBookCarousels';
import SwapBookInformation from './_components/SwapBookInformation';
import { SwapConditionList } from './_components/SwapConditionList';
import SwapController from './_components/SwapController';
import { swapRequestDefaultValues } from './helper';
import { ISwapRequestForm } from './types/interface';

export default function SwapModal() {
  const dispatch = useAppDispatch();
  const { swapModalOpen, swapBookInformation } = useAppSelector((state) => state.swapBook);
  const {
    userInformation: { books },
  } = useAppSelector((state) => state.auth);
  const {
    swapCondition: { swapType, swappableBooks },
  } = swapBookInformation;

  const methods = useForm<ISwapRequestForm>({
    mode: 'onChange',
    defaultValues: swapRequestDefaultValues(),
  });
  const { control, watch, setValue, handleSubmit } = methods;
  const selectedBook = watch('selectedBook');
  const currentSwapType = watch('swapType');

  const conditionItem = SwapConditionList[swapType];

  useEffect(() => {
    if (currentSwapType !== SwapType.BYBOOKS && selectedBook) {
      setValue('selectedBook', undefined);
    }
  }, [currentSwapType]);

  return (
    <div
      className={`${
        swapModalOpen ? 'block' : 'hidden'
      } bg-black bg-opacity-50 inset-0 w-full h-screen fixed top-0 left-0 z-50 flex items-center justify-center`}
    >
      <div className="w-11/12 max-h-[90vh] bg-white rounded-md overflow-y-auto">
        <div className="py-4 border-b border-platinum relative">
          <h3 className="font-poppins font-normal text-base text-center leading-none">
            Swap Request
          </h3>
          <Button
            onClick={() => dispatch(setSwapModal(false))}
            className="border border-platinum rounded-full p-2 absolute right-4 top-3"
          >
            <Image src={close} alt="close" />
          </Button>
        </div>
        <div className="px-[14px] pb-2 mt-4">
          <SwapBookInformation />
          <div className="flex items-center gap-2 mt-5 mb-0">
            <Image src={conditionItem.image} alt={conditionItem.label} className="w-[14px]" />
            <h3>{conditionItem.label}</h3>
          </div>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit((data) => console.log(data))}>
              <div>
                <Controller
                  name="swapType"
                  control={control}
                  render={({ field }) => {
                    return (
                      <>
                        <Button
                          type="button"
                          onClick={() => field.onChange(SwapType.BYBOOKS)}
                          aria-pressed={field.value === SwapType.BYBOOKS}
                          className="w-full"
                        >
                          <input
                            id={SwapType.BYBOOKS}
                            type="radio"
                            value={SwapType.BYBOOKS}
                            readOnly
                            hidden
                          />
                          <SwapBookCarousels swapBook={swappableBooks} />
                        </Button>
                      </>
                    );
                  }}
                />
                {swapType === SwapType.BYGENRES && (
                  <SwapController
                    swapTitle="Select from your library"
                    swapType={SwapType.BYGENRES}
                    books={books}
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
              <div>
                <InputLabel label="Short Note" className="mt-5" />
                <ControlledInputField
                  type="textarea"
                  name="note"
                  placeholder="Write a short note"
                  className="rounded-md h-[83px] bg-white"
                />
              </div>
              <div className="flex justify-center pt-2 mt-5">
                <Button
                  type="submit"
                  className="bg-primary text-white font-medium text-xs py-2 w-full h-[48px] rounded-[8px] font-poppins flex justify-center items-center gap-2 "
                >
                  <Image src={sendMessageIcon} alt="Book" /> Send Request
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
