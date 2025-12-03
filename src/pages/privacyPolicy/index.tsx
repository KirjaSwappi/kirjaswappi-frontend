import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import PrivacyPolicyHeader from './components/PrivacyPolicyHeader';
import PrivacyPolicySection from './components/PrivacyPolicySection';
import { dummyCategorySection } from './constants/DummyData';

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

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
          <p className=" text-grayDark  ">Last Updated: 16.03.2025 </p>
          <p>
            {' '}
            Welcome to KirjaSwappi (kirjaswappi.fi). We are committed to protecting your privacy and
            ensuring that your personal information is handled in a safe and responsible manner.
            This Privacy Policy outlines how we collect, use, store, and protect your information
            when you use our Website.
          </p>
          <p>
            By using KirjaSwappi, you agree to the terms of this Privacy Policy. If you do not agree
            with any part of this policy, please do not use our Website.
          </p>
        </div>

        <p className="pt-12 pb-4 px-4 lg:hidden text-[14px] leading-[24px] text-black3a ">
          {t('privacypolicy.subtitle')}
        </p>

        {/* mobile section  */}
        <div className="lg:hidden ">
          {dummyCategorySection.map((section, index) => (
            <PrivacyPolicySection key={index} category={section?.Mobilecategory} item={section} />
          ))}
        </div>

        {/* desktop view  */}
        <div className=" pl-6 hidden lg:block  ">
          {dummyCategorySection?.map((section, index) => (
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
                      <li
                        key={idx}
                        className="list-disc text-left text-[14px] leading-[24px] text-smokyBlack "
                        dangerouslySetInnerHTML={{ __html: point }}
                      />
                    ))}
                  </ul>
                </div>
              ))}

              {section?.paragraph && (
                <p
                  className={`  text-[14px] leading-[24px] text-smokyBlack mt-6 ${section?.category === 'Data Security' && 'pl-5 '}   `}
                  dangerouslySetInnerHTML={{ __html: section?.paragraph }}
                />
              )}
            </div>
          ))}
        </div>

        {/* end section  */}
        <div className=" mt-14 pl-6  hidden lg:block  ">
          <h1 className="  font-bold text-smokyBlack text-[18px] leading-[23px] mb-3 ">
            End of Privacy Policy
          </h1>
          <p className="text-[14px] leading-[24px] text-smokyBlack">
            This template is designed to be comprehensive and compliant with general privacy laws,
            such as the GDPR and CCPA. However, you may want to consult a legal professional to
            ensure it meets all specific requirements for your jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
