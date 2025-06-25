import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import leftArrowGray from '../../../assets/leftArrowGray.png';
import logo from '../../../assets/logo.png';
import logoIcon from '../../../assets/logoIcon.png';
import useScroll from '../../../hooks/useScroll';
import Button from '../../shared/Button';
import Image from '../../shared/Image';
import SearchBar from '../../shared/SearchBar';
import HeaderUserProfile from './HeaderUserProfile';
import Language from './Language';
export default function MobileHeader() {
  const location = useLocation();
  const { scrolled } = useScroll();
  const [query, setQuery] = useState<string>('');
  const [searchToggle, setSearchToggle] = useState<boolean>(false);
  const pathname = location.pathname;
  const shouldCollapse = scrolled || searchToggle;
  const isHomePage = pathname === '/';

  return (
    <div
      className={`${shouldCollapse ? 'h-20' : 'h-28'} py-2  w-full z-50 fixed top-0 lg:shadow-sm transition-all duration-300 flex items-center justify-center flex-col gap-4 ${
        shouldCollapse ? 'bg-white shadow-md ' : 'bg-transparent'
      }`}
    >
      <div className="container">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Link
                to="/"
                aria-label="Go to homepage"
                className={`${searchToggle ? 'hidden' : 'block'}`}
              >
                <Image
                  src={!scrolled ? logo : logoIcon}
                  alt="KirjaSwappi Logo"
                  className={`cursor-pointer ${scrolled ? 'w-10 h-10' : 'h-7'}`}
                />
              </Link>
              {searchToggle && (
                <Button
                  onClick={() => setSearchToggle(false)}
                  className="w-12 sm:w-10 h-10 border border-gray rounded-full flex items-center justify-center"
                >
                  <Image src={leftArrowGray} alt="Left Arrow" className="h-4" />
                </Button>
              )}
              {shouldCollapse && (
                <button
                  type="button"
                  onClick={() => setSearchToggle(true)}
                  aria-label="Show search"
                  className="bg-transparent border-none p-0 m-0 focus:outline-none"
                  tabIndex={0}
                >
                  {
                    <SearchBar
                      query={query}
                      setQuery={setQuery}
                      isShowFilterIcon={false}
                      isShowSortingIcon={false}
                      className={`h-10 px-0 pl-2 overflow-hidden lg:hidden ${searchToggle ? 'w-full pr-3' : 'w-10'} `}
                    />
                  }
                </button>
              )}
            </div>
            <div className={`${searchToggle && 'hidden sm:flex'} flex items-center gap-2`}>
              <Language />
              <HeaderUserProfile />
            </div>
          </div>
          {!scrolled && isHomePage && (
            <div className={`${searchToggle ? 'hidden' : 'block'} lg:hidden w-full`}>
              <SearchBar query={query} setQuery={setQuery} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
