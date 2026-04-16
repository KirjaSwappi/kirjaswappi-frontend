/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus } from 'react-icons/fi';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import filtergrayIcon from '../../../assets/filtergray.svg';
import sortByIcon from '../../../assets/sortBy.svg';
import Button from '../../../components/shared/Button';
import Image from '../../../components/shared/Image';
import {
  setFilterOpen,
  setIsCategoryOrFilterOrSortBy,
} from '../../../redux/feature/filter/filterSlice';
import { setLoginModalOpen } from '../../../redux/feature/open/openSlice';
import { useAppSelector } from '../../../redux/hooks';
import { FilterItemEnum } from '../../../utility/enum';
import CategorySlider from './CategorySlider';

export default function Filter() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInformation } = useAppSelector((state) => state.auth);
  const [isFixed, setIsFixed] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headerHeight = 80;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (!placeholderRef.current || !filterRef.current) return;

        const rect = placeholderRef.current.getBoundingClientRect();
        const shouldBeFixed = rect.top <= headerHeight;

        if (shouldBeFixed !== isFixed) {
          if (shouldBeFixed) {
            const height = filterRef.current.getBoundingClientRect().height;
            placeholderRef.current.style.height = `${height}px`;
          } else {
            placeholderRef.current.style.height = 'auto';
          }
          setIsFixed(shouldBeFixed);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFixed]);

  const isFilterOrCategoryOrSortByFn = (value: FilterItemEnum | null) => {
    dispatch(setIsCategoryOrFilterOrSortBy(value));
    dispatch(setFilterOpen(true));
  };

  return (
    <div ref={placeholderRef} className="w-full">
      <div
        ref={filterRef}
        className={`z-10 transition-[transform,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
          isFixed
            ? 'fixed top-[80px] left-0 right-0 bg-white shadow-md border-t border-platinumMix translate-y-0'
            : 'relative bg-transparent border-none translate-y-0'
        }`}
      >
        <div
          className={`${isFixed ? 'container py-3' : 'pb-6 pt-5'} flex items-center justify-between`}
        >
          <div className="flex items-center gap-2">
            <Button
              className="bg-primary flex items-center gap-2 text-white px-4 py-2 rounded-lg font-poppins text-sm font-medium"
              onClick={() => {
                if (userInformation.id) {
                  navigate('/profile/add-book');
                } else {
                  dispatch(setLoginModalOpen(true));
                }
              }}
            >
              <FiPlus />
              {t('books.addBook')}
            </Button>
          </div>
          <div className="flex-1 min-w-0 max-w-[48%]">
            <CategorySlider isFixed={isFixed} />
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => isFilterOrCategoryOrSortByFn(FilterItemEnum.FILTER)}
              className="border border-platinum bg-white flex items-center gap-2 text-blackOlive px-4 py-2 rounded-lg font-poppins text-sm font-medium"
            >
              <Image src={filtergrayIcon} alt="filter" /> {t('books.filter')}
            </Button>
            <Button
              onClick={() => isFilterOrCategoryOrSortByFn(FilterItemEnum.SORTBY)}
              className="border border-platinum bg-white flex items-center gap-2 text-blackOlive px-4 py-2 rounded-lg font-poppins text-sm font-medium"
            >
              <Image src={sortByIcon} alt="sort" /> {t('books.sort')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
