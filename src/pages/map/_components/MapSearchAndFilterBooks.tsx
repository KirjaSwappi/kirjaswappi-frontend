import filterIcon from '../../../assets/filter.png';
import Button from '../../../components/shared/Button';
import Image from '../../../components/shared/Image';
import Search from '../../../components/shared/Search';
import {
  setFilterOpen,
  setIsCategoryOrFilterOrSortBy,
} from '../../../redux/feature/filter/filterSlice';
import { useAppDispatch } from '../../../redux/hooks';
import { FilterItemEnum } from '../../../utility/enum';

export default function MapSearchAndFilterBooks() {
  const dispatch = useAppDispatch();
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-10 z-[9999999] w-full px-4">
      <div className="lg:w-[35%] h-[54px] flex mx-auto items-center gap-3">
        <Button
          onClick={() => {
            dispatch(setFilterOpen(true));
            dispatch(setIsCategoryOrFilterOrSortBy(FilterItemEnum.FILTER));
          }}
          className="bg-primary w-[54px] h-12 flex items-center justify-center rounded-full"
        >
          <Image src={filterIcon} alt="filter" className="w-6 h-6" />
        </Button>
        <Search className="h-[54px] rounded-full justify-between" placeholder="Find books " />
      </div>
    </div>
  );
}
