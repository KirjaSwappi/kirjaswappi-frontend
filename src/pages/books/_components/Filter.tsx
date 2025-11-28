import { useEffect, useRef, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import CategoryIcon from '../../../assets/categoryIcon.svg';
import filtergrayIcon from '../../../assets/filtergray.svg';
import sortByIcon from '../../../assets/sortBy.svg';
import Button from '../../../components/shared/Button';
import Image from '../../../components/shared/Image';
import {
  setFilterOpen,
  setIsCategoryOrFilterOrSortBy,
} from '../../../redux/feature/filter/filterSlice';
import { FilterItemEnum } from '../../../utility/enum';
import CategorySlider from './CategorySlider';

export default function Filter() {
  const dispatch = useDispatch();
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

  const isFilterOrCategoryOrSortByFn = (value: FilterItemEnum | null) => {
    dispatch(setIsCategoryOrFilterOrSortBy(value));
    dispatch(setFilterOpen(true));
  };

  return (
    <div ref={placeholderRef} className="w-full  ">
      <div
        ref={filterRef}
        className={`z-10 ${
          isFixed
            ? 'fixed top-[80px] left-0 right-0 bg-white shadow-md border-t border-platinumMix'
            : 'relative bg-transparent border-none'
        }`}
      >
        <div
          className={`${isFixed ? 'container' : ''} pb-6 pt-5 flex items-center justify-between`}
        >
          {/* left section  */}
          <div className="flex items-center gap-2  ">
            <Button
              onClick={() => isFilterOrCategoryOrSortByFn(FilterItemEnum.CATEGORY)}
              className=" border border-platinum bg-white flex items-center gap-2 text-blackOlive px-4 py-2 rounded-lg font-poppins text-sm font-medium"
            >
              <Image src={CategoryIcon} alt="category" /> Category
            </Button>
            <Button className=" bg-primary flex items-center gap-2 text-white px-4 py-2 rounded-lg font-poppins text-sm font-medium">
              <FiPlus />
              Add Book
            </Button>
          </div>

          {/* middle section --> category section slider */}
          <div className=" flex-1 min-w-0 max-w-[40%] ">
            <CategorySlider />
          </div>

          {/* right section --> filter , sort  */}
          <div className="flex items-center gap-2 ">
            <Button
              onClick={() => isFilterOrCategoryOrSortByFn(FilterItemEnum.FILTER)}
              className=" border border-platinum bg-white flex items-center gap-2 text-blackOlive px-4 py-2 rounded-lg font-poppins text-sm font-medium"
            >
              <Image src={filtergrayIcon} alt="category" /> Filter
            </Button>
            <Button
              onClick={() => isFilterOrCategoryOrSortByFn(FilterItemEnum.SORTBY)}
              className=" border border-platinum bg-white flex items-center gap-2 text-blackOlive px-4 py-2 rounded-lg font-poppins text-sm font-medium"
            >
              <Image src={sortByIcon} alt="category" /> Sort
              <MdKeyboardArrowDown />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
