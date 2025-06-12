import { useState } from 'react';
import Image from '../../../components/shared/Image';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 2 : prev - 1));
  };

  return (
    <section className="relative w-full bg-[#C5CCD6] rounded-lg overflow-hidden mt-20">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left side content */}
          <div className="md:w-1/2 space-y-4 md:space-y-6 z-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
              Your Next Read Is Waiting
            </h1>
            <p className="text-gray-700 md:text-lg">
              A simple, sustainable way to find your next read—one swap at a time.
            </p>
          </div>

          {/* Right side astronaut image */}
          <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <Image
                src="/astronaut-reading.png"
                alt="Astronaut reading a book"
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Centered search bar */}
        <div className="flex justify-center mt-8 md:mt-12">
          <div id="hero-search" className="w-full max-w-2xl"></div>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center space-x-2 mt-8">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-8 h-2 rounded-full ${currentSlide === index ? 'bg-blue-500' : 'bg-gray-300'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md"
        aria-label="Previous slide"
      >
        <MdKeyboardArrowLeft className="h-6 w-6 text-gray-700" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md"
        aria-label="Next slide"
      >
        <MdKeyboardArrowRight className="h-6 w-6 text-gray-700" />
      </button>
    </section>
  );
}
