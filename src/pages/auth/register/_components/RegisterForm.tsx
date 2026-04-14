import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/shared/Button';
import MessageToastify from '../../../../components/shared/MessageToastify';
import { useRegisterMutation } from '../../../../redux/feature/auth/authApi';
import {
  setAuthMessage,
  setError,
  setOtp,
  setUserEmail,
} from '../../../../redux/feature/auth/authSlice';
import { setMessages } from '../../../../redux/feature/notification/notificationSlice';
import { setStep } from '../../../../redux/feature/step/stepSlice';
import { useAppSelector } from '../../../../redux/hooks';
import ControlledPasswordField from '../../../../components/shared/ControllerFieldPassword';
import ControlledInputField from '../../../../components/shared/ControllerField';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../Schema';
import { IRegisterForm } from '../interface';

export default function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const { error, message } = useAppSelector((state) => state.auth);
  const { step } = useAppSelector((state) => state.step);

  const methods = useForm<IRegisterForm>({
    resolver: yupResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    reValidateMode: 'onChange',
  });
  const [password, confirmPassword] = useWatch({
    control: methods.control,
    name: ['password', 'confirmPassword'],
  });

  useEffect(() => {
    if (password && confirmPassword && password === confirmPassword) {
      methods.clearErrors('confirmPassword');
    }
  }, [password, confirmPassword, methods]);
  const formErrors = methods.formState.errors;
  const firstFieldError = Object.values(formErrors)[0]?.message;
  const displayMessage = firstFieldError || error || message;
  const messageType = firstFieldError || error ? 'ERROR' : 'SUCCESS';
  const onSubmit = async (data: IRegisterForm) => {
    const isValid = await methods.trigger();
    if (!isValid) return;

    try {
      await register(data).then(async (res) => {
        if ('data' in res) {
          const timer = setTimeout(() => {
            dispatch(
              setMessages({
                type: '',
                isShow: false,
                message: '',
              }),
            );
            dispatch(setAuthMessage(''));
            dispatch(setUserEmail(data.email));
            dispatch(setOtp(Array(6).fill('')));
            dispatch(setStep(step + 1));
          }, 2000);
          return () => clearTimeout(timer);
        }
      });
    } catch (error) {
      // Registration error handled by RTK Query
    }
  };
  useEffect(() => {
    dispatch(setMessages({ type: '', isShow: false, message: '' }));
    dispatch(setError(''));
  }, [navigate, dispatch]);

  return (
    <div className="flex flex-col">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col">
          <div className="font-poppins">
            <div>
              <ControlledInputField
                name="firstName"
                placeholder="First Name"
                className="rounded-t-lg"
              />
            </div>
            <div>
              <ControlledInputField
                name="lastName"
                placeholder="Last Name"
                className="border-t-0 focus:border-t"
              />
            </div>
            <div>
              <ControlledInputField
                name="email"
                placeholder="E-mail"
                className="border-t-0 focus:border-t"
              />
            </div>
            <div>
              <ControlledPasswordField
                name="password"
                placeholder="Password"
                className="border-t-0 focus:border-t"
              />
            </div>
            <div>
              <ControlledPasswordField
                name="confirmPassword"
                placeholder="Confirm Password"
                className="rounded-b-lg border-t-0 focus:border-t"
              />
            </div>
          </div>

          {displayMessage && (
            <div className="mt-2">
              <MessageToastify isShow={true} type={messageType} value={displayMessage} />
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-[48px] px-4 font-normal text-white bg-primary rounded-2xl text-sm"
          >
            {isLoading ? 'Loading...' : 'Continue'}
          </Button>
          <div className="flex items-center justify-center gap-1 mt-4">
            <p className="text-black text-sm font-light font-poppins">Already have an account?</p>
            <button
              className="text-black text-sm font-light font-poppins underline"
              onClick={(e) => {
                e.preventDefault();
                navigate('/auth/login');
              }}
            >
              Log In
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
