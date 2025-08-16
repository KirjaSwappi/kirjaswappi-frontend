import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import logo from '../../../assets/logo.png';
import { ILoginForm } from '../../../pages/auth/login/interface';
import { loginSchema } from '../../../pages/auth/login/Schema';
import { useLoginMutation } from '../../../redux/feature/auth/authApi';
import { setAuthMessage, setAuthSuccess } from '../../../redux/feature/auth/authSlice';
import { setMessages } from '../../../redux/feature/notification/notificationSlice';
import { setLoginModalOpen, setOpen } from '../../../redux/feature/open/openSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import ControlledInputField from '../ControllerField';
import ControlledPasswordField from '../ControllerFieldPassword';
import Image from '../Image';
import MessageToastify from '../MessageToastify';
import { showToast } from '../toast';
export default function LoginModal() {
  const dispatch = useAppDispatch();
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
      }, 2000);
      return () => clearTimeout(timer);
    } catch (error) {
      console.log('login error', error);
    }
  };
  const formErrors = methods.formState.errors;
  const firstFieldError = Object.values(formErrors)[0]?.message;

  const displayMessage = firstFieldError || authError || authMessage;
  const messageType = firstFieldError || authError ? 'ERROR' : 'SUCCESS';

  if (!loginModalOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-[400px] p-8 relative">
        <button
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-black"
          onClick={() => dispatch(setLoginModalOpen(false))}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex flex-col items-center mb-6">
          <Image src={logo} alt="KirjaSwappi" className="h-8 mb-2" />
        </div>
        <h2 className="text-black text-lg font-semibold text-center mb-4">Log In your account</h2>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <ControlledInputField name="email" placeholder="Email" />
            <ControlledPasswordField name="password" placeholder="Write Here" />

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
        <div className="flex items-center justify-center gap-1 mt-4">
          <p className="text-black text-sm font-light">Don’t have an account yet ?</p>
          <button
            className="text-primary text-sm font-light underline"
            onClick={() => {
              dispatch(setOpen(false));
              // You can navigate to register page here if needed
            }}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
