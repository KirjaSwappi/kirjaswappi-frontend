import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import OTPInput from 'react-otp-input';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../../../components/shared/Button';
import MessageToastify from '../../../../components/shared/MessageToastify';
import { ERROR, SUCCESS } from '../../../../constant/MESSAGETYPE';
import { useSentOTPMutation, useVerifyEmailMutation } from '../../../../redux/feature/auth/authApi';
import { setOtp } from '../../../../redux/feature/auth/authSlice';
import { setMessages } from '../../../../redux/feature/notification/notificationSlice';
import { setStep } from '../../../../redux/feature/step/stepSlice';
import { useAppSelector } from '../../../../redux/hooks';
import { otpSchema } from '../Schema';
import { OTPSchemaType } from '../interface';

export default function ConfirmOTP() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [sentOTP] = useSentOTPMutation();
  const { userEmail, otp } = useAppSelector((state) => state.auth);
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false);

  const {
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<OTPSchemaType>({
    resolver: yupResolver(otpSchema),
    defaultValues: { otp: otp.join('') },
    mode: 'onChange',
  });

  useEffect(() => setValue('otp', otp.join('')), [otp, setValue]);

  const handleOTPChange = (value: string) => {
    dispatch(setOtp(value.split('')));
    if (value.length === 0) setError('otp', { type: 'manual', message: 'OTP is required' });
    else if (errors.otp) clearErrors('otp');
  };

  const onSubmit = async ({ otp: otpString }: OTPSchemaType) => {
    setIsAutoSubmitting(true);
    try {
      const res = await verifyEmail({ email: userEmail, otp: otpString });
      if ('error' in res) {
        setError('otp', { type: 'manual', message: 'The OTP you entered is incorrect' });
      } else {
        dispatch(
          setMessages({ type: SUCCESS, isShow: true, message: 'Email verified successfully!' }),
        );
        setTimeout(() => {
          dispatch(setMessages({ type: '', isShow: false, message: '' }));
          dispatch(setOtp(Array(6).fill('')));
          navigate('/auth/login');
          dispatch(setStep(0));
        }, 3000);
      }
    } catch (err) {
      dispatch(
        setMessages({
          type: ERROR,
          isShow: true,
          message: 'An error occurred during verification',
        }),
      );
    } finally {
      setIsAutoSubmitting(false);
    }
  };

  return (
    <div className="bg-white absolute lg:static bottom-0 left-0 w-full rounded-t-3xl transition-all duration-500 ease-in-out transform translate-y-0 h-[80vh] lg:h-auto">
      <div className="text-center py-6 border-b border-[#E6E6E6]">
        <h1>Confirm your Email</h1>
      </div>
      <div className="px-6">
        <p className="text-sm font-light text-grayDark font-poppins text-center pt-8 pb-10">
          Enter the code we&apos;ve sent to your Email
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-2 justify-between mb-5">
            <OTPInput
              value={otp.join('')}
              onChange={handleOTPChange}
              numInputs={6}
              shouldAutoFocus
              inputType="text"
              renderInput={(props) => (
                <input
                  {...props}
                  maxLength={1}
                  inputMode="numeric"
                  placeholder="-"
                  className={`max-w-10 h-10 mb-5 bg-[#E7E7E7] ${
                    errors.otp ? 'border border-rose-500' : 'border border-[#D9D9D9]'
                  } rounded-md text-center text-base font-normal focus:outline-none transition-all duration-150`}
                  style={{
                    backgroundColor: '#E7E7E7',
                  }}
                />
              )}
              containerStyle={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            />
          </div>
          {errors.otp && <MessageToastify isShow type="ERROR" value={errors.otp.message} />}
          <Button
            type="submit"
            disabled={isLoading || isAutoSubmitting}
            className="text-white font-medium text-sm w-full bg-primary py-2 mt-3 rounded-lg"
          >
            {isLoading || isAutoSubmitting ? t('common.loadingEllipsis') : t('auth.otpVerify')}
          </Button>
        </form>
        <div className="flex items-center justify-center mt-10 gap-2 text-grayDark text-sm font-poppins">
          <p>Haven&apos;t received a code?</p>
          <Button className="underline text-sm" onClick={() => sentOTP({ email: userEmail })}>
            Send again
          </Button>
        </div>
      </div>
    </div>
  );
}
