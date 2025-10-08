import { setFilterOpen, setIsCategoryOrFilter } from '../redux/feature/filter/filterSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { FilterItemEnum } from '../utility/enum';
import { useMouseClick } from './useMouse';

function useDrawerOutsideClick(drawerType: FilterItemEnum) {
  const dispatch = useAppDispatch();
  const { isCategoryOrFilter, isFilterOpen } = useAppSelector((state) => state.filter);
  return useMouseClick<HTMLDivElement>(() => {
    if (isFilterOpen && isCategoryOrFilter === drawerType) {
      dispatch(setFilterOpen(false));
      dispatch(setIsCategoryOrFilter(null));
    }
  });
}
export default useDrawerOutsideClick;
