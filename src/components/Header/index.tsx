import { FormProvider, useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useMouseClick } from '../../hooks/useMouse';
import { IFilterData } from '../../interface';
import {
  setConditionFilter,
  setFilterOpen,
  setGenreFilter,
  setLanguageFilter,
} from '../../redux/feature/filter/filterSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import BookFilter from './_components/BookFilter';
import SideDrawer from './_components/SideDrawer';
import TopBar from './_components/TopBar';

interface HeaderProps {
  showOn404?: boolean;
}

export default function Header({ showOn404 = false }: HeaderProps) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isFilterOpen } = useAppSelector((state) => state.filter);
  const { reference } = useMouseClick<HTMLFormElement>(() => {
    if (isFilterOpen) {
      dispatch(setFilterOpen(false));
    }
  });
  const pathname = location.pathname;

  const showTopHeaderPath = [
    '/',
    `/book-details/${pathname?.split('/').reverse()[0]}`,
    '/profile/add-book',
    '/profile/user-profile',
    `/profile/update-book/${pathname?.split('/').reverse()[0]}`,
  ];
  const isHeaderShow = showTopHeaderPath.includes(pathname) || showOn404;
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      genre: [],
      language: [],
      condition: [],
    },
  });
  const { handleSubmit } = methods;
  const handleSubmitFn = async <T extends IFilterData>(data: T) => {
    dispatch(setGenreFilter(data.genre));
    dispatch(setConditionFilter(data.condition));
    dispatch(setLanguageFilter(data.language));
  };

  return (
    <header
      className={`${isHeaderShow ? 'pb-28 lg:pb-20' : 'pb-0'} ${pathname !== '/' ? 'hidden lg:block' : ''}  `}
    >
      <FormProvider {...methods}>
        <SideDrawer left open={isFilterOpen}>
          <form ref={reference} onSubmit={handleSubmit((data) => handleSubmitFn(data))}>
            <BookFilter />
          </form>
        </SideDrawer>
      </FormProvider>
      <div
        className={`${
          isHeaderShow ? 'block ' : 'hidden'
        } fixed w-full  flex flex-col gap-[12px] z-30`}
      >
        <TopBar></TopBar>
      </div>
    </header>
  );
}
