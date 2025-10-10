import { FilterItemEnum } from '../../../utility/enum';

function getDrawers(
  categoryRef: React.RefObject<HTMLDivElement>,
  filterRef: React.RefObject<HTMLDivElement>,
  sortByRef: React.RefObject<HTMLDivElement>,
) {
  return [
    {
      type: FilterItemEnum.CATEGORY,
      ref: categoryRef,
      left: true,
    },
    {
      type: FilterItemEnum.FILTER,
      ref: filterRef,
      left: false,
    },
    {
      type: FilterItemEnum.SORTBY,
      ref: sortByRef,
      left: false,
    },
  ] as const;
}
export default getDrawers;
