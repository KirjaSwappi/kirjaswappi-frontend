import { useEffect } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import useDrawerOutsideClick from '../../hooks/useDrawerOutsideClick';
import { useIsMobile } from '../../hooks/useIsMobile';
import {
  setConditionFilter,
  setGenreFilter,
  setLanguageFilter,
  setSortByFilter,
} from '../../redux/feature/filter/filterSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { FilterItemEnum } from '../../utility/enum';
import BookFilter from './_components/BookFilter/BookFilter';
import { ShowTopHeaderPath } from './_components/ShowTopHeaderPath';
import SideDrawer from './_components/SideDrawer';
import getDrawers from './_components/SideFilterDrawers';
import TopBar from './_components/TopBar';

export default function Header({ showOn404 = false }: { showOn404?: boolean }) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isFilterOpen, isCategoryOrFilterOrSortBy } = useAppSelector((state) => state.filter);
  const categoryRef = useDrawerOutsideClick(FilterItemEnum.CATEGORY).reference;
  const filterRef = useDrawerOutsideClick(FilterItemEnum.FILTER).reference;
  const sortByRef = useDrawerOutsideClick(FilterItemEnum.SORTBY).reference;
  const pathname = location.pathname;
  const params = pathname?.split('/').reverse()[0];
  const showTopHeaderPath = ShowTopHeaderPath(params);
  const isHeaderShow = showTopHeaderPath.includes(pathname) || showOn404;

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      genre: [],
      language: [],
      condition: [],
      sortBy: [],
    },
  });
  const { control } = methods;
  const watchedFields = useWatch({
    control,
    name: ['genre', 'language', 'condition', 'sortBy'],
  });

  useEffect(() => {
    const [genre, language, condition, sortBy] = watchedFields;
    dispatch(setGenreFilter(genre));
    dispatch(setLanguageFilter(language));
    dispatch(setConditionFilter(condition));
    dispatch(setSortByFilter(sortBy));
  }, [watchedFields, dispatch]);

  const drawers = getDrawers(categoryRef, filterRef, sortByRef);

  return (
    <header
      className={`  ${isHeaderShow ? 'pb-28 lg:pb-20' : 'pb-0'} ${pathname !== '/' ? 'hidden lg:block' : ''} `}
    >
      <FormProvider {...methods}>
        {drawers.map(({ type, ref, left }) => {
          const drawerLeft = pathname === '/map' ? true : isMobile ? true : left;
          return (
            <SideDrawer
              key={type}
              ref={ref}
              open={isFilterOpen && isCategoryOrFilterOrSortBy === type}
              left={drawerLeft}
            >
              <form>
                <BookFilter />
              </form>
            </SideDrawer>
          );
        })}
      </FormProvider>
      <div
        className={`${
          isHeaderShow ? 'block ' : 'hidden'
        } fixed w-full  flex flex-col gap-[12px] z-30  `}
      >
        <TopBar></TopBar>
      </div>
    </header>
  );
}
