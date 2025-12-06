import { Link } from 'react-router-dom';
import { TSupportSection } from '..';
import Button from '../../../components/shared/Button';

type TPageProps = {
  data: TSupportSection;
};

export default function SupportUsCard({ data }: TPageProps) {
  return (
    <section className="w-full font-poppins  ">
      <div className="mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[4rem] xl:gap-[7.5rem] ">
          {/* Text Content */}
          <div
            className={`col-span-2 lg:col-span-1 flex flex-col gap-y-3 lg:gap-y-6 ${data?.textOrder === 1 ? 'order-1  ' : 'order-2'} `}
          >
            <h1 className=" font-semibold text-smokyBlack text-[16px] lg:text-[22px] leading-[28px]">
              {data?.title}
            </h1>
            <p className=" text-[#262626] lg:text-blackOlive text-[14px] lg:text-[16px] leading-[24px]">
              {data?.description}
            </p>
            <div className=" mt-3 lg:mt-[3.4rem]  xl:mt-[4.4rem] ">
              <Link to={`${data?.pageLink}`}>
                <Button className="h-[3rem] lg:h-[2.5rem] w-full lg:w-[9.5rem] bg-primary hover:bg-blue-600 text-[#F7FAFC]  rounded-lg font-medium text-base lg:text-[14px] lg:leading-[21px]">
                  {data?.buttonText}
                </Button>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div
            className={` hidden lg:flex justify-center ${data?.textOrder === 1 ? 'order-2' : 'order-1'} `}
          >
            <div className="relative w-full aspect-video rounded-lg overflow-hidden ">
              <img src={data?.image} alt={data?.title} className="object-cover w-full h-full " />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
