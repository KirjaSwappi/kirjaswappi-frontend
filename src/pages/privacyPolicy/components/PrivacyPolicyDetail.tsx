import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PrivacyPolicyHeader from './PrivacyPolicyHeader';
import { useTranslation } from 'react-i18next';
import { getPrivacyPolicySections } from '../constants/sections';

const PrivacyPolicyDetail: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { sectionKey } = useParams<{ sectionKey: string }>();

  // Redirect to full privacy policy on desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        navigate('/privacy-policy', { replace: true });
      }
    };
    window.addEventListener('resize', handleResize);
    // Check immediately in case user loads directly on desktop
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  // Flatten all items from static sections
  const allItems = getPrivacyPolicySections(t).flatMap((section) => section.items);
  const section = allItems.find((item) => item.title === sectionKey);

  if (!section) {
    return (
      <div className="font-poppins pb-24 lg:bg-white lg:container">
        <div className="pt-[56px] lg:max-w-3xl lg:mx-auto lg:px-12">
          <PrivacyPolicyHeader onBack={() => navigate('/privacy-policy')} />
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">{t('privacypolicy.sectionNotFound')}</h2>
            <p>{t('privacypolicy.sectionNotFoundDescription')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-poppins  min-h-screen">
      <div className="pt-[56px] lg:max-w-3xl lg:mx-auto lg:px-12">
        <PrivacyPolicyHeader onBack={() => navigate('/privacy-policy')} />
        <div className="px-4 sm:px-6">
          <h2 className="text-[16px] sm:mt-4 sm:mb-3 font-semibold mb-6 leading-7 tracking-normal">
            {section.title}
          </h2>
          <div className="text-[15px] text-gray-700">{section.content}</div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyDetail;
