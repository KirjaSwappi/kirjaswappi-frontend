import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BookAddUpdateHeader from '../addUpdateBook/_components/BookAddUpdateHeader';
import FeedbackForm from './form/FeedbackForm';

export default function Feedback() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const methods = useForm();

  return (
    <div className="  my-6">
      <div className="lg:hidden">
        <BookAddUpdateHeader onBack={() => navigate(-1)} title={t('feedback.header')} />
      </div>

      <div className="bg-lightGray container min-h-[86vh] pt-10 lg:pt-[4.5rem]  font-poppins lg:bg-white rounded-lg ">
        <div className="w-full lg:w-[70%] mx-auto  ">
          <h2 className="text-[16px] lg:text-[32px] font-medium lg:font-semibold  leading-[40px]  ">
            {t('feedback.heading')}
          </h2>

          <p className="w-full block pt-3 pb-6 font-normal text-[10px] lg:text-sm leading-[16px] lg:leading-6 tracking-[0px] text-grayDark ">
            {t('feedback.subtitle')}
          </p>

          <div className="w-full max-w-[600px] mt-8 bg-white lg:p-8 lg:border lg:border-platinumMix lg:rounded-xl lg:shadow-sm">
            <FormProvider {...methods}>
              <FeedbackForm />
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
