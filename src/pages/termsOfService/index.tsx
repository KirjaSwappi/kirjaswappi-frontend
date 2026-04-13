import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import TermsOfServiceHeader from './components/TermsOfServiceHeader';
import TermsOfServiceSection from './components/TermsOfServiceSection';
import { useTermsOfServiceData } from './components/useTermsOfServiceData';

const TermsOfService = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { CategorySectionData } = useTermsOfServiceData();

  return (
    <div className="font-poppins bg-lightGray lg:container lg:bg-white pb-12 lg:pb-0  my-6 rounded-lg ">
      <div className=" lg:w-[70%] lg:mx-auto pb-8 ">
        <TermsOfServiceHeader onBack={() => navigate(-1)} />

        <div className="  headerSection pl-6 pt-5 hidden lg:flex flex-col gap-y-7 text-[14px] leading-[24px]  ">
          <p className=" text-grayDark  "> {t('termsofservice.lastupdated')}: 13.04.2026 </p>
          <p className=" text-smokyBlack ">{t('termsofservice.intro')}</p>
        </div>

        <p className="pt-12 pb-4 px-4 lg:hidden text-[14px] leading-[24px] text-black3a ">
          {t('termsofservice.subtitle')}
        </p>

        {/* mobile section  */}
        <div className="lg:hidden ">
          {CategorySectionData.map((section, index) => (
            <TermsOfServiceSection key={index} category={section?.Mobilecategory} item={section} />
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

              {section?.children?.map((item, childIndex) => (
                <div key={childIndex} className=" mt-6 ">
                  {item?.subHeading && (
                    <p className=" font-semibold text-[14px] leading-[24px] text-smokyBlack  ">
                      {String.fromCharCode(97 + childIndex)}. {item?.subHeading}{' '}
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
                  className=" text-[14px] leading-[24px] text-smokyBlack mt-6 "
                  dangerouslySetInnerHTML={{ __html: section?.paragraph }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
