import { FilterItemEnum } from '../../../utility/enum';

function getDrawers(
  categoryRef: React.RefObject<HTMLDivElement>,
  filterRef: React.RefObject<HTMLDivElement>,
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
  ] as const;
}
export default getDrawers;
