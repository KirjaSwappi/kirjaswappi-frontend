import { BiSupport } from 'react-icons/bi';
import { IoLogOut } from 'react-icons/io5';
import { MdContactPage, MdFeedback, MdLock } from 'react-icons/md';
import { TbUserCircle } from 'react-icons/tb';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../../redux/feature/auth/authSlice';
import Button from '../../shared/Button';
import DropdownItem from './DropdownItem';

export default function UserMenuDropdown() {
  const dispatch = useDispatch();
  const UserMenu = [
    {
      label: 'View Profile',
      icon: TbUserCircle,
      location: '/profile/user-profile',
    },
    {
      label: 'Privacy Center',
      icon: MdLock,
      location: '/privacy-policy',
    },
    {
      label: 'Support Us',
      icon: BiSupport,
      location: '/support-us',
    },
    {
      label: 'Contact Us',
      icon: MdContactPage,
      location: '/contact-us',
    },
    {
      label: 'Feedback',
      icon: MdFeedback,
      location: '/feedback',
    },
    {
      label: 'Log Out',
      icon: IoLogOut,
      location: '/logout',
    },
  ];

  return (
    <div className="absolute top-12 py-2 right-0 w-56 bg-white rounded-lg shadow-custom-box-shadow z-50 text-[#404040] ">
      {UserMenu.map((menu, index) => {
        return menu.location === '/logout' ? (
          <Button
            key={`${menu.label}-${index}`}
            onClick={() => dispatch(logout())}
            className="w-full"
          >
            <DropdownItem
              className="group hover:bg-primary hover:text-white"
              icon={<menu.icon className="text-primary group-hover:text-white" />}
              label={menu.label}
            />
          </Button>
        ) : (
          <Link to={menu.location} key={`${menu.label}-${index}`}>
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
