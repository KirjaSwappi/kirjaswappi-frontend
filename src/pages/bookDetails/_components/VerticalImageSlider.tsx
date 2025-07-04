import { useState } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import Button from '../../../components/shared/Button';
import { Carousel, CarouselContent, CarouselItem } from '../../../components/shared/Carousel';
import Image from '../../../components/shared/Image';

export default function VerticalImageSlider({ images }: { images: string[] }) {
  const [selected, setSelected] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const changeImage = (index: number) => {
    if (index === selected) return;
    setTransitioning(true);
    setTimeout(() => {
      setSelected(index);
      setTransitioning(false);
    }, 300);
  };

  const goPrev = () => {
    changeImage(selected === 0 ? images.length - 1 : selected - 1);
  };

  const goNext = () => {
    changeImage((selected + 1) % images.length);
  };
  return (
    <div className="flex items-start gap-5">
      <Carousel
        opts={{
          align: 'end',
          loop: true,
        }}
        className="w-[90px]"
        orientation="vertical"
      >
        <CarouselContent
          className={`flex gap-4 flex-col py-2 px-1.5 w-[86px] basis-[94px] h-[400px]`}
        >
          {images.map((src, idx) => (
            <CarouselItem key={idx} className="pt-0">
              <Button
                onClick={() => setSelected(idx)}
                className={`block w-full rounded-md ${
                  selected === idx ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <Image
                  src={src}
                  alt={`Slide ${idx}`}
                  className="rounded-md object-cover h-20 w-full"
                />
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="flex flex-col items-center gap-4 relative w-[497px] h-[480px]">
        <div
          className={`absolute w-full h-full transition-all duration-300 ease-in-out ${
            transitioning ? 'opacity-0 translate-x-5' : 'opacity-100 translate-x-0'
          }`}
        >
          <Image
            key={images[selected]}
            src={images[selected]}
            alt={`Preview-${selected}`}
            className="rounded-lg object-cover w-full h-full"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="flex items-center gap-2 absolute bottom-6 right-6">
          <Button
            onClick={goPrev}
            className="bg-white border border-[#F2F2F2] w-8 h-8 flex items-center justify-center rounded-full"
          >
            <BiChevronLeft className="text-[#262626] text-xl" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            onClick={goNext}
            className="bg-white border border-[#F2F2F2] w-8 h-8 flex items-center justify-center rounded-full"
          >
            <BiChevronRight className="text-[#262626] text-xl" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
