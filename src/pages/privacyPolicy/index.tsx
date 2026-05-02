import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import SafeHtml from '../../components/shared/SafeHtml';
import PrivacyPolicyHeader from './components/PrivacyPolicyHeader';
import PrivacyPolicySection from './components/PrivacyPolicySection';
import { usePrivacyPolicyData } from './components/usePrivacyPolicyData';

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const { CategorySectionData } = usePrivacyPolicyData();

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
    <div className="font-poppins bg-lightGray lg:container lg:bg-white pb-12 lg:pb-0  my-6 rounded-lg ">
      <div className=" lg:w-[70%] lg:mx-auto pb-8 ">
        <PrivacyPolicyHeader onBack={() => navigate(-1)} />

        <div className="  headerSection pl-6 pt-5 hidden lg:flex flex-col gap-y-7 text-[14px] leading-[24px]  ">
          <p className=" text-grayDark  "> {t('privacypolicy.lastupdated')}: 16.03.2025 </p>
          <p className=" text-smokyBlack ">{t('privacypolicy.intro1')}</p>
          <p className=" text-smokyBlack ">{t('privacypolicy.intro2')}</p>
        </div>

        <p className="pt-12 pb-4 px-4 lg:hidden text-[14px] leading-[24px] text-black3a ">
          {t('privacypolicy.subtitle')}
        </p>

        {/* mobile section  */}
        <div className="lg:hidden ">
          {CategorySectionData.map((section, index) => (
            <PrivacyPolicySection key={index} category={section?.Mobilecategory} item={section} />
          ))}
        </div>

        {/* desktop view  */}
        <div className=" pl-6 hidden lg:block  ">
          {CategorySectionData?.map((section, index) => (
            <div key={index} className=" mt-12 ">
              <h1 className=" font-bold text-smokyBlack text-[18px] leading-[23px] mb-3  ">
                {index + 1} {section?.category}{' '}
              </h1>

              <p className=" text-[14px] leading-[24px] text-smokyBlack "> {section?.title} </p>

              {section?.children?.map((item, index) => (
                <div key={index} className=" mt-6 ">
                  {item?.subHeading && (
                    <p className=" font-semibold text-[14px] leading-[24px] text-smokyBlack  ">
                      {String.fromCharCode(97 + index)}. {item?.subHeading}{' '}
                    </p>
                  )}

                  <ul className=" pl-5 ">
                    {item?.points?.map((point, idx) => (
                      <SafeHtml
                        key={idx}
                        as="li"
                        html={point}
                        className="list-disc text-left text-[14px] leading-[24px] text-smokyBlack "
                      />
                    ))}
                  </ul>
                </div>
              ))}

              {section?.paragraph && (
                <SafeHtml
                  as="p"
                  html={section.paragraph}
                  className={`  text-[14px] leading-[24px] text-smokyBlack mt-6 ${section?.category === 'Data Security' && 'pl-5 '}   `}
                />
              )}
            </div>
          ))}
        </div>

        {/* end section  */}
        <div className=" mt-14 pl-6  hidden lg:block  ">
          <h1 className="  font-bold text-smokyBlack text-[18px] leading-[23px] mb-3 ">
            {t('privacypolicy.end.title')}
          </h1>
          <p className="text-[14px] leading-[24px] text-smokyBlack">
            {t('privacypolicy.end.description')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
