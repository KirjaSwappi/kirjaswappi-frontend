import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
    name: 'settings',
    icon: setting,
    location: '',
    actionId: 'settings',
  },
  {
    name: 'language',
    icon: Language,
    location: '',
    actionId: 'language',
  },
  {
    name: 'privacy',
    icon: privacy,
    location: '/privacy-policy',
    actionId: 'privacy',
  },
  {
    name: 'contactUs',
    icon: contact,
    location: '/contact',
    actionId: 'contactUs',
  },
  {
    name: 'logout',
    icon: logoutIcon,
    location: '',
    actionId: 'logout',
  },
];
export default function MoreOptions() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <SideDrawer>
      <div className="mt-4 flex flex-col gap-2">
        {profileSetting.map((item) => (
          <button
            key={item.actionId}
            className="flex items-center px-4 py-4 bg-white border border-[#E6E6E6] rounded-2xl gap-2"
            onClick={() => {
              if (item.actionId === 'logout') dispatch(logout());
              else if (item.location) {
                navigate(item.location);
              }
              dispatch(setOpen(false));
            }}
            type="button"
          >
            <Image src={item.icon} alt="close" className="h-auto" />
            <h3 className="font-poppins text-sm font-normal capitalize">{t(item.name)}</h3>
          </button>
        ))}
      </div>
    </SideDrawer>
  );
}
