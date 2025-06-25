import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import bookDetailsBg from '../../../assets/bookdetailsbg.jpg';
import profileIcon from '../../../assets/profileIcon.png';
import ControlledInputField from '../../../components/shared/ControllerField';
import ControlledPasswordField from '../../../components/shared/ControllerFieldPassword';
import Image from '../../../components/shared/Image';
import MessageToastify from '../../../components/shared/MessageToastify';
import { useLoginMutation } from '../../../redux/feature/auth/authApi';
import { setAuthMessage, setAuthSuccess, setError } from '../../../redux/feature/auth/authSlice';
import { setMessages } from '../../../redux/feature/notification/notificationSlice';
import { useAppSelector } from '../../../redux/hooks';
import { ILoginForm } from './interface';
import { loginSchema } from './Schema';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { error: authError, message: authMessage } = useAppSelector((state) => state.auth);

  const methods = useForm<ILoginForm>({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: ILoginForm) => {
    const isValid = await methods.trigger();
    if (!isValid) return;

    try {
      await login(data).unwrap();
      const timer = setTimeout(() => {
        dispatch(setMessages({ type: '', isShow: false, message: '' }));
        dispatch(setAuthMessage(''));
        dispatch(setAuthSuccess(false));
      }, 2000);
      return () => clearTimeout(timer);
    } catch (error) {
      console.log('login error', error);
    }
  };

  useEffect(() => {
    dispatch(setMessages({ type: '', isShow: false, message: '' }));
    dispatch(setError(''));
  }, [navigate, dispatch]);

  const formErrors = methods.formState.errors;
  const firstFieldError = Object.values(formErrors)[0]?.message;

  // Use the first form error, or fall back to auth errors
  const displayMessage = firstFieldError || authError || authMessage;
  const messageType = firstFieldError || authError ? 'ERROR' : 'SUCCESS';

  return (
    <div className="relative font-poppins">
      <div className="absolute top-[18%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full bg-white flex items-center justify-center">
        <Image src={profileIcon || '/placeholder.svg'} />
      </div>
      <div className="w-full h-[124px] z-0">
        <Image src={bookDetailsBg || '/placeholder.svg'} className="w-full h-full" />
      </div>
      <div className="container h-[calc(80vh-128px)]">
        <div>
          <h2 className="text-black text-base font-normal text-center mt-24 mb-4">Sign In</h2>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col">
              <ControlledInputField name="email" placeholder="E-mail" className="rounded-t-lg" />
              <ControlledPasswordField
                name="password"
                placeholder="Password"
                className="rounded-b-lg border-t-0"
              />

              {displayMessage && (
                <div className="mt-2">
                  <MessageToastify isShow={true} type={messageType} value={displayMessage} />
                </div>
              )}

              <div className="flex items-center justify-between my-4">
                <div className="flex items-center gap-2 text-grayDark">
                  <input type="checkbox" name="remember" id="remember" className="cursor-pointer" />
                  <label
                    htmlFor="remember"
                    className="cursor-pointer text-sm font-light text-grayDark"
                  >
                    Remember me
                  </label>
                </div>
                <Link to="/password/reset" className="text-black font-light text-sm underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[48px] px-4 font-normal text-white bg-primary rounded-2xl text-sm"
              >
                {isLoading ? 'Loading...' : 'Continue'}
              </button>

              <div className="flex items-center justify-center gap-1 mt-4">
                <p className="text-black text-sm font-light">Don&apos;t have an account?</p>
                <button
                  className="text-black text-sm font-light underline"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/auth/register');
                  }}
                >
                  Create an account
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
