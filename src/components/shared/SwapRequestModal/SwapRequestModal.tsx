/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { SwapType } from '../../../../types/enum';
import close from '../../../assets/close.svg';
import sendMessageIcon from '../../../assets/sendMessageIcon.png';
import { ERROR } from '../../../constant/MESSAGETYPE';
import { useGetAllBooksQuery } from '../../../redux/feature/book/bookApi';
import { useSwapRequestMutation } from '../../../redux/feature/swap/swapApi';
import {
  setClearErrorMessage,
  setSwapFilterGenre,
  setSwapModal,
} from '../../../redux/feature/swap/swapSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import Button from '../Button';
import ControlledInputField from '../ControllerField';
import Image from '../Image';
import InputLabel from '../InputLabel';
import MessageToastify from '../MessageToastify';
import RequestFailedAnimation from './_components/RequestErrorAnimation';
import RequestProcessingAnimation from './_components/RequestProcesingAnimation';
import RequestSuccessAnimation from './_components/RequestSuccessAnimation';
import SwapBookCarousels from './_components/SwapBookCarousels';
import SwapBookInformation from './_components/SwapBookInformation';
import { SwapConditionList } from './_components/SwapConditionList';
import SwapController from './_components/SwapController';
import SwapRequestSkeleton from './_components/SwapRequestSkeleton';
import { swapRequestDefaultValues } from './helper';
import { ISwapRequestForm, TOrganizedData } from './types/interface';
export default function SwapModal() {
  const dispatch = useAppDispatch();
  const { swapModalOpen, swapBookInformation, bookIdToSwapWith, errorMessage, swapFilterGenre } =
    useAppSelector((state) => state.swapBook);
  const {
    userInformation: { books, id },
  } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.book);
  const {
    swapCondition: { swapType, swappableBooks, swappableGenres },
    owner,
    coverPhotoUrls,
    title,
  } = swapBookInformation;
  const swappableGenresLength = swappableGenres.length > 0;
  const [swapRequest, { isLoading, isSuccess, reset: SwapRequestReset }] = useSwapRequestMutation();
  // This API call's only when swappable Genres available
  const { data } = useGetAllBooksQuery(
    {
      filter: {
        genre: swapFilterGenre,
        condition: [],
        language: [],
        search: '',
      },
      ownerId: id,
      pageSize: 10,
    },
    { skip: !swappableGenresLength },
  );
  const methods = useForm<ISwapRequestForm>({
    mode: 'onChange',
    defaultValues: swapRequestDefaultValues(),
  });
  const { control, watch, setValue, handleSubmit, reset } = methods;
  const selectedBook = watch('selectedBook');
  const currentSwapType = watch('swapType');

  const conditionItem = SwapConditionList[swapType];

  useEffect(() => {
    if (currentSwapType !== SwapType.BYBOOKS && selectedBook) {
      setValue('selectedBook', undefined);
    }
  }, [currentSwapType]);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        SwapRequestReset();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (swappableGenresLength) {
      const genreNames = swappableGenres.map((item: any) => item.name);
      dispatch(setSwapFilterGenre(genreNames));
    }
  }, [swappableGenres]);

  const handleSubmitData = async (data: ISwapRequestForm) => {
    const organizedData: TOrganizedData = {
      senderId: id,
      receiverId: owner.id,
      swapType: data.swapType,
      note: data.note,
      bookIdToSwapWith: bookIdToSwapWith,
      askForGiveaway: false,
    };

    switch (data.swapType) {
      case SwapType.BYBOOKS:
        organizedData.swapOffer = {
          offeredBookId: data.selectedBook?.id,
        };
        break;
    }

    swapRequest(organizedData).then((res) => {
      if (res.data) {
        dispatch(setSwapModal(false));
      }
    });
  };
  useEffect(() => {
    if (errorMessage) {
      dispatch(setSwapModal(false));
      const timer = setTimeout(() => {
        dispatch(setClearErrorMessage());
        reset();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [errorMessage, dispatch, reset]);
  const disableSentRequest = !!selectedBook || currentSwapType === SwapType.GIVEAWAY;

  return (
    <>
      <RequestProcessingAnimation isLoading={isLoading} />
      <RequestSuccessAnimation isSuccess={isSuccess} />
      <RequestFailedAnimation isFailed={!!errorMessage} />
      {loading ? (
        <SwapRequestSkeleton />
      ) : (
        <div
          className={`${
            swapModalOpen ? 'block' : 'hidden'
          } bg-black bg-opacity-50 inset-0 w-full h-screen fixed -top-0 left-0 z-[999999999] flex items-center justify-center`}
        >
          <div className="w-11/12 lg:w-8/12 xl:w-1/2 max-h-[80vh] bg-white rounded-md overflow-y-auto">
            <div className="py-4 border-b border-platinum relative">
              <h3 className="font-poppins font-normal text-base text-center lg:text-left leading-none lg:pl-4">
                Swap Request
              </h3>
              <Button
                onClick={() => {
                  dispatch(setSwapModal(false));
                  dispatch(setClearErrorMessage());
                  reset();
                }}
                className="border border-platinum rounded-full p-2 absolute right-4 top-3"
              >
                <Image src={close} alt="close" />
              </Button>
            </div>
            <div className="px-[14px] lg:p-6 pb-2 mt-4 lg:mt-0 flex flex-col lg:flex-row lg:gap-6">
              <div className="flex gap-4">
                <div className="max-w-[108px] lg:max-w-[200px] h-[142px] lg:h-[263px] flex items-center justify-center ">
                  <Image
                    src={coverPhotoUrls?.[0] ?? ''}
                    alt={title}
                    className="max-w-[108px] lg:max-w-[200px] h-[142px] lg:h-[263px] object-cover  rounded-lg"
                  />
                </div>
                <div className="lg:hidden">
                  <SwapBookInformation />
                </div>
              </div>
              <div className="w-full lg:max-w-[65%] xl:w-8/12">
                <div className="hidden lg:block ">
                  <SwapBookInformation />
                </div>
                <div className=" flex items-center gap-2 mt-5 mb-0">
                  <Image src={conditionItem.image} alt={conditionItem.label} className="w-[14px]" />
                  <h3>{conditionItem.label}</h3>
                </div>
                {swappableGenresLength && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    <p className="text-grayDark font-poppins text-xs">Condition Genre:</p>
                    {swappableGenres?.map((genre: any, index) => (
                      <p key={index} className="font-poppins text-blackOlive text-xs">
                        {genre?.name}
                        {swappableGenres.length - 2 === index
                          ? ' &'
                          : swapFilterGenre.length - 1 !== index && ','}
                      </p>
                    ))}
                  </div>
                )}

                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit((data) => handleSubmitData(data))}>
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
                          books={data?._embedded?.books}
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
                    {!!errorMessage && (
                      <div className="mt-3">
                        <MessageToastify isShow={true} type={ERROR} value={errorMessage} />
                      </div>
                    )}
                    <div className="flex justify-center pt-2 mt-5">
                      <Button
                        disabled={!disableSentRequest}
                        type="submit"
                        className={`bg-primary text-white font-medium text-xs py-2 w-full h-[48px] rounded-[8px] font-poppins flex justify-center items-center gap-2 mb-4 ${!disableSentRequest ? 'opacity-40' : 'opacity-100'}`}
                      >
                        <Image src={sendMessageIcon} alt="Book" /> Send Request
                      </Button>
                    </div>
                  </form>
                </FormProvider>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
