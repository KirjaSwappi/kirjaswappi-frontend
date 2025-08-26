import { useEffect, useRef, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { MdKeyboardArrowDown } from 'react-icons/md';
import CategoryIcon from '../../../assets/categoryIcon.svg';
import filtergrayIcon from '../../../assets/filtergray.svg';
import Button from '../../../components/shared/Button';
import Image from '../../../components/shared/Image';
export default function Filter() {
  const [isFixed, setIsFixed] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headerHeight = 80;

    const handleScroll = () => {
      if (filterRef.current && placeholderRef.current) {
        const rect = placeholderRef.current.getBoundingClientRect();

        if (rect.top <= headerHeight) {
          setIsFixed(true);
        } else {
          setIsFixed(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={placeholderRef} className="w-full">
      <div
        ref={filterRef}
        className={`z-50  ${
          isFixed
            ? 'fixed top-[80px] left-0 right-0 bg-white shadow-md border-t border-platinumMix'
            : 'relative bg-transparent border-none'
        }`}
      >
        <div
          className={`${isFixed ? 'container' : ''} pb-6 pt-5 flex items-center justify-between`}
        >
          <div className="flex items-center gap-2">
            <Button className=" border border-platinum bg-white flex items-center gap-2 text-blackOlive px-4 py-2 rounded-lg font-poppins text-sm font-medium">
              <Image src={CategoryIcon} alt="category" /> Category
            </Button>
            <Button className=" bg-primary flex items-center gap-2 text-white px-4 py-2 rounded-lg font-poppins text-sm font-medium">
              <FiPlus />
              Add Book
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button className=" border border-platinum bg-white flex items-center gap-2 text-blackOlive px-4 py-2 rounded-lg font-poppins text-sm font-medium">
              <Image src={filtergrayIcon} alt="category" /> Filter
            </Button>
            <Button className=" border border-platinum bg-white flex items-center gap-2 text-blackOlive px-4 py-2 rounded-lg font-poppins text-sm font-medium">
              <Image src={filtergrayIcon} alt="category" /> Sort
              <MdKeyboardArrowDown />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
