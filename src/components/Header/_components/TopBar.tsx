import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoSearch } from 'react-icons/io5';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import { menu } from '../../../data/menu';
import { useMouseClick } from '../../../hooks/useMouse';
import { useAppSelector } from '../../../redux/hooks';
import Button from '../../shared/Button';
import Image from '../../shared/Image';
import Search from '../../shared/Search';
import HeaderUserProfile from './HeaderUserProfile';
import LanguageFlagButton from './LanguageFlagButton';
import LanguageMenuDropdown from './LanguageMenuDropdown';
import NotificationBell from './NotificationBell';

export default function TopBar() {
  const [showScrollSearch, setShowScrollSearch] = useState<boolean>(false);
  const { clicked, setClicked, reference } = useMouseClick();
  const { reference: menuReference } = useMouseClick();
  const { userInformation } = useAppSelector((state) => state.auth);

  const { pathname } = useLocation();
  const { t } = useTranslation();
  const filteredMenu = menu.filter(({ isShow }) => isShow);
  const {
    clicked: searchClicked,
    setClicked: setSearchClicked,
    reference: searchReference,
  } = useMouseClick();
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      setShowScrollSearch(Boolean(detail?.hidden));
    };
    window.addEventListener('hero-search-visibility', handler as EventListener);
    return () => window.removeEventListener('hero-search-visibility', handler as EventListener);
  }, []);
  return (
    <div>
      <div className="lg:hidden">{/* <MobileHeader /> */}</div>
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
            <div ref={menuReference} className="flex items-center  p-1 gap-2  h-[48px] ">
              {showScrollSearch && pathname === '/' ? (
                <div ref={searchReference} className="relative ">
                  <div className="flex items-center bg-white rounded-full p-1 gap-2 border border-platinumMix shadow-sm w-full h-[48px]">
                    <div
                      className={`flex items-center gap-1 menu-text-fade ${
                        searchClicked ? 'menu-text-hidden' : 'menu-text-visible'
                      }`}
                      style={{ position: 'relative', zIndex: 1 }}
                    >
                      {filteredMenu.map(({ id, route, icon, value }, index) => {
                        const isActive = pathname === route;
                        return (
                          <div key={id}>
                            {index > 0 && <span className="h-5 w-px bg-platinumMix" />}
                            <Link
                              to={route || '#'}
                              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ease-in-out ${
                                isActive ? 'text-primary font-medium' : 'text-[#A6A6A6]'
                              }`}
                            >
                              <Image
                                src={icon}
                                alt="icon"
                                className="w-4 h-4"
                                style={{
                                  filter: isActive
                                    ? 'brightness(0) saturate(100%) invert(39%) sepia(99%) saturate(1747%) hue-rotate(194deg) brightness(96%) contrast(101%)'
                                    : 'brightness(0) saturate(100%) invert(74%) sepia(6%) saturate(0%) hue-rotate(180deg) brightness(93%) contrast(88%)',
                                  transition: 'filter 0.2s ease-in-out',
                                }}
                              />
                              <span className="text-sm">{t(value)}</span>
                            </Link>
                          </div>
                        );
                      })}
                      <Button
                        onClick={() => setSearchClicked((prev) => !prev)}
                        className={` flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white hover:bg-primary transition-all duration-200 ml-2`}
                        style={{ position: 'relative' }}
                        aria-label="Search"
                      >
                        <IoSearch className="w-4 h-4" />
                      </Button>
                    </div>

                    <div
                      className={`flex-1 absolute left-0 top-0 w-full h-full flex items-center transition-opacity duration-300 ease-in-out ${
                        searchClicked
                          ? 'opacity-100 pointer-events-auto'
                          : 'opacity-0 pointer-events-none'
                      }`}
                      style={{ zIndex: 2 }}
                    >
                      <div className="flex-1">
                        <Search onClose={() => setSearchClicked(false)} />
                      </div>
                    </div>
                  </div>

                  <style>
                    {`
          .menu-text-fade {
            transition: opacity 500ms cubic-bezier(0.4, 0, 0.2, 1) 100ms, transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
            will-change: opacity, transform;
          }
          .menu-text-visible {
            opacity: 1;
            transform: translateX(0);
            pointer-events: auto;
          }
          .menu-text-hidden {
            opacity: 0;
            transform: translateX(80px);
            pointer-events: none;
          }
        `}
                  </style>
                </div>
              ) : (
                <div
                  className={`flex items-center gap-1 menu-text-fade ${
                    clicked ? 'menu-text-hidden' : 'menu-text-visible'
                  }`}
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  {filteredMenu.map(({ id, route, icon, value }, index) => {
                    const isActive = pathname === route;
                    return (
                      <div key={id}>
                        {index > 0 && <span className="h-5 w-px bg-platinumMix" />}
                        <Link
                          to={route || '#'}
                          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ease-in-out font-poppins min-w-[120px] h-10 ${
                            isActive
                              ? 'text-primary font-medium border border-primary'
                              : 'text-[#A6A6A6]'
                          }`}
                        >
                          <Image
                            src={icon}
                            alt="icon"
                            className="w-4 h-4"
                            style={{
                              filter: isActive
                                ? 'brightness(0) saturate(100%) invert(39%) sepia(99%) saturate(1747%) hue-rotate(194deg) brightness(96%) contrast(101%)'
                                : 'brightness(0) saturate(100%) invert(74%) sepia(6%) saturate(0%) hue-rotate(180deg) brightness(93%) contrast(88%)',
                              transition: 'filter 0.2s ease-in-out',
                            }}
                          />
                          <span className="text-sm">{t(value)}</span>
                        </Link>
                      </div>
                    );
                  })}
                  <Button
                    onClick={() => setClicked((prev) => !prev)}
                    className={`${pathname === '/map' || pathname === '/' ? 'hidden' : 'flex'}  items-center justify-center w-10 h-10 rounded-full bg-primary text-white hover:bg-primary transition-all duration-200 ml-2`}
                    style={{ position: 'relative' }}
                    aria-label="Search"
                  >
                    <IoSearch className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div
              ref={reference}
              className={`w-[250px] flex items-center justify-end gap-4 relative `}
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
