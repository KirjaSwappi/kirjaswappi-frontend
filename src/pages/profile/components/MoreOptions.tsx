import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Language from '../../../assets/language.png';
import logoutIcon from '../../../assets/logout.png';
import privacy from '../../../assets/privacy.png';
import setting from '../../../assets/settings.png';
import contact from '../../../assets/contact.png';
import Image from '../../../components/shared/Image';
import { logout } from '../../../redux/feature/auth/authSlice';
import { setOpen } from '../../../redux/feature/open/openSlice';
import SideDrawer from './SideDrawer';

const profileSetting = [
  {
    name: 'Settings',
    icon: setting,
    location: '',
  },
  {
    name: 'Language',
    icon: Language,
    location: '',
  },
  {
    name: 'privacy',
    icon: privacy,
    location: '/profile/privacy',
  },
  {
    name: 'Contact Us',
    icon: contact,
    location: '/profile/contact',
  },
  {
    name: 'logout',
    icon: logoutIcon,
    location: '',
  },
];
export default function MoreOptions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <SideDrawer>
      <div className="mt-4 flex flex-col gap-2">
        {profileSetting.map((item) => (
          <button
            key={item.name}
            className="flex items-center px-4 py-4 bg-white border border-[#E6E6E6] rounded-2xl gap-2"
            onClick={() => {
              if (item.name.toLocaleLowerCase() === 'logout') dispatch(logout());
              else if (item.location) {
                navigate(item.location);
              }
              dispatch(setOpen(false));
            }}
            type="button"
          >
            <Image src={item.icon} alt="close" className="h-auto" />
            <h3 className="font-poppins text-sm font-normal capitalize">{item.name}</h3>
          </button>
        ))}
      </div>
    </SideDrawer>
  );
}
