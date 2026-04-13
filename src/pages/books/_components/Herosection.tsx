import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

const SLIDE_KEYS = [
  { titleKey: 'books.heroSlide1Title', descKey: 'books.heroSlide1Desc' },
  { titleKey: 'books.heroSlide2Title', descKey: 'books.heroSlide2Desc' },
  { titleKey: 'books.heroSlide3Title', descKey: 'books.heroSlide3Desc' },
];

export default function HeroSection() {
  const { t } = useTranslation();
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let raf = 0;
    const handle = () => {
      raf = requestAnimationFrame(() => {
        if (!searchRef.current) return;
        const searchRect = searchRef.current.getBoundingClientRect();
        const navEl = document.getElementById('top-nav-bar');
        const navBottom = navEl ? navEl.getBoundingClientRect().bottom : 80;
        const shouldHide = searchRect.top <= navBottom;
        if (shouldHide !== isHidden) {
          setIsHidden(shouldHide);
          window.dispatchEvent(
            new CustomEvent('hero-search-visibility', { detail: { hidden: shouldHide } }),
          );
        }
      });
    };

    window.addEventListener('scroll', handle, { passive: true });
    handle();
    return () => {
      window.removeEventListener('scroll', handle);
      cancelAnimationFrame(raf);
    };
  }, [isHidden]);

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

  return (
    <section className="rounded-lg overflow-hidden relative ">
      <Carousel opts={{ loop: true }} setApi={setApi}>
        <CarouselContent>
          {SLIDE_KEYS.map((slide, index) => (
            <CarouselItem
              key={index}
              className="w-full flex bg-[#BEC6D2] h-[140px] md:h-[210px] lg:h-[312px]"
            >
              <div className="w-7/12 pl-10 md:pl-16 lg:pl-32 pt-4 md:pt-10 lg:pt-20">
                <h2 className="text-base md:text-2xl lg:text-[40px] font-semibold text-[#262626] font-poppins lg:leading-10">
                  {t(slide.titleKey)}
                </h2>
                <p className="text-xs md:text-sm lg:text-base text-[#262626] font-poppins lg:mt-2">
                  {t(slide.descKey)}
                </p>
              </div>
              <div className="w-5/12">
                <Image src={heroImg} alt="image" className="w-11/12 lg:-mb-16" />
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
          {SLIDE_KEYS.map((_, index) => (
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
