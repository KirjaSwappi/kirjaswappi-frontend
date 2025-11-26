import { useTranslation } from 'react-i18next';
import BookAddUpdateHeader from '../../addUpdateBook/_components/BookAddUpdateHeader';

interface SupportUsHeaderProps {
  onBack: () => void;
}

export default function SupportUsHeader({ onBack }: SupportUsHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="block lg:hidden">
      <BookAddUpdateHeader title={t('supportUs.header')} onBack={onBack} />
      <h1 className="font-poppins font-semibold text-xl mb-3 ">{t('supportUs.heading')}</h1>
      <p className=" text-sm leading-4 text-grayDark mb-6 ">{t('supportUs.title')}</p>
    </div>
  );
}
