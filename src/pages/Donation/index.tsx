import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SectionWithForm from '../../components/shared/SectionWithForm';
import { showToast } from '../../components/shared/toast';
import { useSubmitFormMutation } from '../../redux/feature/form/formApi';
import BookAddUpdateHeader from '../addUpdateBook/_components/BookAddUpdateHeader';
import DonationForm from './form/DonationForm';

import donationImage from '../../assets/donationImage.jpg';

export default function Donation() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [submitForm, { isLoading }] = useSubmitFormMutation();

  const methods = useForm();

  const onSubmit = async (data: Record<string, string>) => {
    try {
      await submitForm({
        type: 'donation',
        data: {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.description || '',
          amount: data.askingAmount,
        },
      }).unwrap();
      showToast('success', t('contactus.success'));
      methods.reset();
    } catch {
      showToast('error', t('contactus.error'));
    }
  };

  return (
    <div className="  my-6">
      <div className="lg:hidden">
        <BookAddUpdateHeader onBack={() => navigate(-1)} title={t('donation.header')} />
      </div>

      <div className="bg-lightGray container pb-5 lg:pb-0  pt-10 lg:pt-[4.5rem] min-h-[86vh] font-poppins lg:bg-white rounded-lg ">
        <div className="w-full lg:w-[70%] mx-auto  ">
          <h2 className="text-[16px] lg:text-[32px] font-medium lg:font-semibold  leading-[40px]  ">
            {t('donation.heading')}
          </h2>

          <p className="w-full block lg:hidden pt-3 pb-6 font-normal text-[10px] leading-[16px] lg:leading-6 tracking-[0px] text-grayDark ">
            {t('donation.subtitle')}
          </p>

          <SectionWithForm imageSrc={donationImage}>
            <FormProvider {...methods}>
              <DonationForm onSubmit={methods.handleSubmit(onSubmit)} isLoading={isLoading} />
            </FormProvider>
          </SectionWithForm>
        </div>
      </div>
    </div>
  );
}
