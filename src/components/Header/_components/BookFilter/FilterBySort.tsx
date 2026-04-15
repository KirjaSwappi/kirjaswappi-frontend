import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { LuArrowDownAZ, LuArrowUpAZ } from 'react-icons/lu';
import { setSortOrder } from '../../../../redux/feature/filter/filterSlice';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { SortByEnum } from '../../../../utility/enum';
import Button from '../../../shared/Button';

const sortLabelKeys: Record<SortByEnum, string> = {
  [SortByEnum.title]: 'filter.sortTitle',
  [SortByEnum.author]: 'filter.sortAuthor',
  [SortByEnum.language]: 'filter.sortLanguage',
  [SortByEnum.condition]: 'filter.sortCondition',
  [SortByEnum.createdAt]: 'filter.sortDateAdded',
};

export default function FilterBySort() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const sortOrder = useAppSelector((state) => state.filter.filter.sortOrder);
  const { control } = useFormContext();
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="px-4">
      <Controller
        name="sortBy"
        control={control}
        render={({ field }) => (
          <div className="py-2">
            <Button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="flex items-center justify-between w-full pr-2"
            >
              <span className="font-poppins font-normal text-sm">{t('filter.sortBy')}</span>
              <span>{expanded ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
            </Button>

            {expanded && (
              <div className="mt-2 space-y-2">
                {/* =========== ASC / DESC TOGGLE =========== */}
                <div className="flex items-center gap-1 px-2.5">
                  <Button
                    type="button"
                    onClick={() => dispatch(setSortOrder('asc'))}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-sm font-poppins ${
                      sortOrder === 'asc'
                        ? 'bg-AntiFlashWhite text-primary'
                        : 'text-blackOlive hover:bg-AntiFlashWhite'
                    }`}
                    aria-label={t('filter.sortBy') + ' ascending'}
                    aria-pressed={sortOrder === 'asc'}
                  >
                    <LuArrowUpAZ className="text-base" />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => dispatch(setSortOrder('desc'))}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-sm font-poppins ${
                      sortOrder === 'desc'
                        ? 'bg-AntiFlashWhite text-primary'
                        : 'text-blackOlive hover:bg-AntiFlashWhite'
                    }`}
                    aria-label={t('filter.sortBy') + ' descending'}
                    aria-pressed={sortOrder === 'desc'}
                  >
                    <LuArrowDownAZ className="text-base" />
                  </Button>
                </div>

                {/* =========== SORT FIELD OPTIONS =========== */}
                {Object.entries(sortLabelKeys).map(([value, labelKey]) => {
                  const isChecked = field.value?.includes(value);
                  return (
                    <Button
                      key={value}
                      type="button"
                      onClick={() => {
                        field.onChange(isChecked ? [] : [value]);
                      }}
                      className={`flex items-center justify-between gap-2 cursor-pointer w-full text-blackOlive font-poppins font-normal h-[28px] ${isChecked ? 'bg-AntiFlashWhite' : ''} px-2.5 rounded-sm`}
                    >
                      <span className="text-sm">{t(labelKey)}</span>
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isChecked ? 'border-primary' : 'border-grayDark'}`}
                      >
                        {isChecked && <span className="w-2 h-2 rounded-full bg-primary" />}
                      </span>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
}
