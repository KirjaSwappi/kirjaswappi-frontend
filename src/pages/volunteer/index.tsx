import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BookAddUpdateHeader from '../addUpdateBook/_components/BookAddUpdateHeader';

import { FormProvider, useForm } from 'react-hook-form';
import SectionWithForm from '../../components/shared/SectionWithForm';
import VolunteerForm from './form/VolunteerForm';

export default function Volunteer() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const methods = useForm();

  return (
    <div className="  my-6">
      <div className="lg:hidden">
        <BookAddUpdateHeader onBack={() => navigate(-1)} title={t('volunteer.header')} />
      </div>

      <div className="bg-[#F5F7FA] container  font-poppins lg:bg-white pb-20 lg:pb-0 lg:pt-14 ">
        <div className="py-8 w-full lg:w-[70%] mx-auto  ">
          <h2 className="text-[20px] lg:text-[32px] lg:font-semibold font-medium mb-3 leading-[28px] lg:leading-[40px] mt-10 lg:mt-0">
            {t('volunteer.heading')}
          </h2>

          <p className="w-full block lg:hidden font-normal text-[12px] lg:text-[14px] leading-[16px] lg:leading-6 tracking-[0px] text-[#808080] mb-8 whitespace-normal">
            {t('volunteer.subtitle')}
          </p>

          <SectionWithForm imageSrc="https://i.postimg.cc/TYQhzjd1/35240a629051b39fc0255c41172fcb57ce867969.jpg">
            <FormProvider {...methods}>
              <VolunteerForm />
            </FormProvider>
          </SectionWithForm>
        </div>
      </div>
    </div>
  );
}
