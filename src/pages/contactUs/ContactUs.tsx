import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import contactFrame from '../../assets/contactFrame.png';
import Button from '../../components/shared/Button';
import ControlledInputField from '../../components/shared/ControllerField';
import InputLabel from '../../components/shared/InputLabel';
import { showToast } from '../../components/shared/toast';
import { useSubmitFormMutation } from '../../redux/feature/form/formApi';
import BookAddUpdateHeader from '../addUpdateBook/_components/BookAddUpdateHeader';
import contactUsSchema from './schema/index';

export default function ContactUs() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [submitForm, { isLoading }] = useSubmitFormMutation();
  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(contactUsSchema),
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: {
    name: string;
    email: string;
    subject: string;
    description: string;
  }) => {
    try {
      await submitForm({
        type: 'contact',
        data: {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.description,
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
        <BookAddUpdateHeader onBack={() => navigate(-1)} title={t('contactus.header')} />
      </div>

      <div className="bg-lightGray container  pt-12 lg:pt-[4.5rem] min-h-[86vh] font-poppins lg:bg-white rounded-lg ">
        <div className="w-full lg:w-[70%] mx-auto  ">
          <h2 className="text-[16px] lg:text-[32px] font-medium lg:font-semibold  leading-[40px]  ">
            {t('contactus.header')}
          </h2>

          <p className="w-full block pt-3 lg:pt-4 pb-6 lg:pb-8 font-normal lg:font-light text-[14px] leading-[16px] lg:leading-5 tracking-[0px] text-grayDark ">
            {t('contactus.subtitle')}
          </p>

          <div className="w-full lg:max-w-lg  ">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className=" mb-6 ">
                  <InputLabel label={t('contactus.name')} />
                  <ControlledInputField
                    name="name"
                    placeholder={t('contactus.namePlaceholder')}
                    className="rounded-md border-gray text-[14px] leading-[20px]  hover:border-blue-500 focus:border-blue-500 focus:outline-none"
                    showErrorMessage
                  />
                </div>
                <div className=" mb-6 ">
                  <InputLabel label={t('contactus.email')} />
                  <ControlledInputField
                    name="email"
                    placeholder={t('contactus.emailPlaceholder')}
                    className="rounded-md border-gray text-[14px] leading-[20px] hover:border-blue-500 focus:border-blue-500 focus:outline-none"
                    showErrorMessage
                  />
                </div>
                <div className=" mb-6 ">
                  <InputLabel label={t('contactus.subject')} />
                  <ControlledInputField
                    name="subject"
                    placeholder={t('contactus.subjectPlaceholder')}
                    className="rounded-md border-gray text-[14px] leading-[20px] hover:border-blue-500 focus:border-blue-500 focus:outline-none"
                    showErrorMessage
                  />
                </div>
                <div className=" mb-6 ">
                  <InputLabel label={t('contactus.message')} />
                  <ControlledInputField
                    type="textarea"
                    name="description"
                    placeholder={t('contactus.messagePlaceholder')}
                    className="rounded-md min-h-[122px] border-gray hover:border-blue-500 focus:border-blue-500 focus:outline-none"
                    showErrorMessage
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full lg:w-[151px] lg:h-[48px] text-[16px] lg:text-[14px] leading-5 font-medium bg-primary text-white py-4 px-6 rounded-lg mb-14 lg:mb-0 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? t('loading') : t('contactus.submit')}
                </Button>
              </form>
            </FormProvider>
          </div>

          <div className="hidden lg:block mt-14  ">
            <div className="w-full max-w-2xl bg-white mb-8">
              <h3 className="font-semibold text-[22px] leading-[28px] mb-4 ">
                {t('contactus.contactInfo')}
              </h3>

              <p className="font-normal text-[16px] leading-[24px] mb-4 tracking-[0px] font-poppins mr-2">
                Address: {t('contactus.address')}
              </p>

              <p className="font-normal text-[16px] leading-[24px] mb-4 tracking-[0px] font-poppins mr-2">
                {t('contactus.phone')}:{' '}
                <a href="tel:+358408536161" className="">
                  +358408536161
                </a>
              </p>
              <p className="font-normal text-[16px] leading-[24px] mb-6 tracking-[0px] font-poppins mr-2">
                {t('email')}:{' '}
                <a href="mailto:info@kirjaswappi.fi" className="">
                  info@kirjaswappi.fi
                </a>
              </p>
            </div>
            <img
              src={contactFrame}
              alt={t('contactus.contactMapAlt')}
              className="w-full max-w-2xl rounded-lg object-cover pb-16 "
            />
          </div>
        </div>
      </div>
    </div>
  );
}
