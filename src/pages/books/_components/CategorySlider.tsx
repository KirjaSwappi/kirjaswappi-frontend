import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import { useRef } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import type { Swiper as SwiperType } from 'swiper';

interface ICategory {
  id: number;
  name: string;
}

const CategoryData: ICategory[] = [
  {
    id: 1,
    name: 'Novel1',
  },

  {
    id: 2,
    name: 'Novel2',
  },
  {
    id: 3,
    name: 'Novel3',
  },
  {
    id: 4,
    name: 'Novel4',
  },
  {
    id: 5,
    name: 'Novel5',
  },
  {
    id: 6,
    name: 'Novel6',
  },
];

export default function CategorySlider() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className=" flex justify-center items-center gap-x-3  ">
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="flex items-center justify-center rounded-full bg-white transition-all duration-300 disabled:opacity-50 py-[10px] px-[9px] shadow "
        aria-label="Previous slide"
      >
        <IoIosArrowBack className="text-blackOlive text-base transition-all duration-300 " />
      </button>

      <Swiper
        slidesPerView={4}
        spaceBetween={1}
        loop={true}
        navigation={false}
        modules={[Pagination, Navigation]}
        className="mySwiper  "
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {CategoryData.map((category) => (
          <SwiperSlide key={category?.id} className="  cursor-pointer py-0.5  ">
            <span className="cursor-pointer font-poppins bg-white py-1.5 px-4 text-grayDark font-medium rounded-[27px] shadow-md ">
              {category?.name}
            </span>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="flex items-center justify-center rounded-full bg-white transition-all duration-300 disabled:opacity-50 py-[10px] px-[9px] shadow "
        aria-label="Previous slide"
      >
        <IoIosArrowForward className="text-blackOlive text-base transition-all duration-300 " />
      </button>
    </div>
  );
}
