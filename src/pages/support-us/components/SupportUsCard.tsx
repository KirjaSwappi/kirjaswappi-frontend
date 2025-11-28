import { TSupportSection } from '..';
import Button from '../../../components/shared/Button';

type TPageProps = {
  data: TSupportSection;
};

export default function SupportUsCard({ data }: TPageProps) {
  console.log(data);

  return (
    <section className="w-full   ">
      <div className="mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          {/* Text Content */}
          <div
            className={`col-span-2 lg:col-span-1 flex flex-col gap-0 lg:gap-6 ${data?.textOrder === 1 ? 'order-1  ' : 'order-2'} `}
          >
            <h1 className="text-2xl  font-bold "> {data?.title} </h1>
            <p className="text-base text-blackOlive leading-relaxed">{data?.description}</p>
            <div className=" mt-4 lg:mt-20 ">
              <Button className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium">
                {data?.buttonText}
              </Button>
            </div>
          </div>

          {/* Image */}
          <div
            className={` hidden lg:flex justify-center ${data?.textOrder === 1 ? 'order-2' : 'order-1'} `}
          >
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <img
                src={data?.image}
                // src="/public/images/supportUs/img1.jpg"
                alt={data?.title}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
