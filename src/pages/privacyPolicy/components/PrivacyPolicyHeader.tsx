import React from 'react';
import { useTranslation } from 'react-i18next';
import BookAddUpdateHeader from '../../addUpdateBook/_components/BookAddUpdateHeader';

interface PrivacyPolicyHeaderProps {
  onBack: () => void;
}

const PrivacyPolicyHeader: React.FC<PrivacyPolicyHeaderProps> = ({ onBack }) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Mobile Header */}
      <div className="block lg:hidden">
        <BookAddUpdateHeader title={t('privacypolicy.header')} onBack={onBack} />
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex relative pt-[4.5rem] pl-6">
        {/* Centered Title (remains */}
        <h1 className="font-poppins font-semibold text-[32px] leading-[40px] text-black2 ">
          {t('privacypolicy.header')}
        </h1>
      </div>
    </>
  );
};

export default PrivacyPolicyHeader;
