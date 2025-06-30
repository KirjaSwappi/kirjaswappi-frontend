import React, { useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import Image from '../../../components/shared/Image';
import { BookImageSliderProps } from '../types/interface';

const BookImageSlider: React.FC<BookImageSliderProps> = ({ images, className }) => {
  const [current, setCurrent] = useState(0);
  const total = images.length;
  const goTo = (i: number) => setCurrent((i + total) % total);

  const getStyle = (i: number) => {
    const pos = (i - current + total) % total;
    const base = 'translateX(-50%) translateY(-50%)';
    if (pos === 0)
      return {
        transform: `${base} scale(1)`,
        zIndex: 30,
        opacity: 1,
        filter: 'none',
        boxShadow: '0 8px 32px #0002',
        borderRadius: '8px',
      };
    if (pos === 1 || pos === total - 1)
      return {
        transform: `${base} scale(0.85) translateX(${pos === 1 ? '70px' : '-70px'})`,
        zIndex: 20,
        opacity: 0.6,
        filter: 'brightness(0.7)',
        boxShadow: '0 4px 16px #0001',
        borderRadius: '8px',
      };
    return {
      transform: `${base} scale(0.6)`,
      zIndex: 10,
      opacity: 0,
      filter: 'brightness(0.5)',
      borderRadius: '8px',
    };
  };

  return (
    <div className={`flex flex-col items-center justify-center w-full ${className || ''}`}>
      <div className="relative w-full max-w-[180px] h-[200px] flex items-center justify-center">
        {images.map((img: string, i: number) => (
          <div
            key={i}
            style={getStyle(i)}
            onClick={() => setCurrent(i)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setCurrent(i)}
            role="button"
            tabIndex={0}
            className="absolute left-1/2 top-1/2 w-[160px] h-[190px] transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] cursor-pointer"
          >
            <div className="w-full h-full rounded-lg shadow-2xl overflow-hidden relative">
              <Image
                src={img}
                alt={`Book ${i + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-r from-transparent to-black opacity-20 pointer-events-none" />
            </div>
          </div>
        ))}

        {total > 2 && (
          <button
            onClick={() => goTo(current - 1)}
            aria-label="Previous image"
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-6 h-[23px] rounded-full bg-white border-none shadow-[0_2px_8px_#0002] shadow-md hover:shadow-lg transition-all duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-105"
          >
            <MdChevronLeft size={20} color="#222" />
          </button>
        )}

        {total > 1 && (
          <button
            onClick={() => goTo(current + 1)}
            aria-label="Next image"
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-6 h-[23px] rounded-full bg-white border-none shadow-[0_2px_8px_#0002] shadow-md hover:shadow-lg transition-all duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-105"
          >
            <MdChevronRight size={20} color="#222" />
          </button>
        )}
      </div>

      {total > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {images.map((_: string, i: number) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                i === current
                  ? 'bg-blue-500 scale-110 shadow-sm'
                  : 'bg-[#D4DCF5] hover:bg-gray-400 hover:scale-105'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookImageSlider;
