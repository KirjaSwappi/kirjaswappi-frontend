import { FaPlus } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';
import BottomNav from './_components/BottomNav';

export default function Footer() {
  const location = useLocation();
  const ignorePath: string[] = ['/profile/add-book'];
  const isFooterBarShow = ignorePath.includes(location.pathname);
  return (
    <footer className={`${isFooterBarShow && 'hidden'} bg-white lg:hidden relative`}>
      <div className="w-14 h-14 bg-[#999999] hover:bg-primary rounded-full fixed z-10 left-1/2 bottom-14 -translate-x-1/2 flex items-center justify-center">
        <FaPlus className="text-white text-2xl" />
      </div>
      <div className="fixed bottom-0 left-0 w-full z-0 drop-shadow-[0_-2px_3.5px_rgba(0,0,0,0.15)]">
        <div className="container fixed bottom-0 left-0 w-full  items-center justify-center inner-curve">
          <BottomNav />
        </div>
      </div>
    </footer>
  );
}
