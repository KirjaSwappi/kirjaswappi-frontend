import {
  IoPersonOutline,
  IoChatbubbleEllipsesOutline,
  IoHeartOutline,
  IoMailOutline,
  IoShieldCheckmarkOutline,
  IoLogOutOutline,
} from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../../redux/api/apiSlice';
import { logout } from '../../../redux/feature/auth/authSlice';
import { clearAllFilters } from '../../../redux/feature/filter/filterSlice';
import { resetChat } from '../../../redux/feature/messages/messagesSlice';
import { clearNotifications } from '../../../redux/feature/notification/notificationSlice';
import { setOpen } from '../../../redux/feature/open/openSlice';
import { setStep } from '../../../redux/feature/step/stepSlice';
import { setResetSwapBook } from '../../../redux/feature/swap/swapSlice';
import { useAppSelector } from '../../../redux/hooks';
import Button from '../../shared/Button';
import { showToast } from '../../shared/toast';
import DropdownItem from './DropdownItem';

export default function UserMenuDropdown() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    userInformation: { id },
  } = useAppSelector((state) => state.auth);
  const UserMenu = [
    {
      label: 'View Profile',
      icon: IoPersonOutline,
      location: '/profile/user-profile',
      isProfile: true,
    },
    {
      label: 'Feedback',
      icon: IoChatbubbleEllipsesOutline,
      location: '/feedback',
    },
    {
      label: 'Support Us',
      icon: IoHeartOutline,
      location: '/support-us',
    },
    {
      label: 'Contact Us',
      icon: IoMailOutline,
      location: '/contact-us',
    },
    {
      label: 'Privacy Center',
      icon: IoShieldCheckmarkOutline,
      location: '/privacy-policy',
    },
    {
      label: 'Log Out',
      icon: IoLogOutOutline,
      location: '/logout',
    },
  ];

  function getMenuLocation(menu: (typeof UserMenu)[number]) {
    return menu.isProfile ? `${menu.location}/${id}` : menu.location;
  }

  return (
    <div className="absolute top-12 py-2 right-0 w-56 bg-white rounded-lg shadow-custom-box-shadow z-50 text-blackOlive">
      {UserMenu.map((menu, index) => {
        return menu.location === '/logout' ? (
          <div key={`${menu.label}-${index}`}>
            <div className="my-1 border-t border-platinum" />
            <Button
              onClick={() => {
                dispatch(logout());
                dispatch(api.util.resetApiState());
                dispatch(clearAllFilters());
                dispatch(resetChat());
                dispatch(setResetSwapBook());
                dispatch(clearNotifications());
                dispatch(setStep(0));
                dispatch(setOpen(false));
                showToast('success', 'Logout successfully');
                navigate('/');
              }}
              className="w-full"
            >
              <DropdownItem
                className="group hover:bg-primary hover:text-white"
                icon={<menu.icon className="text-primary group-hover:text-white" />}
                label={menu.label}
              />
            </Button>
          </div>
        ) : (
          <Link to={getMenuLocation(menu)} key={`${menu.label}-${index}`}>
            <DropdownItem
              className="group hover:bg-primary hover:text-white"
              icon={<menu.icon className="text-primary group-hover:text-white" />}
              label={menu.label}
            />
          </Link>
        );
      })}
    </div>
  );
}
