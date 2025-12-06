import { useTranslation } from 'react-i18next';
import BookAddUpdateHeader from '../../addUpdateBook/_components/BookAddUpdateHeader';

interface SupportUsHeaderProps {
  onBack: () => void;
}

export default function SupportUsHeader({ onBack }: SupportUsHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="block lg:hidden ">
      <BookAddUpdateHeader title={t('supportUs.header')} onBack={onBack} />
      <h1 className="font-poppins font-semibold text-[16px] leading-[40px] text-black2 ">
        {t('supportUs.heading')}
      </h1>
      <p className="font-poppins text-grayDark mt-3  text-[10px] leading-[16px]">
        {t('supportUs.title')}
      </p>
    </div>
  );
}
