import { useAppSelector } from '../../../redux/hooks';
import { FilterItemEnum } from '../../../utility/enum';
import Line from '../../shared/Line';
import BookFilterReset from './BookFilterReset';
import FilterByCondition from './FilterByCondition';
import FilterByGenre from './FilterByGenre';
import FilterByLanguage from './FilterByLanguage';

export default function BookFilter() {
  const { isCategoryOrFilter } = useAppSelector((state) => state.filter);
  return (
    <div className="overflow-y-scroll h-full custom-scrollbar px-4">
      <BookFilterReset />
      <Line className="my-4" />
      <FilterByGenre />
      {isCategoryOrFilter === FilterItemEnum.FILTER && (
        <div>
          <Line className="my-4" />
          <FilterByLanguage />
          <Line className="my-4" />
          <FilterByCondition />
        </div>
      )}
    </div>
  );
}
