import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SupportUsCard from './components/SupportUsCard';
import SupportUsHeader from './components/SupportUsHeader';

export type TSupportSection = {
  id: number;
  title: string;
  description: string;
  buttonText: string;
  image: string;
  textOrder: number;
  pageLink: string;
};

const SupportUs = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const supportSectionsData: TSupportSection[] = [
    {
      id: 1,
      title: t('supportUs.sectionTitle1'),
      description: t('supportUs.sectionDescription1'),

      buttonText: t('supportUs.sectionBtn1'),

      image: '/src/assets/images/supportUs/img1.jpg',
      textOrder: 1,
      pageLink: '/donation',
    },
    {
      id: 2,
      title: t('supportUs.sectionTitle2'),
      description: t('supportUs.sectionDescription2'),
      buttonText: t('supportUs.sectionBtn2'),

      image: '/src/assets/images/supportUs/img2.jpg',
      textOrder: 2,
      pageLink: '/collaboration',
    },

    {
      id: 3,
      title: t('supportUs.sectionTitle3'),
      description: t('supportUs.sectionDescription3'),
      buttonText: t('supportUs.sectionBtn3'),

      image: '/src/assets/images/supportUs/img3.jpg',
      textOrder: 1,
      pageLink: '/volunteer',
    },
  ];

  return (
    <div className="font-poppins bg-lightGray lg:container lg:bg-white pb-20 lg:pb-10 mb-6 mt-0 lg:mt-6 rounded-lg ">
      <div className="pt-[72px] lg:max-w-[70%] lg:mx-auto px-4 lg:px-0   ">
        {/* mobile header  */}
        <SupportUsHeader onBack={() => navigate(-1)} />

        {/*  */}
        <div className="mt-8 flex flex-col gap-y-5 lg:gap-y-[8.8rem]  ">
          {supportSectionsData?.map((item) => (
            <SupportUsCard key={item?.id} data={item} />
          ))}
        </div>

        {/*  */}
      </div>
    </div>
  );
};

export default SupportUs;
