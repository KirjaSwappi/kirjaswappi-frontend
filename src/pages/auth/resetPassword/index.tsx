import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authShape from '../../../assets/authShape.png';
import leftArrowIcon from '../../../assets/leftArrow.png';
import logo from '../../../assets/logo.png';
import Button from '../../../components/shared/Button';
import Image from '../../../components/shared/Image';
import MessageToastify from '../../../components/shared/MessageToastify';
import OTP from '../../../components/shared/OTP';
import { ERROR, SUCCESS } from '../../../constant/MESSAGETYPE';
import { showToast } from '../../../components/shared/toast';
import {
  useSentOTPMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
} from '../../../redux/feature/auth/authApi';
import { setAuthMessage, setError, setOtp } from '../../../redux/feature/auth/authSlice';
import { setMessages } from '../../../redux/feature/notification/notificationSlice';
import { setStep } from '../../../redux/feature/step/stepSlice';
import { useAppSelector } from '../../../redux/hooks';
import GetOTPByEmail from './_component/GetOTPByEmail';
import NewPassword from './_component/NewPassword';
interface INewPassForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [sentOTP] = useSentOTPMutation();
  const [verifyOTP] = useVerifyOTPMutation();
  const [resetPassword] = useResetPasswordMutation();
  const navigate = useNavigate();

  const { messageType, message: msg, isShow } = useAppSelector((state) => state.notification);
  const { loading, error, message, otp } = useAppSelector((state) => state.auth);
  const { step } = useAppSelector((state) => state.step);

  const [userPass, setUserPass] = useState<INewPassForm>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [resetToken, setResetToken] = useState<string>('');
  const [errors, setErrors] = useState<{
    [key: string]: string | null | undefined;
  }>({});

  // Filtered Error
  const fieldError = Object.keys(errors).map((key) => errors[key]);
  const filteredError = fieldError.filter((msg) => msg);

  // handle Change function to take sign-up information
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserPass({ ...userPass, [name]: value });
    setErrors({ ...errors, [name]: '' });
    // validateInput(e);
    dispatch(setError(''));
    dispatch(setMessages({ message: '', type: '', isShow: false }));
  };

  const validatePasswordStrength = (value: string): string | null => {
    if (value.length < 8) return t('validation.passwordMinLength');
    if (!/[A-Z]/.test(value)) return t('validation.passwordUppercase');
    if (!/[a-z]/.test(value)) return t('validation.passwordLowercase');
    if (!/[0-9]/.test(value)) return t('validation.passwordNumber');
    return null;
  };

  // Handle Input validation (onBlur)
  const validateInput = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prev: { [key: string]: string | null | undefined }) => {
      const stateObj = { ...prev, [name]: '' };
      if (step === 0) {
        if (name === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!value) {
            stateObj[name] = t('validation.emailRequired');
          } else if (!emailRegex.test(value)) {
            stateObj[name] = t('validation.emailInvalid');
          }
        }
      } else if (step === 2) {
        if (name === 'password') {
          if (!value) {
            stateObj[name] = t('validation.newPasswordRequired');
          } else {
            const strengthError = validatePasswordStrength(value);
            if (strengthError) {
              stateObj[name] = strengthError;
            } else if (userPass.confirmPassword && value !== userPass.confirmPassword) {
              stateObj['confirmPassword'] = t('validation.passwordsMustMatch');
            } else {
              stateObj['confirmPassword'] = userPass.confirmPassword ? '' : errors.confirmPassword;
            }
          }
        } else if (name === 'confirmPassword') {
          if (!value) {
            stateObj[name] = t('validation.confirmPasswordRequired');
          } else if (userPass.password && value !== userPass.password) {
            stateObj[name] = t('validation.passwordsMustMatch');
          }
        }
      }
      return stateObj;
    });
  };
  const validateStep = () => {
    let allValid = true;
    const newErrors: { [key: string]: string | null | undefined } = { ...errors };

    Object.keys(userPass).forEach((key) => {
      const typedKey = key as keyof INewPassForm;
      const value = userPass[typedKey];

      // Validate only the relevant fields for each step
      if (step === 0 && typedKey === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors[typedKey] = t('validation.emailRequired');
          allValid = false;
        } else if (!emailRegex.test(value)) {
          newErrors[typedKey] = t('validation.emailInvalid');
          allValid = false;
        } else {
          newErrors[typedKey] = '';
        }
      } else if (step === 2 && (typedKey === 'password' || typedKey === 'confirmPassword')) {
        if (typedKey === 'password') {
          if (!value) {
            newErrors[typedKey] = t('validation.newPasswordRequired');
            allValid = false;
          } else {
            const strengthError = validatePasswordStrength(value);
            if (strengthError) {
              newErrors[typedKey] = strengthError;
              allValid = false;
            } else if (userPass.confirmPassword && value !== userPass.confirmPassword) {
              newErrors['confirmPassword'] = t('validation.passwordsMustMatch');
              allValid = false;
            } else {
              newErrors['confirmPassword'] = userPass.confirmPassword ? '' : errors.confirmPassword;
            }
          }
        }
        if (typedKey === 'confirmPassword') {
          if (!value) {
            newErrors[typedKey] = t('validation.confirmPasswordRequired');
            allValid = false;
          } else if (userPass.password && value !== userPass.password) {
            newErrors[typedKey] = t('validation.passwordsMustMatch');
            allValid = false;
          }
        }
      }
    });

    setErrors(newErrors);
    return allValid;
  };

  const handleSendOTP = async () => {
    try {
      const res = await sentOTP({ email: userPass.email });
      if (res?.data) {
        const timer = setTimeout(() => {
          dispatch(setMessages({ type: '', isShow: false, message: '' }));
          dispatch(setAuthMessage(''));
          dispatch(setStep(step + 1));
        }, 2000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      showToast('error', t('resetPassword.otpFailed'));
    }
  };

  const handleVerifyOTP = async () => {
    if (userPass.email && otp.join('') && otp.join('').length >= 6) {
      try {
        const res = await verifyOTP({ email: userPass.email, otp: otp.join('') });
        if (res?.data) {
          if (res.data.resetToken) {
            setResetToken(res.data.resetToken);
          }
          const timer = setTimeout(() => {
            dispatch(setMessages({ type: '', isShow: false, message: '' }));
            dispatch(setAuthMessage(''));
            dispatch(setStep(step + 1));
          }, 2000);
          return () => clearTimeout(timer);
        }
      } catch (error) {
        showToast('error', t('resetPassword.verifyFailed'));
      }
    } else {
      dispatch(
        setMessages({
          type: ERROR,
          isShow: true,
          message: t('resetPassword.otpRequired'),
        }),
      );
    }
  };

  const handleResetPassword = async () => {
    const resetObj = {
      newPassword: userPass.password,
      confirmPassword: userPass.confirmPassword,
      email: userPass.email,
      resetToken,
    };
    try {
      const res = await resetPassword(resetObj);
      if (res?.data) {
        const timer = setTimeout(() => {
          dispatch(setMessages({ type: '', isShow: false, message: '' }));
          dispatch(setAuthMessage(''));
          navigate('/auth/login');
          dispatch(setStep(0));
          dispatch(setOtp(Array(6).fill('')));
        }, 2000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      showToast('error', t('resetPassword.resetFailed'));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateStep()) return;
    if (step === 0) {
      await handleSendOTP();
    } else if (step === 1) {
      await handleVerifyOTP();
    } else if (step === 2) {
      await handleResetPassword();
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <GetOTPByEmail
            userInfo={userPass}
            error={errors.email ?? undefined}
            handleChange={handleChange}
            validateInput={validateInput}
          />
        );
      case 1:
        return <OTP otpMessageShow={false} />;
      case 2:
        return (
          <NewPassword
            userPass={userPass}
            handleChange={handleChange}
            errors={errors}
            validateInput={validateInput}
          />
        );
      default:
        return null;
    }
  };

  const checkingFieldErrorOrApiError = () => {
    if (message && message !== null) {
      return {
        msg: message,
        type: SUCCESS,
        isShow: true,
      };
    }
    if ((error && error !== null) || filteredError.length > 0 || msg !== '') {
      return {
        msg: error || filteredError[0] || msg,
        type: ERROR,
        isShow: true,
      };
    }
    return {
      isShow: false,
      msg: '',
      type: '',
    };
  };

  useEffect(() => {
    const { isShow, msg, type } = checkingFieldErrorOrApiError();
    if (isShow && msg) {
      dispatch(setMessages({ type, isShow, message: msg }));
    } else {
      dispatch(setMessages({ type: '', isShow: false, message: '' }));
    }
  }, [filteredError, error, message, msg]);

  // clean-up
  useEffect(() => {
    dispatch(setMessages({ type: '', isShow: false, message: '' }));
    dispatch(setError(''));
  }, [location.pathname, dispatch]);

  return (
    <div>
      <div className="container lg:bg-white min-h-svh lg:min-h-[calc(100vh-128px)] relative lg:rounded-lg lg:grid lg:grid-cols-2 lg:mt-5 overflow-hidden">
        <div className="hidden bg-primary-light lg:flex flex-col items-center justify-center">
          <Image src={authShape} alt="auth shape" className="max-w-[396px] mb-14" />
          <Image src={logo} alt="logo" className="max-w-[310px]" />
          <p className="text-center text-grayDark text-xs px-20 mt-5">{t('auth.tagline')}</p>
        </div>
        <div className="flex flex-col justify-center lg:px-20">
          <div className="lg:hidden pt-4 pb-6 flex items-center gap-2">
            <button
              className="cursor-pointer w-5 border-0 bg-transparent p-0"
              onClick={() => {
                if (step === 0) {
                  navigate('/auth/login');
                } else {
                  dispatch(setStep(step - 1));
                  dispatch(setError(''));
                }
              }}
              aria-label="Go back"
            >
              <Image src={leftArrowIcon} alt="left" />
            </button>
            <h3 className="font-poppins text-base font-medium ">{t('resetPassword.title')}</h3>
          </div>
          {
            <form
              onSubmit={(e) => handleSubmit(e)}
              className={`${
                step === 1
                  ? 'bg-white absolute lg:static bottom-0 left-0 w-full h-[80vh] lg:h-auto rounded-t-3xl'
                  : ''
              }`}
            >
              {step === 1 && (
                <div className="text-center py-6 border-b border-[#E6E6E6] lg:hidden">
                  <h1>{t('resetPassword.confirmEmail')}</h1>
                </div>
              )}
              <div className={`${step === 1 && 'px-6'}`}>
                {step === 1 && (
                  <p className="text-sm font-light font-poppins text-center pt-8 pb-10">
                    {t('resetPassword.enterCode')}
                  </p>
                )}
                {renderStepContent()}

                {isShow && (
                  <div className="mb-2 mt-2">
                    <MessageToastify isShow={isShow} type={messageType} value={msg} />
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full h-[48px] px-4 font-normal text-white bg-primary rounded-lg text-sm mt-4"
                >
                  {loading ? t('common.loadingEllipsis') : t('auth.continue')}
                </Button>
              </div>
            </form>
          }
        </div>
      </div>
    </div>
  );
}
