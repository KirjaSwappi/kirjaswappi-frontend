import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import { ILoginForm } from '../../../pages/auth/login/interface';
import { loginSchema } from '../../../pages/auth/login/Schema';
import { useLoginMutation } from '../../../redux/feature/auth/authApi';
import { setAuthMessage, setAuthSuccess } from '../../../redux/feature/auth/authSlice';
import { setMessages } from '../../../redux/feature/notification/notificationSlice';
import { setLoginModalOpen } from '../../../redux/feature/open/openSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import Button from '../Button';
import ControlledInputField from '../ControllerField';
import ControlledPasswordField from '../ControllerFieldPassword';
import GoogleLoginButton from '../GoogleLoginButton';
import Image from '../Image';
import InputLabel from '../InputLabel';
import MessageToastify from '../MessageToastify';
import { showToast } from '../toast';

export default function LoginModal() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error: authError, message: authMessage } = useAppSelector((state) => state.auth);
  const { loginModalOpen } = useAppSelector((state) => state.open);
  const [login, { isLoading }] = useLoginMutation();
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
        showToast('success', 'Login Successfully Done.');
        dispatch(setLoginModalOpen(false));
      }, 2000);
      return () => clearTimeout(timer);
    } catch (error) {
      // Login error handled by RTK Query
    }
  };
  const formErrors = methods.formState.errors;
  const firstFieldError = Object.values(formErrors)[0]?.message;

  const displayMessage = firstFieldError || authError || authMessage;
  const messageType = firstFieldError || authError ? 'ERROR' : 'SUCCESS';

  if (!loginModalOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-xl shadow-lg w-10/12 lg:max-w-[486px] relative">
        <div className="flex flex-row items-center justify-between p-4 lg:p-6 border-b border-platinum">
          <Image src={logo} alt="KirjaSwappi" className="h-6 lg:h-8 lg:mb-2" />
          <Button
            className="absolute right-6 lg:top-5 text-2xl w-8 h-8 border border-platinum rounded-full text-[#1A1A1A]"
            onClick={() => dispatch(setLoginModalOpen(false))}
            aria-label="Close"
          >
            &times;
          </Button>
        </div>

        <div className="p-4 lg:p-6 lg:mt-4">
          <h2 className="text-[#1A1A1A] text-base font-medium text-left mb-2 lg:mb-4 font-poppins">
            Log In your account
          </h2>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-3">
              <div>
                <InputLabel label="Email" className="mb-1 text-arsenic" />
                <ControlledInputField
                  name="email"
                  placeholder="Email"
                  showErrorMessage
                  className="!bg-transparent rounded-xl"
                />
              </div>
              <div>
                <InputLabel label="Password" className="mb-1 text-arsenic" />
                <ControlledPasswordField
                  name="password"
                  placeholder="Enter your password"
                  showErrorMessage
                  className="!bg-transparent rounded-xl"
                />
              </div>

              {displayMessage && (
                <div className="mt-2">
                  <MessageToastify isShow={true} type={messageType} value={displayMessage} />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[48px] px-4 font-normal text-white bg-primary rounded-2xl text-sm mt-2"
              >
                {isLoading ? 'Loading...' : 'Log In'}
              </button>
            </form>
          </FormProvider>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-platinum"></div>
            </div>
            <div className="relative flex justify-center text-xs font-poppins">
              <span className="bg-light lg:bg-white px-2 text-grayDark">Or</span>
            </div>
          </div>
          <GoogleLoginButton />
          <div className="flex items-center justify-center gap-1 mt-4">
            <p className="text-black text-sm font-light">Don’t have an account yet ?</p>
            <button
              className="text-primary text-sm font-light underline"
              onClick={() => {
                dispatch(setLoginModalOpen(false));
                navigate('/auth/register');
              }}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
