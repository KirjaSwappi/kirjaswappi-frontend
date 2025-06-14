import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PrivacyPolicyHeader from './PrivacyPolicyHeader';
import { PRIVACY_POLICY_SECTIONS } from '../constants/sections';

const PrivacyPolicyDetail: React.FC = () => {
  const navigate = useNavigate();
  const { sectionKey } = useParams<{ sectionKey: string }>();

  // Redirect to full privacy policy on desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        navigate('/profile/privacy', { replace: true });
      }
    };
    window.addEventListener('resize', handleResize);
    // Check immediately in case user loads directly on desktop
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  const section = PRIVACY_POLICY_SECTIONS.flatMap((section) => section.items).find(
    (item) => item.key === sectionKey,
  );

  if (!section) {
    return (
      <div className="font-poppins pb-24 lg:bg-white lg:container">
        <div className="pt-[56px] lg:max-w-3xl lg:mx-auto lg:px-12">
          <PrivacyPolicyHeader onBack={() => navigate('/profile/privacy')} />
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Section not found</h2>
            <p>The requested privacy policy section could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-poppins  min-h-screen">
      <div className="pt-[56px] lg:max-w-3xl lg:mx-auto lg:px-12">
        <PrivacyPolicyHeader onBack={() => navigate('/profile/privacy')} />
        <div className="px-4 sm:px-6">
          <h2 className="text-[16px] sm:pl-4 sm:mt-4 sm:mb-3 font-semibold mb-6 leading-7 tracking-normal">
            {section.title}
          </h2>
          <div className="text-[15px] text-gray-700">{section.content}</div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyDetail;
