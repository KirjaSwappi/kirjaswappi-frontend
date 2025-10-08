import { useFormContext } from 'react-hook-form';
import category_filter from '../../../assets/category_filter.svg';
import deleteIcon from '../../../assets/deleteIcon.png';
import { useAppSelector } from '../../../redux/hooks';
import { FilterItemEnum } from '../../../utility/enum';
import Button from '../../shared/Button';
import Image from '../../shared/Image';

export default function BookFilterReset() {
  const { reset } = useFormContext();
  const { isCategoryOrFilter } = useAppSelector((state) => state.filter);
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {isCategoryOrFilter === FilterItemEnum.CATEGORY && (
          <Image src={category_filter} alt="Category Filter" className="h-fit" />
        )}
        <h3 className="text-grayDark font-poppins font-medium text-sm">
          {isCategoryOrFilter === FilterItemEnum.CATEGORY ? 'Category Filter' : 'Book Filter'}
        </h3>
      </div>
      <Button
        type="reset"
        onClick={() => reset()}
        className="flex items-center gap-1 h-[26px] bg-[#DBEDFF] border border-primary text-xs font-poppins font-normal text-primary px-2 py-1 rounded-lg"
      >
        <div className="w-3 h-3 flex items-center justify-center">
          <Image src={deleteIcon} alt="Delete Icon" className="h-fit" />
        </div>
        Clear all
      </Button>
    </div>
  );
}
