import { useTranslation } from 'react-i18next';
import Input from '../../../../components/shared/Input';

interface GetOTPByEmailProps {
  userInfo: {
    email: string;
  };
  error?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validateInput: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export default function GetOTPByEmail({
  userInfo,
  error,
  handleChange,
  validateInput,
}: GetOTPByEmailProps) {
  const { t } = useTranslation();
  return (
    <div>
      <Input
        type="email"
        id="email"
        value={userInfo.email}
        name="email"
        onChange={handleChange}
        placeholder={t('auth.enterEmail')}
        error={error}
        className="rounded-lg"
        onBlur={validateInput}
      />
      <p className="mt-4 text-sm text-[#808080] font-light">{t('auth.otpWillBeSent')}</p>
    </div>
  );
}
