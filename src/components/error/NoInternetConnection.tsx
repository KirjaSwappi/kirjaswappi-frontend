import React, { useEffect, useState } from 'react';
import offline from '../../assets/offline.png';
import Header from '../Header';
import MobileHeader from '../Header/_components/MobileHeader';
import ErrorPageHeader from './ErrorPageHeader';

interface NoInternetConnectionProps {
  children: React.ReactNode;
}

const NoInternetConnection: React.FC<NoInternetConnectionProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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
      <div>
        <div className="lg:hidden">
          <MobileHeader />
        </div>
        <Header showOn404={true} />
        <div className="font-poppins container bg-athensGray lg:bg-white h-[87vh] pt-14 mt-3 flex flex-col justify-center items-center ">
          <ErrorPageHeader
            title={"You're offline"}
            paragraph={
              'Check your internet connection and try again. We’ll be right here when you’re back online.'
            }
          />

          {/* img  */}
          <div className="w-[265px] lg:w-[655px] h-[120px] lg:h-[290px] mt-8 lg:mt-16 ">
            <img src={offline} alt="404Error" className=" w-full h-full " />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default NoInternetConnection;
