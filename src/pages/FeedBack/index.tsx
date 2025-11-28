import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SectionWithForm from '../../components/shared/SectionWithForm';
import BookAddUpdateHeader from '../addUpdateBook/_components/BookAddUpdateHeader';
import FeedbackForm from './form/FeedbackForm';

export default function Feedback() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const methods = useForm();

  return (
    <div className="  mt-6 ">
      <div className="lg:hidden">
        <BookAddUpdateHeader onBack={() => navigate(-1)} title={t('feedback.header')} />
      </div>

      <div className="bg-[#F5F7FA] container min-h-screen pb-24 font-poppins lg:bg-white lg:pt-14">
        <div className="py-8 w-full lg:w-[70%] mx-auto  ">
          <h2 className="text-[20px] lg:text-[32px] lg:font-semibold font-medium mb-3 leading-[28px] lg:leading-[40px] mt-10 lg:mt-0">
            {t('feedback.heading')}
          </h2>

          <p className="w-full block lg:hidden font-normal text-[12px] lg:text-[14px] leading-[16px] lg:leading-6 tracking-[0px] text-[#808080] mb-8 whitespace-normal">
            {t('feedback.subtitle')}
          </p>

          <SectionWithForm imageSrc="https://i.postimg.cc/jj1bcg6c/73237aba83e1055f522168e3e5e4247769f0f95a.jpg">
            <FormProvider {...methods}>
              <FeedbackForm />
            </FormProvider>
          </SectionWithForm>
        </div>
      </div>
    </div>
  );
}
