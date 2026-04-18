import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import TermsOfServiceHeader from './TermsOfServiceHeader';
import { useTermsOfServiceData } from './useTermsOfServiceData';

const TermsOfServiceDetail: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { sectionKey } = useParams<{ sectionKey: string }>();

  const { getSectionById } = useTermsOfServiceData();
  const sectionData = getSectionById(Number(sectionKey));

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        navigate('/terms-of-service', { replace: true });
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  if (!sectionData) {
    return (
      <div className="font-poppins pb-24 lg:bg-white lg:container">
        <div className="pt-[56px] lg:max-w-3xl lg:mx-auto lg:px-12">
          <TermsOfServiceHeader onBack={() => navigate('/terms-of-service')} />
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">{t('error.sectionNotFound')}</h2>
            <p>{t('error.sectionNotFoundDesc')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-poppins  min-h-screen pb-32 ">
      <div className="pt-[56px] lg:max-w-3xl lg:mx-auto lg:px-12">
        <TermsOfServiceHeader onBack={() => navigate('/terms-of-service')} />

        <div className="px-4 sm:px-6 mt-6 ">
          <h1 className=" font-semibold text-[16px] leading-[28px] text-black3a  ">
            {sectionData?.Mobilecategory}{' '}
          </h1>

          <p className="text-[14px] leading-[24px] mt-6 "> {sectionData?.title} </p>

          {sectionData?.children?.map((item, index) => (
            <div key={index} className=" mt-10 ">
              {item?.subHeading && (
                <p className=" font-semibold text-[14px] leading-[24px] text-smokyBlack ">
                  {String.fromCharCode(97 + index)}. {item?.subHeading}{' '}
                </p>
              )}

              <ul className=" pl-8 pt-2 ">
                {item?.points?.map((point, idx) => (
                  <li
                    key={idx}
                    className="list-disc  text-left  text-[16px] leading-[28px] text-smokyBlack "
                    dangerouslySetInnerHTML={{ __html: point }}
                  />
                ))}
              </ul>
            </div>
          ))}

          {sectionData?.paragraph && (
            <p
              className=" mt-6 text-[14px] leading-[24px] text-black3a "
              dangerouslySetInnerHTML={{ __html: sectionData?.paragraph }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceDetail;
