import { useNavigate } from 'react-router-dom';
import editIcon from '../../../assets/editGray.png';
import pulsIcon from '../../../assets/plus.png';
import Button from '../../../components/shared/Button';
import Image from '../../../components/shared/Image';

export default function UserActionNavigation() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => navigate('/profile/add-book')}
        className="bg-white text-[#1A1A1A] px-4 py-2 rounded-lg flex items-center gap-2 font-poppins font-medium text-xs border border-[#D9D9D9]"
      >
        <Image src={pulsIcon} alt="pulsIcon" />
        Add Book{' '}
      </Button>
      <Button
        onClick={() => navigate('/profile/edit-user')}
        className="bg-white text-[#1A1A1A] px-4 py-2 rounded-lg flex items-center gap-2 font-poppins font-medium text-xs border border-[#D9D9D9]"
      >
        <Image src={editIcon} alt="pulsIcon" className="w-3" />
        Edit Profile{' '}
      </Button>
    </div>
  );
}
