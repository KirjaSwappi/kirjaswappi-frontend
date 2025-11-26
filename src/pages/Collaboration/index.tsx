import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BookAddUpdateHeader from '../addUpdateBook/_components/BookAddUpdateHeader';

import { FormProvider, useForm } from 'react-hook-form';
import Button from '../../components/shared/Button';
import ControlledInputField from '../../components/shared/ControllerField';
import InputLabel from '../../components/shared/InputLabel';

export default function Collaboration() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const methods = useForm();

  return (
    <div className="  mt-6 ">
      <div className="lg:hidden">
        <BookAddUpdateHeader onBack={() => navigate(-1)} title={t('collaboration.header')} />
      </div>

      <div className="bg-[#F5F7FA] container min-h-screen pb-24 font-poppins lg:bg-white lg:pt-14">
        <div className="py-8 w-[70%] mx-auto  ">
          <h2 className="text-[16px] lg:text-[32px] lg:font-semibold font-medium mb-3 leading-[40px] mt-10 lg:mt-0">
            {t('collaboration.heading')}
          </h2>

          <div className="  mt-8 flex justify-between items-start gap-x-10  ">
            {/* form section  */}
            <div>
              <FormProvider {...methods}>
                <form>
                  <div className="mt-4 pb-4 ">
                    <InputLabel label={t('name')} />
                    <ControlledInputField
                      name="name"
                      placeholder={t('collaboration.namePlaceholder')}
                      className="rounded-md border-gray text-[14px] leading-[20px]  hover:border-blue-500 focus:border-blue-500 focus:outline-none"
                      showErrorMessage
                    />
                  </div>
                  <div className="mt-4 pb-4">
                    <InputLabel label={t('email')} />
                    <ControlledInputField
                      name="email"
                      placeholder={t('collaboration.emailPlaceholder')}
                      className="rounded-md border-gray text-[14px] leading-[20px] hover:border-blue-500 focus:border-blue-500 focus:outline-none"
                      showErrorMessage
                    />
                  </div>
                  <div className="mt-4 pb-4 ">
                    <InputLabel label={t('collaboration.subject')} />
                    <ControlledInputField
                      name="subject"
                      placeholder={t('collaboration.subjectPlaceholder')}
                      className="rounded-md border-gray text-[14px] leading-[20px] hover:border-blue-500 focus:border-blue-500 focus:outline-none"
                      showErrorMessage
                    />
                  </div>
                  <div className="mt-4 pb-4 ">
                    <InputLabel label={t('collaboration.askingAmount')} />
                    <ControlledInputField
                      name="askingAmount"
                      placeholder={t('collaboration.askingAmountPlaceholder')}
                      className="rounded-md border-gray text-[14px] leading-[20px] hover:border-blue-500 focus:border-blue-500 focus:outline-none"
                      showErrorMessage
                    />
                  </div>
                  <div className="mt-4 pb-4">
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
                    className="w-full lg:w-[151px] lg:h-[48px] lg:text-[14px] bg-primary text-white py-3 rounded-lg mt-4 lg:mt-2"
                  >
                    {t('collaboration.submit')}
                  </Button>
                </form>
              </FormProvider>
            </div>

            {/* image section  */}
            <div className=" bg-red w-[450px] aspect-[4/3] rounded-lg overflow-hidden  ">
              <img
                src="https://i.postimg.cc/TYQhzjd1/35240a629051b39fc0255c41172fcb57ce867969.jpg"
                alt="sectionImg"
                className=" w-full h-full "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
