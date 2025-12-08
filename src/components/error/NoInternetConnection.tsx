import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import offline from '../../assets/offline.png';
import Header from '../Header';
import MobileHeader from '../Header/_components/MobileHeader';
import ErrorPageHeader from './ErrorPageHeader';

interface NoInternetConnectionProps {
  children: React.ReactNode;
}

const NoInternetConnection: React.FC<NoInternetConnectionProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const { t } = useTranslation();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className=" bg-[#F2F4F8] h-screen ">
        <div className="lg:hidden">
          <MobileHeader />
        </div>
        <Header showOn404={true} />
        <div className="font-poppins container bg-athensGray lg:bg-white h-[87vh] pt-14 mt-3 flex flex-col justify-center items-center rounded-lg ">
          <ErrorPageHeader title={t('offline.heading')} paragraph={t('offline.title')} />

          {/* img  */}
          <div className="w-[320px] lg:w-[726px] h-[270px] lg:h-[590px] bg-red ">
            <img src={offline} alt="404Error" className=" w-full h-full " />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default NoInternetConnection;
