import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { SortByEnum } from '../../../../utility/enum';
import Button from '../../../shared/Button';

const sortLabelKeys: Record<SortByEnum, string> = {
  [SortByEnum.title]: 'filter.sortTitleAZ',
  [SortByEnum.author]: 'filter.sortAuthorAZ',
  [SortByEnum.language]: 'filter.sortLanguageAZ',
  [SortByEnum.condition]: 'filter.sortConditionAZ',
};

export default function FilterBySort() {
  const { t } = useTranslation();
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
