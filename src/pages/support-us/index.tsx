import SupportUsCard from './components/SupportUsCard';

export type TSupportSection = {
  id: number;
  title: string;
  description: string;
  buttonText: string;
  image: string;
  textOrder: number;
};

export const supportSectionsData: TSupportSection[] = [
  {
    id: 1,
    title: 'Donate',
    description:
      'Your financial contribution directly supports our programs and services, helping us reach more individuals and families in need. Every donation, no matter the size, makes a significant impact.',
    buttonText: 'Make a Donation',
    image: '/images/supportUs/img1.jpg',
    textOrder: 1,
  },
  {
    id: 2,
    title: 'Collaboration',
    description:
      'Collaborate with us to amplify our impact and reach a wider audience. We welcome partnerships with businesses, organizations, and individuals who share our commitment to community support.',
    buttonText: 'Move Forward',
    image: '/images/supportUs/img2.jpg',
    textOrder: 2,
  },
  {
    id: 3,
    title: 'Partner With Us',
    description:
      "Join us in making a difference by donating your time and skills. Volunteers play a vital role in supporting our programs and extending our reach in the community. Whether it's a few hours or regular commitment, your involvement matters.",
    buttonText: 'Apply',
    image: '/images/supportUs/img3.jpg',
    textOrder: 1,
  },
];

const SupportUs = () => {
  return (
    <div className="font-poppins pb-24 lg:bg-white lg:container  mt-6  ">
      <div className="pt-[56px] lg:max-w-[80%] lg:mx-auto lg:px-12  ">
        {/*  */}
        <div className=" flex flex-col gap-y-36 ">
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
