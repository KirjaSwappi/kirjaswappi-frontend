import { useTranslation } from 'react-i18next';
import Button from '../../../components/shared/Button';
import ControlledInputField from '../../../components/shared/ControllerField';
import InputLabel from '../../../components/shared/InputLabel';

export default function CollaborationForm() {
  const { t } = useTranslation();

  return (
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
  );
}
