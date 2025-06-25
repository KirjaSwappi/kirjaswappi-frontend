import { useEffect } from 'react';
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';
import blankProfileIcon from '../../../assets/blankProfileIcon.png';
import { useMouseClick } from '../../../hooks/useMouse';
import { useGetUserProfileImageQuery } from '../../../redux/feature/auth/authApi';
import { useAppSelector } from '../../../redux/hooks';
import Image from '../../shared/Image';
import UserMenuDropdown from './UserMenuDropdown';
import UserProfileSkeleton from './UserProfileSkeleton';
export default function HeaderUserProfile() {
  const location = useLocation();
  const { clicked, setClicked, reference } = useMouseClick();
  const { userInformation } = useAppSelector((state) => state.auth);
  const { data: profilePicture, isLoading } = useGetUserProfileImageQuery(
    { userId: userInformation.id },
    {
      skip: !userInformation.id,
    },
  );

  // ======= RESET THE USER MENU OPEN STATE =======
  useEffect(() => {
    setClicked(false);
  }, [location]);
  return (
    <div>
      {isLoading ? (
        <UserProfileSkeleton />
      ) : (
        <div>
          {!userInformation.id ? (
            <Link to="/auth/login">
              <Image
                src={blankProfileIcon}
                alt="profile"
                className="w-10 h-10 object-cover rounded-full border border-primary"
              />
            </Link>
          ) : (
            <div ref={reference} className="relative">
              <button
                type="button"
                onClick={() => setClicked((prev) => !prev)}
                className="flex items-center gap-2"
                tabIndex={0}
                aria-haspopup="true"
                aria-expanded={clicked}
              >
                <Image
                  src={profilePicture?.imageUrl ?? blankProfileIcon}
                  alt="profile"
                  className="w-10 h-10 object-cover rounded-full border border-primary"
                />
                <div className=" items-center gap-2 hidden lg:flex">
                  <p className="text-grayDark font-poppins font-normal text-sm">
                    {userInformation.firstName}
                  </p>
                  {clicked ? (
                    <MdOutlineKeyboardArrowUp size={24} />
                  ) : (
                    <MdOutlineKeyboardArrowDown size={24} />
                  )}
                </div>
              </button>
              {clicked && <UserMenuDropdown />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
