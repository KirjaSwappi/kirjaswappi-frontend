import { useEffect, useState } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import heroImg from '../../../assets/heroSectionImage.png';
import Button from '../../../components/shared/Button';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '../../../components/shared/Carousel';
import Image from '../../../components/shared/Image';
import { cn } from '../../../utility/cn';
import BookSearchBar from './BookSearchBar';

const SLIDES = [
  {
    id: 1,
    title: 'Your Next Read Is Waiting',
    desc: 'A simple, sustainable way to find your next read—one swap at a time.',
    image: heroImg,
  },
  {
    id: 2,
    title: 'Discover New Stories',
    desc: 'Explore books handpicked just for you.',
    image: heroImg,
  },
  {
    id: 3,
    title: 'Discover New Stories',
    desc: 'Explore books handpicked just for you.',
    image: heroImg,
  },
];

export default function HeroSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    onSelect();

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  // scroll --> 251
  // scroll --> 301

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosttion = window.scrollY;

      console.log(scrollPosttion);
    };

    window.addEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="rounded-lg overflow-hidden relative   ">
      {/* search component  */}
      <div className=" hidden lg:block ">
        <div className=" h-[54px] w-[582px] absolute top-[80%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10  ">
          <BookSearchBar />
        </div>
      </div>

      <Carousel opts={{ loop: true }} setApi={setApi}>
        <CarouselContent>
          {SLIDES.map((slide) => (
            <CarouselItem
              key={slide.id}
              className="w-full flex bg-[#BEC6D2] h-[140px] md:h-[210px] lg:h-[312px]"
            >
              <div className="w-7/12 pl-10 md:pl-16 lg:pl-32 pt-4 md:pt-10 lg:pt-20">
                <h2 className="text-base md:text-2xl lg:text-[40px] font-semibold text-[#262626] font-poppins lg:leading-10">
                  {slide.title}
                </h2>
                <p className="text-xs md:text-sm lg:text-base text-[#262626] font-poppins lg:mt-2">
                  {slide.desc}
                </p>
              </div>
              <div className="w-5/12">
                <Image src={slide.image} alt="image" className="w-11/12 lg:-mb-16" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <Button
          onClick={() => api?.scrollPrev()}
          className="absolute left-2 md:left-3 lg:left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-1 lg:p-2"
        >
          <MdKeyboardArrowLeft className="h-4 lg:h-5 w-4 lg:w-5 text-smokyBlack" />
        </Button>
        <Button
          onClick={() => api?.scrollNext()}
          className="absolute right-2 md:right-3 lg:right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-1 lg:p-2"
        >
          <MdKeyboardArrowRight className="h-4 lg:h-5 w-4 lg:w-5 text-smokyBlack" />
        </Button>

        <div className="absolute bottom-3 md:bottom-10 lg:bottom-16 left-10 md:left-16 lg:left-32 flex space-x-2 items-center">
          {SLIDES.map((_, index) => (
            <div
              key={index}
              className={cn(
                'h-2 rounded-full transition-all duration-300 bg-[#3B82F6]',
                selectedIndex === index ? 'w-4 lg:w-6' : 'w-2 opacity-50',
              )}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
}
