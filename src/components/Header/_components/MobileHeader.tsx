import { IoIosSearch } from 'react-icons/io';
import { Link, useLocation } from 'react-router-dom';
import leftArrowGray from '../../../assets/leftArrowGray.png';
import logo from '../../../assets/logo.png';
import logoIcon from '../../../assets/logoIcon.png';
import { useMouseClick } from '../../../hooks/useMouse';
import useScroll from '../../../hooks/useScroll';
import { setSearchToggle } from '../../../redux/feature/open/openSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import Button from '../../shared/Button';
import Image from '../../shared/Image';
import Search from '../../shared/Search';
import SearchBar from '../../shared/SearchBar';
import HeaderUserProfile from './HeaderUserProfile';
import LanguageFlagButton from './LanguageFlagButton';
import LanguageMenuDropdown from './LanguageMenuDropdown';
import NotificationBell from './NotificationBell';

export default function MobileHeader() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { scrolled } = useScroll();
  const { clicked, setClicked, reference } = useMouseClick();
  const { userInformation } = useAppSelector((state) => state.auth);
  const { searchToggle } = useAppSelector((state) => state.open);
  const pathname = location.pathname;
  const shouldCollapse = scrolled || searchToggle;
  const isHomePage = pathname === '/';
  console.log(searchToggle);
  return (
    <div
      className={`${
        shouldCollapse ? 'h-20' : 'h-28'
      } py-2 w-full z-50 fixed top-0 lg:shadow-sm transition-all duration-300 flex items-center justify-center flex-col gap-4 ${
        shouldCollapse ? 'bg-white shadow-md' : 'bg-light'
      } 
      `}
    >
      <div className="container">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 w-full">
              {!searchToggle && (
                <Link to="/" aria-label="Go to homepage" className="shrink-0">
                  <Image
                    src={!scrolled ? logo : logoIcon}
                    alt="KirjaSwappi Logo"
                    className={`cursor-pointer ${scrolled ? 'w-10 h-10' : 'h-7'}`}
                  />
                </Link>
              )}

              {searchToggle && (
                <Button
                  id="leftArrowButton"
                  onClick={() => dispatch(setSearchToggle(false))}
                  className="w-10 h-10 shrink-0 border border-gray rounded-full flex items-center justify-center"
                >
                  <Image src={leftArrowGray} alt="Left Arrow" className="h-4" />
                </Button>
              )}

              {shouldCollapse && (
                <div className="flex-1 min-w-0">
                  {!searchToggle ? (
                    <Button
                      type="button"
                      onClick={() => dispatch(setSearchToggle(true))}
                      aria-label="Show search"
                      className="w-10 h-10 shrink-0 bg-transparent border border-platinumMix rounded-full flex items-center justify-center"
                    >
                      <IoIosSearch size={24} className="text-grayDark" />
                    </Button>
                  ) : (
                    <Search className="h-14 w-full rounded-[33px]" />
                  )}
                </div>
              )}
            </div>

            <div className={`${searchToggle && 'hidden sm:flex'} flex items-center gap-2`}>
              <div
                ref={reference}
                className="w-[130px] xlg:w-[160px] flex items-center justify-end gap-1 xlg:gap-4 relative"
              >
                <LanguageFlagButton clicked={clicked} setClicked={setClicked} />
                {clicked && <LanguageMenuDropdown />}
                {userInformation.id && <NotificationBell />}
                <HeaderUserProfile />
              </div>
            </div>
          </div>

          {!scrolled && isHomePage && (
            <div className={`${searchToggle ? 'hidden' : 'block'} lg:hidden w-full`}>
              <SearchBar />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
