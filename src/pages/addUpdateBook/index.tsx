import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import yup from 'yup';
import NextArrowIcon from '../../assets/arrow1.png';
import PrevArrowIcon from '../../assets/arrow2.png';
import prevArrowIcon_3 from '../../assets/arrow_3.svg';
import Image from '../../components/shared/Image';
import Spinner from '../../components/shared/Spinner';
import {
  useAddBookMutation,
  useGetBookByIdQuery,
  useGetSupportConditionQuery,
  useGetSupportLanguageQuery,
  useUpdateBookMutation,
} from '../../redux/feature/book/bookApi';
import { options } from '../../utility/helper';
import { useGeolocation } from '../map/hooks/useGeolocation';
import Stepper from './_components/Stepper';
import { validationSchemas } from './Schema';

import { toast } from 'react-toastify';
import AddGenre from '../../components/shared/AddGenre';
import Button from '../../components/shared/Button';
import { useAppSelector } from '../../redux/hooks';
import BookAddUpdateHeader from './_components/BookAddUpdateHeader';
import BookFormStep from './_components/BookFormStep';
import { buildFormData, getDefaultValues } from './helper';
import { IAddUpdateBookData } from './types/interface';

export default function AddUpdateBook() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [active, setActive] = useState<number>(0);
  useGeolocation({ enabled: active >= 1 });
  const { userInformation } = useAppSelector((state) => state.auth);

  const { data: languageDataOptions, isLoading: languageLoading } =
    useGetSupportLanguageQuery(undefined);
  const { data: conditionDataOptions, isLoading: conditionLoading } =
    useGetSupportConditionQuery(undefined);
  const { data: bookData, isLoading: bookLoading } = useGetBookByIdQuery({ id: id }, { skip: !id });

  // ADD BOOK & UPDATE BOOK MUTATION
  const [addBook, { isLoading }] = useAddBookMutation();
  const [updateBook] = useUpdateBookMutation();

  const methods = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(validationSchemas[active] as yup.ObjectSchema<any>),
    mode: 'onChange',
    defaultValues: getDefaultValues(bookData),
  });
  const {
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = methods;

  // MEMORIZED LANGUAGE & CONDITION DATA
  const languages = useMemo(() => options(languageDataOptions), [languageDataOptions]);

  const conditions = useMemo(() => options(conditionDataOptions), [conditionDataOptions]);

  // LOAD BOOK DATA AFTER RELOAD THE BROWSER
  useEffect(() => {
    if (bookData) reset(getDefaultValues(bookData));
  }, [bookData, reset]);

  const [steps, setSteps] = useState([
    {
      labelKey: 'addBook.bookDetails',
      isCompleted: false,
      isActive: true,
    },
    {
      labelKey: 'addBook.otherDetails',
      isCompleted: false,
      isActive: false,
    },
    {
      labelKey: 'addBook.swapCondition',
      isCompleted: false,
      isActive: false,
    },
  ]);

  const handleNext = async () => {
    const valid = await trigger();
    if (valid) {
      setSteps((prevStep) =>
        prevStep.map((step, index) => {
          if (index === active) {
            return { ...step, isActive: false, isCompleted: true };
          } else if (index === active + 1) {
            return { ...step, isActive: true };
          }
          return { ...step, isActive: false };
        }),
      );
      setActive((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (active === 0) return;
    setSteps((prevStep) =>
      prevStep.map((step, index) => {
        if (index === active) {
          return { ...step, isActive: false };
        } else if (index === active - 1) {
          return { ...step, isActive: true };
        }
        return { ...step, isActive: false };
      }),
    );
    setActive((prev) => prev - 1);
  };

  const handleAddUpdateBookFn = async <T extends IAddUpdateBookData>(data: T) => {
    const formData = await buildFormData(data, userInformation.id, bookData?.id);
    try {
      const mutation = bookData?.id
        ? updateBook({ data: formData, id: bookData.id })
        : addBook(formData);

      await mutation.unwrap();
      toast.success(bookData?.id ? t('toast.bookUpdated') : t('toast.bookCreated'));
      navigate(`/profile/user-profile/${userInformation.id}`);
    } catch (error) {
      toast.error(t('toast.bookSaveFailed'));
    }
  };

  const loading = () => {
    if (languageLoading) return true;
    if (conditionLoading) return true;
    if (bookLoading) return true;
    else return false;
  };

  if (loading()) return <Spinner variant="overlay" />;

  return (
    <div className="lg:px-6 pb-6 lg:pt-6">
      <div className="container px-4 lg:px-0 lg:pt-[47px] lg:pr-7 xl:pr-[47px] 2xl:pr-48 bg-[#F2F4F8] lg:bg-white rounded-lg lg:min-h-[87vh] ">
        <div className="w-full">
          <BookAddUpdateHeader
            title={t('addBook.addBookTitle', { action: id ? t('update') : t('add') })}
            onBack={() => navigate(`/profile/user-profile/${userInformation.id}`)}
          />
          <div className="pt-7 lg:pt-0">
            <div>
              <div className="hidden lg:flex items-center pl-12 pb-6 xl:pb-14">
                <Button
                  className="cursor-pointer w-[42px] h-10 flex items-center justify-center rounded-lg bg-[#F5F6F7] border-none mr-2"
                  onClick={() => navigate(-1)}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(-1)}
                  aria-label="Go back"
                  type="button"
                >
                  <Image src={prevArrowIcon_3} alt="left" className="w-4 h-4" />
                </Button>
                <h3 className="font-poppins text-base font-bold text-[#19191C] ml-2 lg:text-2xl">
                  {t('addBook.addBookTitle', { action: id ? t('update') : t('add') })}
                </h3>
              </div>
              <div className="lg:flex xl:gap-28 pt-8 lg:pt-4 pb-3">
                <div className="w-full lg:w-[32%] xl:w-[30%] lg:pr-9">
                  <div className="relative flex justify-between gap-4 md:gap-6 lg:flex-col lg:border-r border-platinumMix h-full">
                    <Stepper steps={steps} />
                  </div>
                </div>
                <div className="w-full lg:w-[68%] xl:w-[70%]">
                  <FormProvider {...methods}>
                    <h1 className="font-poppins lg:mt-0 mb-2 font-semibold text-[20px] hidden lg:block">
                      {t(steps[active].labelKey)}
                    </h1>
                    <AddGenre
                      genresValue={active === 1 ? watch('genres') : watch('swappableGenres')}
                      setEditValuesChanged={() => {}}
                      setValue={setValue}
                      trigger={trigger}
                      addGenreName={active === 1 ? 'genres' : 'swappableGenres'}
                    />
                    <form onSubmit={handleSubmit((data) => handleAddUpdateBookFn(data))}>
                      <BookFormStep
                        activeStep={active}
                        errors={errors}
                        languages={languages}
                        conditions={conditions}
                      />
                      <div className="mt-4 flex justify-between gap-3 pb-12 lg:justify-end">
                        {active > 0 && (
                          <Button
                            onClick={handlePrev}
                            type="button"
                            className="bg-primary-light text-primary w-full lg:w-[112px] py-4 rounded-lg border border-primary flex items-center justify-center font-poppins text-base font-medium"
                          >
                            <Image src={PrevArrowIcon} alt="Next" className="w-4" /> {t('back')}
                          </Button>
                        )}
                        {active <= 1 && (
                          <Button
                            onClick={handleNext}
                            type="button"
                            className="bg-primary text-white w-full lg:w-[112px] py-4 rounded-lg flex items-center justify-center font-poppins text-base font-medium"
                          >
                            {t('next')} <Image src={NextArrowIcon} alt="Next" className="w-4" />
                          </Button>
                        )}
                        {active === 2 && (
                          <Button
                            disabled={isLoading}
                            type="submit"
                            className="bg-primary text-white w-full lg:w-[112px] py-4 rounded-lg"
                          >
                            {isLoading ? t('common.loadingEllipsis') : t('addBook.save')}
                          </Button>
                        )}
                      </div>
                    </form>
                  </FormProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
