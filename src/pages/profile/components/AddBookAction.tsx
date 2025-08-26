import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import plus from '../../../assets/plusAdd.png';
import Image from '../../../components/shared/Image';

export default function AddBookAction() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/profile/add-book')}
      onKeyDown={(e) => e.key === 'Enter' && navigate('/profile/add-book')}
      className="w-full h-full max-h-[253px] flex flex-col items-center justify-center gap-2 border border-primary border-dashed bg-white rounded-lg "
    >
      <Image src={plus} alt="Plus" />
      <p className="font-poppins text-sm font-medium text-primary">{t('profile.addABook')}</p>
    </button>
  );
}
