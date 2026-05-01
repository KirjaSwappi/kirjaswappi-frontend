import { useTranslation } from 'react-i18next';
import sendMessageIcon from '../../../../assets/sendMessageIcon.png';
import Button from '../../Button';
import Image from '../../Image';

const SubmitButton = ({
  disabled,
  isLoading = false,
}: {
  disabled: boolean;
  isLoading?: boolean;
}) => {
  const { t } = useTranslation();
  const buttonDisabled = disabled || isLoading;
  return (
    <div className="flex justify-center lg:justify-end pt-2 mt-5">
      <Button
        disabled={buttonDisabled}
        type="submit"
        className={`bg-primary text-white font-medium text-xs py-2 w-full lg:w-5/12 h-[48px] rounded-[8px] font-poppins flex justify-center items-center gap-2 mb-4 ${
          buttonDisabled ? 'opacity-40' : 'opacity-100'
        }`}
      >
        <Image src={sendMessageIcon} alt="Book" />{' '}
        {isLoading ? t('swap.sending', 'Sending...') : t('swap.sendRequest')}
      </Button>
    </div>
  );
};
export default SubmitButton;
