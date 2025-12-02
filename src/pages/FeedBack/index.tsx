import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SectionWithForm from '../../components/shared/SectionWithForm';
import BookAddUpdateHeader from '../addUpdateBook/_components/BookAddUpdateHeader';
import FeedbackForm from './form/FeedbackForm';

import feedbackImage from '../../assets/feedback.jpg';

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

          <p className="w-full block lg:hidden pt-3 pb-6 font-normal text-[10px] leading-[16px] lg:leading-6 tracking-[0px] text-grayDark ">
            {t('feedback.subtitle')}
          </p>

          <SectionWithForm imageSrc={feedbackImage}>
            <FormProvider {...methods}>
              <FeedbackForm />
            </FormProvider>
          </SectionWithForm>
        </div>
      </div>
    </div>
  );
}
