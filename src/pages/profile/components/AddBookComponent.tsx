import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import plus from '../../../assets/plusAdd.png';
import Image from '../../../components/shared/Image';
export default function AddBookComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/profile/add-book')}
      onKeyDown={(e) => e.key === 'Enter' && navigate('/profile/add-book')}
      className="max-w-[168px] h-[229px] flex flex-col items-center justify-center gap-2 border border-primary border-dashed bg-white rounded-lg"
    >
      <Image src={plus} alt="Plus" />
      <p className="font-poppins text-sm font-medium text-primary">{t('profile.addABook')}</p>
    </button>
  );
}
