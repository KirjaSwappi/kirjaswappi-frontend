import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SectionWithForm from '../../components/shared/SectionWithForm';
import BookAddUpdateHeader from '../addUpdateBook/_components/BookAddUpdateHeader';
import DonationForm from './form/DonationForm';

export default function Donation() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const methods = useForm();

  return (
    <div className="  mt-6 ">
      <div className="lg:hidden">
        <BookAddUpdateHeader onBack={() => navigate(-1)} title={t('donation.header')} />
      </div>

      <div className="bg-[#F5F7FA] container min-h-screen pb-24 font-poppins lg:bg-white lg:pt-14">
        <div className="py-8 w-[70%] mx-auto  ">
          <h2 className="text-[16px] lg:text-[32px] lg:font-semibold font-medium mb-3 leading-[40px] mt-10 lg:mt-0">
            {t('donation.heading')}
          </h2>

          <SectionWithForm imageSrc="https://i.postimg.cc/TYQhzjd1/35240a629051b39fc0255c41172fcb57ce867969.jpg">
            <FormProvider {...methods}>
              <DonationForm />
            </FormProvider>
          </SectionWithForm>
        </div>
      </div>
    </div>
  );
}
