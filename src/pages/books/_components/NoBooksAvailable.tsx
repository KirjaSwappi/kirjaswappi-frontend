import { useTranslation } from 'react-i18next';
import NotFound from '../../../assets/notFound.png';
import Image from '../../../components/shared/Image';

export default function NoBooksAvailable() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center mt-6">
      <div className="bg-white w-full rounded-lg p-6 flex min-h-[50vh] justify-center flex-col items-center">
        <h3 className="text-xl lg:text-2xl font-semibold mb-2 font-poppins text-[#262626]">
          {t('books.noBooks')}
        </h3>
        <p className="text-sm text-[#262626] mb-4 font-poppins text-center">
          {t('books.noBooksDesc')}
        </p>
        <Image src={NotFound} alt="not found" className="w-28 lg:w-40" />
      </div>
    </div>
  );
}
