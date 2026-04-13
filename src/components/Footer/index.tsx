import { FaPlus } from 'react-icons/fa6';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import Button from '../shared/Button';
import BottomNav from './_components/BottomNav';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedChatId } = useAppSelector((state) => state.chat);
  const { loginModalOpen } = useAppSelector((state) => state.open);
  const pathname = location.pathname;
  const ignorePath: string[] = [
    '/profile/add-book',
    `/profile/update-book/${pathname?.split('/').reverse()[0]}`,
    `/book-details/${pathname?.split('/').reverse()[0]}`,
  ];

  const isFooterBarShow = ignorePath.includes(pathname);
  return (
    <>
      {/* Desktop Footer */}
      <footer className="hidden lg:block bg-white border-t border-platinumMix mt-auto">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <p className="font-poppins text-xs text-grayDark">
              &copy; {new Date().getFullYear()} KirjaSwappi. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/privacy-policy"
                className="font-poppins text-xs text-grayDark hover:text-black hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-service"
                className="font-poppins text-xs text-grayDark hover:text-black hover:underline"
              >
                Terms of Service
              </Link>
              <Link
                to="/contact-us"
                className="font-poppins text-xs text-grayDark hover:text-black hover:underline"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Footer */}
      <footer
        className={`${isFooterBarShow || selectedChatId || loginModalOpen ? 'hidden' : ''} bg-white lg:hidden relative`}
      >
        <Button
          type="button"
          onClick={() => navigate('/profile/add-book')}
          className={`w-14 h-14 bg-[#999999] hover:bg-primary rounded-full fixed z-10 left-1/2 bottom-12 -translate-x-1/2   items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary ${pathname === '/' ? 'flex' : 'hidden '} `}
          aria-label="Add book"
        >
          <FaPlus className="text-white text-2xl" />
        </Button>
        <div
          className={`fixed bottom-0 left-0 w-full z-50 ${pathname === '/' ? 'drop-shadow-[0_-2px_3.5px_rgba(0,0,0,0.15)]' : 'drop-shadow-md'} `}
        >
          <div
            className={`container fixed bottom-0 left-0 w-full items-center justify-center bg-white ${pathname === '/' ? 'inner-curve' : ''}`}
          >
            <BottomNav />
          </div>
        </div>
      </footer>
    </>
  );
}
