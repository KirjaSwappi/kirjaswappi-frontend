import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import authShape from '../../../assets/authShape.png';
import leftArrowIcon from '../../../assets/leftArrow.png';
import logo from '../../../assets/logo.png';
import GoogleLoginButton from '../../../components/shared/GoogleLoginButton';
import Image from '../../../components/shared/Image';
import PageTitle from '../../../components/shared/PageTitle';
import { setError } from '../../../redux/feature/auth/authSlice';
import { setMessages } from '../../../redux/feature/notification/notificationSlice';
import { setStep } from '../../../redux/feature/step/stepSlice';
import { useAppSelector } from '../../../redux/hooks';
import ConfirmOTP from './_components/ConfirmOTP';
import RegisterForm from './_components/RegisterForm';
export default function Register() {
  const { step } = useAppSelector((state) => state.step);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const renderStepsContent = () => {
    switch (step) {
      case 0:
        return <RegisterForm />;
      case 1:
        return <ConfirmOTP />;
      default:
        return null;
    }
  };

  useEffect(() => {
    dispatch(setMessages({ type: '', isShow: false, message: '' }));
    dispatch(setError(''));
  }, [location.pathname, dispatch]);
  return (
    <div>
      <PageTitle title="Register" />
      <div className="container lg:bg-white min-h-svh lg:min-h-[calc(100vh-128px)] relative lg:rounded-lg lg:grid lg:grid-cols-2 lg:mt-5 overflow-hidden">
        <div className="hidden bg-primary-light lg:flex flex-col items-center justify-center">
          <Image src={authShape} alt="auth shape" className="max-w-[396px] mb-14" />
          <Image src={logo} alt="logo" className="max-w-[310px]" />
          <p className="text-center text-grayDark text-xs px-20 mt-5">
            Swap books with readers near you. Join KirjaSwappi and give your books a second life.
          </p>
        </div>
        <div className="flex flex-col justify-center lg:px-20">
          <div className="lg:hidden pt-4 pb-6 flex items-center gap-4">
            <button
              className="w-5 border-none bg-transparent p-0"
              onClick={() => {
                if (step === 0) navigate('/auth/login');
                else if (step === 1) {
                  dispatch(setStep(step - 1));
                  dispatch(setError(''));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  if (step === 0) navigate('/auth/login');
                  else if (step === 1) {
                    dispatch(setStep(step - 1));
                    dispatch(setError(''));
                  }
                }
              }}
            >
              <Image src={leftArrowIcon} alt="left" />
            </button>
            <h3 className="font-poppins text-base font-medium ">log in or Signup</h3>
          </div>
          {renderStepsContent()}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-platinum"></div>
            </div>
            <div className="relative flex justify-center text-xs font-poppins">
              <span className="bg-light lg:bg-white px-2 text-grayDark">Or</span>
            </div>
          </div>
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}
