import { useTranslation } from 'react-i18next';
import Button from '../../../components/shared/Button';
import ControlledInputField from '../../../components/shared/ControllerField';
import InputLabel from '../../../components/shared/InputLabel';

export default function DonationForm() {
  const { t } = useTranslation();

  return (
    <form>
      <div className=" mb-6 ">
        <InputLabel label={t('name')} />
        <ControlledInputField
          name="name"
          placeholder={t('donation.namePlaceholder')}
          className="rounded-md border-gray text-[14px] leading-[20px]  hover:border-blue-500 focus:border-blue-500 focus:outline-none"
          showErrorMessage
        />
      </div>
      <div className="mb-6 ">
        <InputLabel label={t('email')} />
        <ControlledInputField
          name="email"
          placeholder={t('donation.emailPlaceholder')}
          className="rounded-md border-gray text-[14px] leading-[20px] hover:border-blue-500 focus:border-blue-500 focus:outline-none"
          showErrorMessage
        />
      </div>
      <div className="mb-6  ">
        <InputLabel label={t('donation.subject')} />
        <ControlledInputField
          name="subject"
          placeholder={t('donation.subjectPlaceholder')}
          className="rounded-md border-gray text-[14px] leading-[20px] hover:border-blue-500 focus:border-blue-500 focus:outline-none"
          showErrorMessage
        />
      </div>
      <div className=" mb-6 ">
        <InputLabel label={t('donation.askingAmount')} />
        <ControlledInputField
          name="askingAmount"
          placeholder={t('donation.askingAmountPlaceholder')}
          className="rounded-md border-gray text-[14px] leading-[20px] hover:border-blue-500 focus:border-blue-500 focus:outline-none"
          showErrorMessage
        />
      </div>
      <div className=" mb-12 lg:mb-6 ">
        <InputLabel label={t('donation.message')} />
        <ControlledInputField
          type="textarea"
          name="description"
          placeholder={t('donation.messagePlaceholder')}
          className="rounded-md min-h-[122px] border-gray hover:border-blue-500 focus:border-blue-500 focus:outline-none"
          showErrorMessage
        />
      </div>
      <Button
        type="submit"
        className="w-full lg:w-[99px] lg:h-[48px] text-[16px] lg:text-[14px] leading-5 font-medium bg-primary text-white py-3 px-6 rounded-lg mb-14 lg:mb-0 "
      >
        {t('donation.submit')}
      </Button>
    </form>
  );
}
