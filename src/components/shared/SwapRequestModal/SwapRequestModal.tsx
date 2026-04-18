/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SwapType } from '../../../../types/enum';
import { ERROR } from '../../../constant/MESSAGETYPE';
import { useGetAllBooksQuery } from '../../../redux/feature/book/bookApi';
import { useSwapRequestMutation } from '../../../redux/feature/swap/swapApi';
import {
  setClearErrorMessage,
  setResetSwapBook,
  setSwapFilterGenre,
  setSwapModal,
} from '../../../redux/feature/swap/swapSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import ControlledInputField from '../ControllerField';
import InputLabel from '../InputLabel';
import Line from '../Line';
import MessageToastify from '../MessageToastify';
import RequestFailedAnimation from './_components/RequestErrorAnimation';
import RequestProcessingAnimation from './_components/RequestProcessingAnimation';
import RequestSuccessAnimation from './_components/RequestSuccessAnimation';
import SwapBookInformation from './_components/SwapBookInformation';
import { SwapConditionList } from './_components/SwapConditionList';
import SwapFormControllers from './_components/SwapFormControllers';
import BookImage from './_components/SwapModalBookImage';
import ConditionDisplay from './_components/SwapModalConditionDisplay';
import GenreTags from './_components/SwapModalGenreTags';
import ModalHeader from './_components/SwapModalHeader';
import SubmitButton from './_components/SwapModalSubmitButton';
import SwapRequestSkeleton from './_components/SwapRequestSkeleton';
import { swapRequestDefaultValues } from './helper';
import { ISwapRequestForm, TOrganizedData } from './types/interface';
export default function SwapModal() {
  // =========== REDUX STATE ===========
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
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

  // =========== API HOOKS ===========
  const [swapRequest, { isLoading, isSuccess, reset: SwapRequestReset }] = useSwapRequestMutation();
  const swappableGenresLength = swappableGenres.length > 0;
  const { data } = useGetAllBooksQuery(
    {
      filter: {
        genre: swapFilterGenre,
        condition: [],
        language: [],
        search: '',
        pageNumber: 0,
      },
      ownerId: id,
    },
    { skip: !swappableGenresLength },
  );

  // =========== FORM MANAGEMENT ===========
  const methods = useForm<ISwapRequestForm>({
    mode: 'onChange',
    defaultValues: swapRequestDefaultValues(),
  });
  const { watch, setValue, handleSubmit, reset } = methods;
  const selectedBook = watch('selectedBook');
  const currentSwapType = watch('swapType');
  const conditionItem = SwapConditionList[swapType];

  // =========== EVENT HANDLERS ===========
  const handleCloseModal = useCallback(() => {
    dispatch(setSwapModal(false));
    dispatch(setClearErrorMessage());
    dispatch(setResetSwapBook());
    reset();
  }, [dispatch, reset]);

  const handleSwapRequest = useCallback(
    async (data: ISwapRequestForm) => {
      const organizedData: TOrganizedData = {
        senderId: id,
        receiverId: owner.id,
        swapType: data.swapType,
        note: data.note,
        bookIdToSwapWith,
        askForGiveaway: false,
      };

      switch (data.swapType) {
        case SwapType.GIVEAWAY:
          organizedData.askForGiveaway = true;
          break;
        case SwapType.BYBOOKS:
          organizedData.swapOffer = { offeredBookId: data.selectedBook?.id };
          break;
        case SwapType.BYGENRES:
        case SwapType.OPENTOOFFERS:
          if (data.selectedBook) {
            const message = t('swap.offerMessage', { bookTitle: data.selectedBook.title });
            organizedData.note = organizedData.note
              ? `${organizedData.note}\n\n${message}`
              : message;
          }
          break;
        default:
          organizedData.swapOffer = { offeredBookId: data.selectedBook?.id };
          break;
      }

      swapRequest(organizedData)
        .then((res) => {
          if (res.data) {
            handleCloseModal();
          }
        })
        .catch(() => {
          // Error is handled by RTK Query and displayed via errorMessage state
        });
    },
    [id, owner.id, bookIdToSwapWith, swapRequest, handleCloseModal, t],
  );

  // =========== DERIVED VALUES ===========
  const isSendDisabled = useMemo(
    () =>
      !selectedBook &&
      currentSwapType !== SwapType.GIVEAWAY &&
      currentSwapType !== SwapType.OPENTOOFFERS,
    [selectedBook, currentSwapType],
  );

  // =========== EFFECTS ===========
  // Reset selected book when swap type changes
  useEffect(() => {
    if (currentSwapType !== SwapType.BYBOOKS && selectedBook) {
      setValue('selectedBook', undefined);
    }
  }, [currentSwapType]);

  // Reset swap request on success
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        SwapRequestReset();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  // Set filter genres when available
  useEffect(() => {
    if (swappableGenresLength) {
      const genreNames = swappableGenres.map((item: any) => item.name);
      dispatch(setSwapFilterGenre(genreNames));
    }
  }, [swappableGenres]);

  // Handle error message
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

  // =========== RENDER LOGIC ===========
  if (loading) return <SwapRequestSkeleton />;
  return (
    <>
      <RequestProcessingAnimation isLoading={isLoading} />
      <RequestSuccessAnimation isSuccess={isSuccess} />
      <RequestFailedAnimation isFailed={!!errorMessage} />
      <div
        className={`${
          swapModalOpen ? 'block' : 'hidden'
        } bg-black bg-opacity-50 inset-0 w-full h-screen fixed -top-0 left-0 z-[999999999] flex items-center justify-center`}
      >
        <div className="w-11/12 lg:w-8/12 xl:w-1/2 max-h-[80vh] bg-white rounded-md overflow-y-auto">
          <ModalHeader onClose={handleCloseModal} />
          <div className="px-[14px] lg:p-6 pb-2 mt-4 lg:mt-0 flex flex-col lg:flex-row lg:gap-6">
            <BookImage coverPhotoUrls={coverPhotoUrls} title={title} />
            <div className="w-full lg:max-w-[65%] xl:w-7/12">
              <div className="hidden lg:block ">
                <SwapBookInformation />
              </div>
              <ConditionDisplay conditionItem={conditionItem} />
              <GenreTags swappableGenres={swappableGenres} />

              <FormProvider {...methods}>
                <form onSubmit={handleSubmit((data) => handleSwapRequest(data))}>
                  <div className="-mt-3">
                    <SwapFormControllers
                      swapType={swapType}
                      swappableBooks={swappableBooks}
                      books={books}
                      data={data?._embedded?.books}
                    />
                  </div>
                  <Line className="mt-2 bg-AntiFlashWhite" />
                  <div>
                    <InputLabel label={t('swap.shortNote')} className="mt-3 lg:mt-0 lg:mb-2" />
                    <ControlledInputField
                      type="textarea"
                      name="note"
                      placeholder={t('swap.writeShortNote')}
                      className="rounded-md h-[83px] bg-white"
                    />
                  </div>
                  {!!errorMessage && (
                    <div className="mt-3">
                      <MessageToastify isShow={true} type={ERROR} value={errorMessage} />
                    </div>
                  )}
                  <SubmitButton disabled={isSendDisabled} />
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
