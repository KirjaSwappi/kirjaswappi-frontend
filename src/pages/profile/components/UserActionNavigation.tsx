import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import editIcon from '../../../assets/editGray.png';
import pulsIcon from '../../../assets/plus.png';
import Button from '../../../components/shared/Button';
import Image from '../../../components/shared/Image';
import { useAppSelector } from '../../../redux/hooks';

export default function UserActionNavigation() {
  const { t } = useTranslation();
  const { loading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  return (
    <div>
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-[116px] h-[34px] bg-platinum animate-pulse shadow-sm rounded-lg"></div>
          <div className="w-[116px] h-[34px] bg-platinum animate-pulse shadow-sm rounded-lg"></div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/profile/add-book')}
            className="bg-white text-[#1A1A1A] px-4 py-2 h-[34px] rounded-lg flex items-center gap-2 font-poppins font-medium text-xs border border-[#D9D9D9]"
          >
            <Image src={pulsIcon} alt="" />
            {t('profile.addABook')}
          </Button>
          <Button
            onClick={() => navigate('/profile/edit-user')}
            className="bg-white text-[#1A1A1A] px-4 py-2 h-[34px] rounded-lg flex items-center gap-2 font-poppins font-medium text-xs border border-[#D9D9D9]"
          >
            <Image src={editIcon} alt="" className="w-3" />
            {t('editProfile.title')}
          </Button>
        </div>
      )}
    </div>
  );
}
