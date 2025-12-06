import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import { useEffect, useRef, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import type { Swiper as SwiperType } from 'swiper';
import { setGenreFilter } from '../../../redux/feature/filter/filterSlice';
import { useGetGenreQuery } from '../../../redux/feature/genre/genreApi';

interface ICategory {
  id: string;
  name: string;
}

export default function CategorySlider() {
  const swiperRef = useRef<SwiperType | null>(null);

  const dispatch = useDispatch();

  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const { data: genreData = [], isLoading: isGenreLoading } = useGetGenreQuery(undefined);

  const parentGenres = genreData?.parentGenres ?? {};

  const CategoryData = Object.values(parentGenres as ICategory[] | []).map((value: ICategory) => ({
    id: value.id,
    label: value.name,
  }));

  console.log(selectedGenre);

  const handleSelectGenre = (genreId: string) => {
    if (genreId === selectedGenre) {
      setSelectedGenre(null);
      return;
    }

    setSelectedGenre(genreId);
  };

  useEffect(() => {
    if (selectedGenre) {
      dispatch(setGenreFilter([selectedGenre]));
    }
  }, [selectedGenre, dispatch]);

  if (isGenreLoading) {
    return <p>loading....</p>;
  }

  return (
    <div className=" flex justify-between items-center gap-x-3  ">
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="flex items-center justify-center rounded-full bg-white transition-all duration-300 disabled:opacity-50 py-[10px] px-[9px] shadow "
        aria-label="Previous slide"
      >
        <IoIosArrowBack className="text-blackOlive text-base transition-all duration-300 " />
      </button>

      <Swiper
        slidesPerView={4}
        spaceBetween={0}
        loop={true}
        navigation={false}
        modules={[Pagination, Navigation]}
        className="mySwiper  flex justify-between items-center "
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {CategoryData.map((category) => (
          <SwiperSlide key={category?.id} className=" py-0.5  ">
            <button
              className={`cursor-pointer font-poppins  py-2 px-5 t font-medium rounded-[27px] shadow-md text-[14px] ${category?.id === selectedGenre ? ' bg-[#BADBFD] text-primary ' : 'ext-grayDark bg-white '} `}
              onClick={() => handleSelectGenre(category.id)}
            >
              {category.label}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="flex items-center justify-center rounded-full bg-white transition-all duration-300 disabled:opacity-50 py-[10px] px-[9px] shadow "
        aria-label="Previous slide"
      >
        <IoIosArrowForward className="text-blackOlive text-base transition-all duration-300 " />
      </button>
    </div>
  );
}
