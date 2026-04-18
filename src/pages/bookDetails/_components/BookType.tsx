import { useTranslation } from 'react-i18next';
import bookIcon2 from '../../../assets/bookIcon2.png';
import edition from '../../../assets/edition.png';
import lng from '../../../assets/language.png';
import Image from '../../../components/shared/Image';

export default function BookType({
  condition,
  language,
  publishedYear,
}: {
  condition: string;
  language?: string;
  publishedYear?: string;
}) {
  const { t } = useTranslation();

  if (!condition) return null;

  return (
    <div className="bg-white lg:bg-[#F2F4F8] py-6 grid grid-cols-3 lg:rounded-2xl ">
      <div className="flex flex-col items-center border-r border-platinumDark px-1">
        <p className="text-grayDark text-xs font-poppins font-light">
          {t('bookDetails.bookCondition')}
        </p>
        <Image src={bookIcon2} alt="book" className="mt-2 mb-1" />
        <h3 className="text-black text-xs font-normal font-poppins">{condition || '-'}</h3>
      </div>
      <div className="flex flex-col items-center border-r border-platinumDark px-1">
        <p className="text-grayDark text-xs font-poppins font-normal">
          {t('bookDetails.language')}
        </p>
        <Image src={lng} alt="book" className="mt-2 mb-1" />
        <h3 className="text-black text-xs font-normal font-poppins capitalize">
          {language || '-'}
        </h3>
      </div>
      <div className="flex flex-col items-center px-1">
        <p className="text-grayDark text-xs font-poppins font-normal">{t('bookDetails.edition')}</p>
        <Image src={edition} alt="book" className="mt-2 mb-1 h-[18px]" />
        <h3 className="text-black text-xs font-normal font-poppins flex items-center gap-1">
          {publishedYear || '-'}
        </h3>
      </div>
    </div>
  );
}
