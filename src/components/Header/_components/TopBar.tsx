import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import { useMouseClick } from '../../../hooks/useMouse';
import BookSearchBar from '../../../pages/books/_components/BookSearchBar';
import { useAppSelector } from '../../../redux/hooks';
import Image from '../../shared/Image';
import ScrollSearch from '../../shared/ScrollSearch';
import HeaderUserProfile from './HeaderUserProfile';
import LanguageFlagButton from './LanguageFlagButton';
import LanguageMenuDropdown from './LanguageMenuDropdown';
import MobileHeader from './MobileHeader';
import NotificationBell from './NotificationBell';

export default function TopBar() {
  const [showScrollSearch, setShowScrollSearch] = useState<boolean>(false);
  const { clicked, setClicked, reference } = useMouseClick();
  const { userInformation } = useAppSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);

  // scroll --> 251
  // scroll --> 301

  console.log(showScrollSearch);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 301);
    };

    window.addEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const searchBar = document.querySelector('#hero-search');
      const topBar = document.querySelector('#top-nav-bar');

      if (searchBar && topBar) {
        const searchBarRect = searchBar.getBoundingClientRect();
        const topBarHeight = topBar.getBoundingClientRect().height;
        if (searchBarRect.top <= topBarHeight + 20) {
          setShowScrollSearch(true);
        } else {
          setShowScrollSearch(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setClicked(false);
  }, []);

  return (
    <div>
      <div className="lg:hidden">
        <MobileHeader />
      </div>
      <div
        className={`h-20 px-4 py-2 w-full z-50 fixed top-0 lg:shadow-sm transition-all duration-300 hidden lg:flex items-center justify-center flex-col gap-4 shadow-md bg-white`}
      >
        <div className="container">
          <div id="top-nav-bar" className={`w-full flex items-center justify-between`}>
            <Link to="/" aria-label="Go to homepage">
              <Image
                src={logo}
                alt="Kirja Swappi Logo"
                className="h-7 cursor-pointer hidden lg:block"
              />
            </Link>

            {/* mid , btn section  */}
            <div className=" block  ">
              <AnimatePresence mode="wait">
                {isScrolled ? (
                  <motion.div
                    key="book-search"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <BookSearchBar />
                  </motion.div>
                ) : (
                  <motion.div
                    key="scroll-search"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ScrollSearch />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* right section  */}
            <div
              ref={reference}
              className={`w-[220px] flex items-center justify-end gap-4 relative `}
            >
              <LanguageFlagButton clicked={clicked} setClicked={setClicked} />
              {clicked && <LanguageMenuDropdown />}
              {userInformation.id && <NotificationBell />}
              <HeaderUserProfile />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
