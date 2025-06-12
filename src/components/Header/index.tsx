import { FormProvider, useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useMouseClick } from '../../hooks/useMouse';
import { IFilterData } from '../../interface';
import {
  setConditionFilter,
  setGenreFilter,
  setLanguageFilter,
} from '../../redux/feature/filter/filterSlice';
import { useAppDispatch } from '../../redux/hooks';
import BookFilter from './_components/BookFilter';
import SideLeftDrawer from './_components/LeftSideDrawer';
import TopBar from './_components/TopBar';
export default function Header() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { clicked, reference } = useMouseClick<HTMLFormElement>();

  const showTopHeaderPath = ['/', `/book-details/${location?.pathname?.split('/').reverse()[0]}`];
  const isHeaderShow = showTopHeaderPath.find((path) => path === location.pathname);
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
    <header className={`${isHeaderShow ? 'pb-24 lg:pb-28' : 'pb-0'}`}>
      <FormProvider {...methods}>
        <SideLeftDrawer open={clicked}>
          <form ref={reference} onSubmit={handleSubmit((data) => handleSubmitFn(data))}>
            <BookFilter />
          </form>
        </SideLeftDrawer>
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
