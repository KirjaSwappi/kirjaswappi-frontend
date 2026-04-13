import { useTranslation } from 'react-i18next';
import Button from '../../../components/shared/Button';
import ControlledInputField from '../../../components/shared/ControllerField';
import InputLabel from '../../../components/shared/InputLabel';

interface FeedbackFormProps {
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export default function FeedbackForm({ onSubmit, isLoading }: FeedbackFormProps) {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit}>
      <div className=" mb-6 ">
        <InputLabel label={t('feedback.name')} />
        <ControlledInputField
          name="name"
          placeholder={t('feedback.namePlaceholder')}
          className="rounded-md border-gray text-[14px] leading-[20px]  hover:border-blue-500 focus:border-blue-500 focus:outline-none"
          showErrorMessage
        />
      </div>
      <div className=" mb-6 ">
        <InputLabel label={t('feedback.email')} />
        <ControlledInputField
          name="email"
          placeholder={t('feedback.emailPlaceholder')}
          className="rounded-md border-gray text-[14px] leading-[20px] hover:border-blue-500 focus:border-blue-500 focus:outline-none"
          showErrorMessage
        />
      </div>

      <div className=" mb-12 lg:mb-6 ">
        <InputLabel label={t('feedback.issue')} />
        <ControlledInputField
          type="textarea"
          name="description"
          placeholder={t('feedback.issuePlaceholder')}
          className="rounded-md min-h-[122px] border-gray hover:border-blue-500 focus:border-blue-500 focus:outline-none"
          showErrorMessage
        />
      </div>
      <Button
        type="submit"
        className="w-full lg:w-[99px] lg:h-[48px] text-[16px] lg:text-[14px] leading-5 font-medium bg-primary text-white py-3 px-6 rounded-lg mb-14 lg:mb-0 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? t('loading') : t('feedback.submit')}
      </Button>
    </form>
  );
}
