import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import category_filter from '../../../../assets/category_filter.svg';
import deleteIcon from '../../../../assets/deleteIcon.png';
import { clearAllFilters } from '../../../../redux/feature/filter/filterSlice';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { FilterItemEnum } from '../../../../utility/enum';
import Button from '../../../shared/Button';
import Image from '../../../shared/Image';

export default function BookFilterReset() {
  const { t } = useTranslation();
  const { reset } = useFormContext();
  const dispatch = useAppDispatch();
  const { isCategoryOrFilterOrSortBy } = useAppSelector((state) => state.filter);

  const handleClearAll = () => {
    reset();
    dispatch(clearAllFilters());
  };

  return (
    <div className="flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        {isCategoryOrFilterOrSortBy === FilterItemEnum.CATEGORY && (
          <Image src={category_filter} alt="" className="h-fit" />
        )}
        <h3 className="text-grayDark font-poppins font-medium text-sm">
          {isCategoryOrFilterOrSortBy === FilterItemEnum.CATEGORY
            ? t('filter.categoryFilter')
            : t('filter.bookFilter')}
        </h3>
      </div>
      <Button
        type="reset"
        onClick={handleClearAll}
        className="flex items-center gap-1 h-[26px] bg-[#DBEDFF] border border-primary text-xs font-poppins font-normal text-primary px-2 py-1 rounded-lg"
      >
        <div className="w-3 h-3 flex items-center justify-center">
          <Image src={deleteIcon} alt="" className="h-fit" />
        </div>
        {t('filter.clearAll')}
      </Button>
    </div>
  );
}
