import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import { useMouseClick } from '../../../hooks/useMouse';
import Image from '../../shared/Image';
import ScrollSearch from '../../shared/ScrollSearch';
import HeaderUserProfile from './HeaderUserProfile';
import LanguageFlagButton from './LanguageFlagButton';
import LanguageMenuDropdown from './LanguageMenuDropdown';
import MobileHeader from './MobileHeader';

export default function TopBar() {
  const [showScrollSearch, setShowScrollSearch] = useState<boolean>(false);
  const { clicked, setClicked, reference } = useMouseClick();
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
          <div id="top-nav-bar" className={`w-full flex items-center justify-between `}>
            <Link to="/" aria-label="Go to homepage">
              <Image
                src={logo}
                alt="KirjaSwappi Logo"
                className="h-7 cursor-pointer hidden lg:block"
              />
            </Link>
            <div className="block transition-all duration-300 ease-in-out">
              {showScrollSearch ? (
                <div className="animate-fadeIn">
                  <ScrollSearch />
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <ScrollSearch />
                </div>
              )}
            </div>

            <div
              ref={reference}
              className={`w-[220px] flex items-center justify-end gap-4 relative`}
            >
              <LanguageFlagButton clicked={clicked} setClicked={setClicked} />
              {clicked && <LanguageMenuDropdown />}
              <HeaderUserProfile />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
