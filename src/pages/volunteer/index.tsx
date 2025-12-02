import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BookAddUpdateHeader from '../addUpdateBook/_components/BookAddUpdateHeader';

import { FormProvider, useForm } from 'react-hook-form';
import SectionWithForm from '../../components/shared/SectionWithForm';
import VolunteerForm from './form/VolunteerForm';

import volunteerImage from '../../assets/volunteer.jpg';

export default function Volunteer() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const methods = useForm();

  return (
    <div className="  my-6">
      <div className="lg:hidden">
        <BookAddUpdateHeader onBack={() => navigate(-1)} title={t('volunteer.header')} />
      </div>

      <div className="bg-lightGray container  pt-10 lg:pt-[4.5rem] pb-8 lg:pb-[7rem] font-poppins lg:bg-white rounded-lg ">
        <div className="w-full lg:w-[70%] mx-auto  ">
          <h2 className="text-[16px] lg:text-[32px] font-medium lg:font-semibold  leading-[40px]  ">
            {t('volunteer.heading')}
          </h2>

          <p className="w-full block lg:hidden pt-3 pb-6 font-normal text-[10px] leading-[16px] lg:leading-6 tracking-[0px] text-grayDark ">
            {t('volunteer.subtitle')}
          </p>

          <SectionWithForm imageSrc={volunteerImage}>
            <FormProvider {...methods}>
              <VolunteerForm />
            </FormProvider>
          </SectionWithForm>
        </div>
      </div>
    </div>
  );
}
