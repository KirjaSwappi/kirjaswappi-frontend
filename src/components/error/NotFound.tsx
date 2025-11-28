import errorImg from '../../assets/404Error.png';
import Header from '../Header';
import MobileHeader from '../Header/_components/MobileHeader';
import ErrorPageHeader from './ErrorPageHeader';

const NotFound = () => {
  return (
    <div>
      <div className="lg:hidden">
        <MobileHeader />
      </div>
      <Header showOn404={true} />
      <div className="font-poppins container bg-athensGray lg:bg-white h-[87vh] pt-14 mt-3 flex flex-col justify-center items-center ">
        <ErrorPageHeader
          title={'Page not found'}
          paragraph={
            "It looks like the page you're looking for doesn’t exist or has been moved.Let’s get you back on track."
          }
        />

        {/* img  */}
        <div className="w-[265px] lg:w-[655px] h-[120px] lg:h-[290px] mt-8 lg:mt-16 ">
          <img src={errorImg} alt="404Error" className=" w-full h-full " />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
