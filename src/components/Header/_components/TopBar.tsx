import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import country from '../../../assets/flag.png';
import logo from '../../../assets/logo.png';
import Button from '../../shared/Button';
import Image from '../../shared/Image';
import ScrollSearch from '../../shared/ScrollSearch';
import HeaderUserProfile from './HeaderUserProfile';
import MobileHeader from './MobileHeader';

export default function TopBar() {
  const [showScrollSearch, setShowScrollSearch] = useState<boolean>(false);

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

            <div className={`w-[220px] flex items-center justify-end gap-4`}>
              <Button className="flex items-center justify-center w-10 h-10 border border-primary rounded-full overflow-hidden">
                <Image src={country} alt="Swedish Flag" className="w-10 h-10 object-cover " />
              </Button>
              <HeaderUserProfile />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
