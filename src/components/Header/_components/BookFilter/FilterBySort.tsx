import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SortByEnum } from '../../../../utility/enum';
import Button from '../../../shared/Button';
import Line from '../../../shared/Line';

const sortLabelKeys: Record<SortByEnum, string> = {
  [SortByEnum.title]: 'filter.sortTitleAZ',
  [SortByEnum.author]: 'filter.sortAuthorAZ',
  [SortByEnum.language]: 'filter.sortLanguageAZ',
  [SortByEnum.condition]: 'filter.sortConditionAZ',
};

export default function FilterBySort() {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <div>
      <Controller
        name="sortBy"
        control={control}
        render={({ field }) => (
          <div className="py-2">
            <div className="mt-2 space-y-0.5">
              <span className="font-poppins font-normal text-sm px-4">{t('filter.sortBy')}</span>
              <Line className="mt-6 mb-10" />
              <div>
                {Object.entries(sortLabelKeys).map(([value, labelKey]) => {
                  const isChecked = field.value?.includes(value);
                  return (
                    <Button
                      key={value}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          field.onChange(field.value.filter((v: string) => v !== value));
                        } else {
                          field.onChange([...(field.value || []), value]);
                        }
                      }}
                      className={`flex items-center justify-between gap-1 cursor-pointer w-full text-blackOlive font-poppins font-normal h-8 text-sm ${
                        isChecked ? 'bg-primary text-white font-medium' : ''
                      } px-4`}
                    >
                      <span className="pl-2">{t(labelKey)}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
