import React from 'react';
import BookAddUpdateHeader from '../../addUpdateBook/_components/BookAddUpdateHeader';
import { useTranslation } from 'react-i18next';

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
      <div className="hidden lg:flex relative pt-[56px] pl-6">
        {/* Centered Title (remains */}
        <h1 className="font-poppins font-semibold text-[32px] tracking-[-0.02em]">
          {t('privacypolicy.header')}
        </h1>
      </div>
    </>
  );
};

export default PrivacyPolicyHeader;
