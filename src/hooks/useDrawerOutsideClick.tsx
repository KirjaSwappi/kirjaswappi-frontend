import { setFilterOpen, setIsCategoryOrFilterOrSortBy } from '../redux/feature/filter/filterSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { FilterItemEnum } from '../utility/enum';
import { useMouseClick } from './useMouse';

function useDrawerOutsideClick(drawerType: FilterItemEnum) {
  const dispatch = useAppDispatch();
  const { isCategoryOrFilterOrSortBy, isFilterOpen } = useAppSelector((state) => state.filter);
  return useMouseClick<HTMLDivElement>(() => {
    if (isFilterOpen && isCategoryOrFilterOrSortBy === drawerType) {
      dispatch(setFilterOpen(false));
      dispatch(setIsCategoryOrFilterOrSortBy(null));
    }
  });
}
export default useDrawerOutsideClick;
