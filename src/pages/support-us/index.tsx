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

export const supportSectionsData: TSupportSection[] = [
  {
    id: 1,
    title: 'Donate',
    description:
      'Your financial contribution directly supports our programs and services, helping us reach more individuals and families in need. Every donation, no matter the size, makes a significant impact.',
    buttonText: 'Make a Donation',

    image: '/src/assets/images/supportUs/img1.jpg',
    textOrder: 1,
    pageLink: '/donation',
  },
  {
    id: 2,
    title: 'Collaboration',
    description:
      'Collaborate with us to amplify our impact and reach a wider audience. We welcome partnerships with businesses, organizations, and individuals who share our commitment to community support.',
    buttonText: 'Move Forward',

    image: '/src/assets/images/supportUs/img2.jpg',
    textOrder: 2,
    pageLink: '/collaboration',
  },

  {
    id: 3,
    title: 'Volunteer',
    description:
      'Join us in making a difference by donating your time and skills. Volunteers play a vital role in supporting our programs and extending our reach in the community. Whether it’s a few hours or a regular commitment, your involvement matters.',
    buttonText: 'Apply',

    image: '/src/assets/images/supportUs/img3.jpg',
    textOrder: 1,
    pageLink: '/volunteer',
  },
];

const SupportUs = () => {
  const navigate = useNavigate();

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
