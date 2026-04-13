/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus } from 'react-icons/fi';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CategoryIcon from '../../../assets/categoryIcon.svg';
import filtergrayIcon from '../../../assets/filtergray.svg';
import mapIcon from '../../../assets/uiw_map.svg';
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
    const handleScroll = () => {
      if (!filterRef.current || !placeholderRef.current) return;

      const rect = placeholderRef.current.getBoundingClientRect();
      const shouldBeFixed = rect.top <= headerHeight;

      if (shouldBeFixed && !isFixed) {
        // measure before taking out of document flow
        const height = filterRef.current.getBoundingClientRect().height;
        placeholderRef.current.style.height = `${height}px`;
        setIsFixed(true);
      } else if (!shouldBeFixed && isFixed) {
        // play slide-out animation while keeping the element fixed,
        // then switch back to relative after animation completes to avoid jump
        const el = filterRef.current;
        if (!el) return;
        const onAnimationEnd = (ev: AnimationEvent) => {
          if (ev.animationName === 'filterSlideOut') {
            el.classList.remove('filter-slide-out');
            setIsFixed(false);
            placeholderRef.current!.style.height = 'auto';
            el.removeEventListener('animationend', onAnimationEnd as any);
          }
        };

        el.addEventListener('animationend', onAnimationEnd as any);
        el.classList.add('filter-slide-out');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFixed]);

  const slideStyle = `
.filter-slide-in {
  animation: filterSlideIn 220ms cubic-bezier(.25,.8,.25,1) both;
  will-change: transform;
}
@keyframes filterSlideIn {
  from { transform: translateY(-12px); }
  to { transform: translateY(0); }
}
.filter-slide-out {
  animation: filterSlideOut 180ms cubic-bezier(.4,0,.2,1) both;
  will-change: transform;
}
@keyframes filterSlideOut {
  from { transform: translateY(0); }
  to { transform: translateY(-12px); }
}
`;

  const isFilterOrCategoryOrSortByFn = (value: FilterItemEnum | null) => {
    dispatch(setIsCategoryOrFilterOrSortBy(value));
    dispatch(setFilterOpen(true));
  };

  return (
    <div ref={placeholderRef} className="w-full  ">
      <style>{slideStyle}</style>
      <div
        ref={filterRef}
        className={`z-10 ${
          isFixed
            ? 'fixed top-[80px] left-0 right-0 bg-white shadow-md border-t border-platinumMix filter-slide-in'
            : 'relative bg-transparent border-none'
        }`}
      >
        <div
          className={`${isFixed ? 'container py-3' : 'pb-6 pt-5 '}  flex items-center justify-between`}
        >
          <div className="flex items-center gap-2  ">
            <Button
              onClick={() => isFilterOrCategoryOrSortByFn(FilterItemEnum.CATEGORY)}
              className=" border border-platinum bg-white flex items-center gap-2 text-blackOlive px-4 py-2 rounded-lg font-poppins text-sm font-medium"
            >
              <Image src={CategoryIcon} alt="category" /> {t('books.category')}
            </Button>
            <Button
              className=" bg-primary flex items-center gap-2 text-white px-4 py-2 rounded-lg font-poppins text-sm font-medium"
              onClick={() => {
                if (userInformation.id) {
                  navigate(`/profile/user-profile/${userInformation.id}`);
                } else {
                  dispatch(setLoginModalOpen(true));
                }
              }}
            >
              <FiPlus />
              {t('books.addBook')}
            </Button>
          </div>
          <div className=" flex-1 min-w-0 max-w-[48%] ">
            <CategorySlider isFixed={isFixed} />
          </div>

          <div className="flex items-center gap-2 ">
            <Button
              onClick={() => navigate('/map')}
              className=" border border-platinum bg-white flex items-center gap-2 text-blackOlive px-4 py-2 rounded-lg font-poppins text-sm font-medium"
            >
              <Image src={mapIcon} alt="map" className="w-[18px] h-[18px]" /> {t('books.map')}
            </Button>
            <Button
              onClick={() => isFilterOrCategoryOrSortByFn(FilterItemEnum.FILTER)}
              className=" border border-platinum bg-white flex items-center gap-2 text-blackOlive px-4 py-2 rounded-lg font-poppins text-sm font-medium"
            >
              <Image src={filtergrayIcon} alt="category" /> {t('books.filter')}
            </Button>
            <Button
              onClick={() => isFilterOrCategoryOrSortByFn(FilterItemEnum.SORTBY)}
              className=" border border-platinum bg-white flex items-center gap-2 text-blackOlive px-4 py-2 rounded-lg font-poppins text-sm font-medium"
            >
              <Image src={sortByIcon} alt="category" /> {t('books.sort')}
              <MdKeyboardArrowDown />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
