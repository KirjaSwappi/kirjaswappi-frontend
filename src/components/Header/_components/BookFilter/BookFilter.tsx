import { useAppSelector } from '../../../../redux/hooks';
import { FilterItemEnum } from '../../../../utility/enum';
import Line from '../../../shared/Line';
import BookFilterReset from './BookFilterReset';
import FilterByCondition from './FilterByCondition';
import FilterByGenre from './FilterByGenre';
import FilterByLanguage from './FilterByLanguage';
import FilterBySort from './FilterBySort';

export default function BookFilter() {
  const { isCategoryOrFilterOrSortBy } = useAppSelector((state) => state.filter);

  if (isCategoryOrFilterOrSortBy === FilterItemEnum.SORTBY) {
    return (
      <div className="h-screen custom-scrollbar">
        <FilterBySort />
      </div>
    );
  }

  return (
    <div className="overflow-y-scroll h-screen custom-scrollbar  ">
      <div>
        <BookFilterReset />
        <Line className="my-4" />
        <FilterByGenre />
      </div>
      {isCategoryOrFilterOrSortBy === FilterItemEnum.FILTER && (
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
