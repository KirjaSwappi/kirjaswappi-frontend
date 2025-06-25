import { FaPlus } from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../shared/Button';
import BottomNav from './_components/BottomNav';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const ignorePath: string[] = [
    '/profile/add-book',
    `/profile/update-book/${pathname?.split('/').reverse()[0]}`,
    `/book-details/${pathname?.split('/').reverse()[0]}`,
  ];

  const isFooterBarShow = ignorePath.includes(pathname);
  return (
    <footer className={`${isFooterBarShow && 'hidden'} bg-white lg:hidden relative`}>
      <Button
        type="button"
        onClick={() => navigate('/profile/add-book')}
        className="w-14 h-14 bg-[#999999] hover:bg-primary rounded-full fixed z-10 left-1/2 bottom-14 -translate-x-1/2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Add book"
      >
        <FaPlus className="text-white text-2xl" />
      </Button>
      <div className="fixed bottom-0 left-0 w-full z-0 drop-shadow-[0_-2px_3.5px_rgba(0,0,0,0.15)]">
        <div className="container fixed bottom-0 left-0 w-full  items-center justify-center inner-curve">
          <BottomNav />
        </div>
      </div>
    </footer>
  );
}
