import { useNavigate, useLocation } from 'react-router-dom';
import { useMemo, useEffect } from 'react';
import PrivacyPolicyHeader from './components/PrivacyPolicyHeader';
import PrivacyPolicySection from './components/PrivacyPolicySection';
import { useTranslation } from 'react-i18next';
import { getPrivacyPolicySections } from './constants/sections';

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const sections = getPrivacyPolicySections(t);
  const sequentialNumbers = useMemo(() => {
    const numbers: Record<string, number> = {};
    let currentNumber = 1;
    sections.forEach((section) => {
      section.items.forEach((item) => {
        numbers[item.title] = currentNumber++;
      });
    });
    return numbers;
  }, [sections]);

  useEffect(() => {
    // If we're coming from a specific section page (mobile view)
    const sectionKey = location.pathname.split('/').pop();
    if (sectionKey && sectionKey !== 'privacy') {
      // Find the section element and scroll to it
      const sectionElement = document.getElementById(sectionKey);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div className="font-poppins pb-24 lg:bg-white lg:container">
      <div className="pt-[56px] lg:max-w-3xl lg:mx-auto lg:px-12">
        <PrivacyPolicyHeader onBack={() => navigate('/')} />
        <p className="pt-9 leading-6 px-4 lg:hidden font-normal text-[14px] px-4 pb-[12px]">
          {t('privacypolicy.introduction')}
        </p>

        {/* Information we collect */}
        <div className="lg:hidden">
          {sections.map((section, index) => (
            <PrivacyPolicySection key={index} category={section.category} items={section.items} />
          ))}
        </div>

        {/* Desktop view */}
        <div className="hidden lg:block">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="pt-2">
              <h2 className="pl-3 font-poppins font-semibold text-[20px] leading-[28px] tracking-[0px] lg:hidden">
                {sectionIndex + 1}. {section.category}
              </h2>

              {section.items.map((item) => (
                <div key={item.title} id={item.title} className="pl-6 pt-4">
                  <p className="font-poppins font-bold text-[18px] leading-[23px] tracking-[0px] lg:font-bold lg:text-[18px] lg:leading-[23px] lg:tracking-[0px]">
                    {sequentialNumbers[item.title]}. {item.title}
                  </p>
                  <div className="pt-2 font-poppins font-normal text-[14px] leading-[24px] tracking-[0px] lg:font-normal lg:text-[14px] lg:leading-[24px] lg:tracking-[0px] lg:pt-4 lg:pr-[16px] lg:pb-[12px] lg:pl-6">
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
