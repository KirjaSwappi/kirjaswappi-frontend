import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import authShape from '../../../assets/authShape.png';
import bookDetailsBg from '../../../assets/bookdetailsbg.jpg';
import logo from '../../../assets/logo.png';
import profileIcon from '../../../assets/profileIcon.png';
import ControlledInputField from '../../../components/shared/ControllerField';
import ControlledPasswordField from '../../../components/shared/ControllerFieldPassword';
import GoogleLoginButton from '../../../components/shared/GoogleLoginButton';
import Image from '../../../components/shared/Image';
import MessageToastify from '../../../components/shared/MessageToastify';
import PageTitle from '../../../components/shared/PageTitle';
import { showToast } from '../../../components/shared/toast';
import { useLoginMutation } from '../../../redux/feature/auth/authApi';
import { setAuthMessage, setAuthSuccess, setError } from '../../../redux/feature/auth/authSlice';
import { setMessages } from '../../../redux/feature/notification/notificationSlice';
import { useAppSelector } from '../../../redux/hooks';
import { safeReturnPath } from '../../../utility/safeReturnPath';
import { ILoginForm } from './interface';
import { loginSchema } from './Schema';
export default function Login() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
      setTimeout(() => {
        dispatch(setMessages({ type: '', isShow: false, message: '' }));
        dispatch(setAuthMessage(''));
        dispatch(setAuthSuccess(false));
        showToast('success', t('toast.loginSuccess'));
      }, 2000);
      navigate(safeReturnPath(searchParams.get('returnTo')), { replace: true });
    } catch (error) {
      // Login error handled by RTK Query
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
    <div className=" relative font-poppins">
      <PageTitle title={t('auth.login')} />
      <div className="lg:hidden absolute top-[18%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full bg-white flex items-center justify-center">
        <Image src={profileIcon || '/placeholder.svg'} />
      </div>
      <div className="lg:hidden w-full h-[124px] z-0">
        <Image src={bookDetailsBg || '/placeholder.svg'} className="w-full h-full" />
      </div>
      <div className="lg:bg-white container h-[calc(80vh-128px)] lg:min-h-[calc(100vh-128px)] lg:rounded-lg lg:grid lg:grid-cols-2 lg:mt-5 overflow-hidden">
        <div className="hidden bg-primary-light lg:flex flex-col items-center justify-center">
          <Image src={authShape} alt="auth shape" className="max-w-[396px] mb-14" />
          <Image src={logo} alt="logo" className="max-w-[310px]" />
          <p className="text-center text-grayDark text-xs px-20 mt-5">{t('auth.tagline')}</p>
        </div>
        <div className="flex flex-col justify-center lg:px-20">
          <div>
            <h2 className="text-black text-base font-normal text-center mt-24 lg:mt-0 mb-4">
              {t('auth.signIn')}
            </h2>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col">
                <ControlledInputField
                  name="email"
                  placeholder={t('auth.email')}
                  className="rounded-t-lg"
                />
                <ControlledPasswordField
                  name="password"
                  placeholder={t('auth.password')}
                  className="rounded-b-lg border-t-0"
                />

                {displayMessage && (
                  <div className="mt-2">
                    <MessageToastify isShow={true} type={messageType} value={displayMessage} />
                  </div>
                )}

                <div className="flex items-center justify-end my-4">
                  <Link to="/password/reset" className="text-black font-light text-sm underline">
                    {t('auth.forgotPassword')}
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[48px] px-4 font-normal text-white bg-primary rounded-lg text-sm"
                >
                  {isLoading ? t('common.loadingEllipsis') : t('auth.continue')}
                </button>

                <div className="flex items-center justify-center gap-1 mt-4">
                  <p className="text-black text-sm font-light">{t('auth.noAccount')}</p>
                  <button
                    type="button"
                    className="text-black text-sm font-light underline"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/auth/register');
                    }}
                  >
                    {t('auth.createAccount')}
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-platinum"></div>
            </div>
            <div className="relative flex justify-center text-xs font-poppins">
              <span className="bg-light lg:bg-white px-2 text-grayDark">{t('auth.or')}</span>
            </div>
          </div>
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}
