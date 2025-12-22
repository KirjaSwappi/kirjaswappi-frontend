import { Controller, useFormContext } from 'react-hook-form';
import { SortByEnum } from '../../../../utility/enum';
import Button from '../../../shared/Button';
import Line from '../../../shared/Line';

const sortLabels: Record<SortByEnum, string> = {
  [SortByEnum.title]: 'A-Z (Title)',
  [SortByEnum.author]: 'Author (A-Z)',
  [SortByEnum.language]: 'Language (A-Z)',
  [SortByEnum.condition]: 'Condition (A-Z)',
};

export default function FilterBySort() {
  const { control } = useFormContext();

  return (
    <div>
      <Controller
        name="sortBy"
        control={control}
        render={({ field }) => (
          <div className="py-2">
            <div className="mt-2 space-y-0.5">
              <span className="font-poppins font-normal text-sm px-4">Sort By</span>
              <Line className="mt-6 mb-10" />
              <div>
                {Object.entries(sortLabels).map(([value, label]) => {
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
                      <span className="pl-2">{label}</span>
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
