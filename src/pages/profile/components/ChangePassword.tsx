import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import leftArrowIcon from '../../../assets/leftArrow.png';
import Button from '../../../components/shared/Button';
import Image from '../../../components/shared/Image';
import PasswordInput from '../../../components/shared/PasswordInput';
import { showToast } from '../../../components/shared/toast';
import { useChangePasswordMutation } from '../../../redux/feature/auth/authApi';
import { useAppSelector } from '../../../redux/hooks';

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const validatePasswordStrength = (value: string): string | null => {
  if (value.length < 8) return 'Password must be at least 8 characters long.';
  if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter.';
  if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter.';
  if (!/[0-9]/.test(value)) return 'Password must contain at least one digit.';
  return null;
};

export default function ChangePassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userInformation } = useAppSelector((state) => state.auth);
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [form, setForm] = useState<ChangePasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateInput = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => {
      const next = { ...prev };
      if (name === 'currentPassword') {
        next[name] = !value ? t('changePassword.currentPassword') + ' is required.' : null;
      } else if (name === 'newPassword') {
        if (!value) {
          next[name] = 'Please enter new password.';
        } else {
          next[name] = validatePasswordStrength(value);
          if (!next[name] && form.confirmPassword && value !== form.confirmPassword) {
            next['confirmPassword'] = t('changePassword.mismatch');
          } else if (form.confirmPassword && value === form.confirmPassword) {
            next['confirmPassword'] = null;
          }
        }
      } else if (name === 'confirmPassword') {
        if (!value) {
          next[name] = 'Please enter confirm password.';
        } else if (form.newPassword && value !== form.newPassword) {
          next[name] = t('changePassword.mismatch');
        } else {
          next[name] = null;
        }
      }
      return next;
    });
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string | null } = {};
    if (!form.currentPassword) {
      newErrors.currentPassword = 'Current password is required.';
    }
    if (!form.newPassword) {
      newErrors.newPassword = 'Please enter new password.';
    } else {
      const strengthError = validatePasswordStrength(form.newPassword);
      if (strengthError) newErrors.newPassword = strengthError;
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please enter confirm password.';
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = t('changePassword.mismatch');
    }
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await changePassword({
        email: userInformation.email!,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      }).unwrap();
      showToast('success', t('changePassword.success'));
      navigate(-1);
    } catch {
      showToast('error', t('changePassword.failed'));
    }
  };

  return (
    <div>
      <div className="fixed left-0 top-0 w-full h-[48px] flex items-center justify-between px-4 border-b border-[#E4E4E4] bg-light z-30">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="w-5 bg-transparent border-none p-0 cursor-pointer"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <Image src={leftArrowIcon} alt="left" />
          </button>
          <h3 className="font-poppins text-base font-medium">{t('changePassword.title')}</h3>
        </div>
      </div>

      <div className="container pt-16 max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="font-poppins text-sm font-medium block mb-1">
              {t('changePassword.currentPassword')}
            </label>
            <PasswordInput
              id="currentPassword"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              onBlur={validateInput}
              placeholder={t('changePassword.currentPassword')}
              error={errors.currentPassword}
              className="rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="font-poppins text-sm font-medium block mb-1">
              {t('changePassword.newPassword')}
            </label>
            <PasswordInput
              id="newPassword"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              onBlur={validateInput}
              placeholder={t('changePassword.newPassword')}
              error={errors.newPassword}
              className="rounded-lg"
            />
          </div>
          <div className="mb-6">
            <label className="font-poppins text-sm font-medium block mb-1">
              {t('changePassword.confirmPassword')}
            </label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={validateInput}
              placeholder={t('changePassword.confirmPassword')}
              error={errors.confirmPassword}
              className="rounded-lg"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-[48px] px-4 font-normal text-white bg-primary rounded-2xl text-sm"
          >
            {isLoading ? 'Loading...' : t('changePassword.title')}
          </Button>
        </form>
      </div>
    </div>
  );
}
