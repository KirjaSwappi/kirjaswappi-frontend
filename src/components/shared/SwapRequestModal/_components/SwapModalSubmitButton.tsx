import { useTranslation } from 'react-i18next';
import sendMessageIcon from '../../../../assets/sendMessageIcon.png';
import Button from '../../Button';
import Image from '../../Image';

const SubmitButton = ({ disabled }: { disabled: boolean }) => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center lg:justify-end pt-2 mt-5">
      <Button
        disabled={disabled}
        type="submit"
        className={`bg-primary text-white font-medium text-xs py-2 w-full lg:w-5/12 h-[48px] rounded-[8px] font-poppins flex justify-center items-center gap-2 mb-4 ${
          disabled ? 'opacity-40' : 'opacity-100'
        }`}
      >
        <Image src={sendMessageIcon} alt="Book" /> {t('swap.sendRequest')}
      </Button>
    </div>
  );
};
export default SubmitButton;
