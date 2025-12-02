import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SectionWithForm from '../../components/shared/SectionWithForm';
import BookAddUpdateHeader from '../addUpdateBook/_components/BookAddUpdateHeader';
import DonationForm from './form/DonationForm';

import donationImage from '../../assets/donationImage.jpg';

export default function Donation() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const methods = useForm();

  return (
    <div className="  my-6">
      <div className="lg:hidden">
        <BookAddUpdateHeader onBack={() => navigate(-1)} title={t('donation.header')} />
      </div>

      <div className="bg-lightGray container  pt-10 lg:pt-[4.5rem] pb-8 font-poppins lg:bg-white rounded-lg ">
        <div className="w-full lg:w-[70%] mx-auto  ">
          <h2 className="text-[16px] lg:text-[32px] font-medium lg:font-semibold  leading-[40px]  ">
            {t('donation.heading')}
          </h2>

          <p className="w-full block lg:hidden pt-3 pb-6 font-normal text-[10px] leading-[16px] lg:leading-6 tracking-[0px] text-grayDark ">
            {t('donation.subtitle')}
          </p>

          <SectionWithForm imageSrc={donationImage}>
            <FormProvider {...methods}>
              <DonationForm />
            </FormProvider>
          </SectionWithForm>
        </div>
      </div>
    </div>
  );
}
