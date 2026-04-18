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

const validatePasswordStrength = (value: string, t: (key: string) => string): string | null => {
  if (value.length < 8) return t('validation.passwordMinLength');
  if (!/[A-Z]/.test(value)) return t('validation.passwordUppercase');
  if (!/[a-z]/.test(value)) return t('validation.passwordLowercase');
  if (!/[0-9]/.test(value)) return t('validation.passwordNumber');
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
        next[name] = !value ? t('validation.currentPasswordRequired') : null;
      } else if (name === 'newPassword') {
        if (!value) {
          next[name] = t('validation.newPasswordRequired');
        } else {
          next[name] = validatePasswordStrength(value, t);
          if (!next[name] && form.confirmPassword && value !== form.confirmPassword) {
            next['confirmPassword'] = t('validation.passwordsMustMatch');
          } else if (form.confirmPassword && value === form.confirmPassword) {
            next['confirmPassword'] = null;
          }
        }
      } else if (name === 'confirmPassword') {
        if (!value) {
          next[name] = t('validation.confirmPasswordRequired');
        } else if (form.newPassword && value !== form.newPassword) {
          next[name] = t('validation.passwordsMustMatch');
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
      newErrors.currentPassword = t('validation.currentPasswordRequired');
    }
    if (!form.newPassword) {
      newErrors.newPassword = t('validation.newPasswordRequired');
    } else {
      const strengthError = validatePasswordStrength(form.newPassword, t);
      if (strengthError) newErrors.newPassword = strengthError;
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = t('validation.confirmPasswordRequired');
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = t('validation.passwordsMustMatch');
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
            <label
              htmlFor="currentPassword"
              className="font-poppins text-sm font-medium block mb-1"
            >
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
            <label htmlFor="newPassword" className="font-poppins text-sm font-medium block mb-1">
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
            <label
              htmlFor="confirmPassword"
              className="font-poppins text-sm font-medium block mb-1"
            >
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
            className="w-full h-[48px] px-4 font-normal text-white bg-primary rounded-lg text-sm"
          >
            {isLoading ? t('common.loadingEllipsis') : t('changePassword.title')}
          </Button>
        </form>
      </div>
    </div>
  );
}
