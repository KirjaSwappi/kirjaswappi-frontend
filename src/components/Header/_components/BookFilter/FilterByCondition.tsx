import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import plusIcon from '../../../../assets/plus.png';
import tickmarkIcon from '../../../../assets/tickmark.png';
import { useGetSupportConditionQuery } from '../../../../redux/feature/book/bookApi';
import Button from '../../../shared/Button';
import Image from '../../../shared/Image';
import GenreSkelton from './GenreSkelton';

export default function FilterByCondition() {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const [conditionExpanded, setConditionExpanded] = useState(true);
  const { data: conditionDataOptions, isLoading: conditionLoading } =
    useGetSupportConditionQuery(undefined);
  const toggleConditionExpand = () => {
    setConditionExpanded((prev) => !prev);
  };
  return (
    <div className="px-4">
      {conditionLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }, (_, index) => (
            <GenreSkelton key={index} />
          ))}
        </div>
      ) : (
        <Controller
          name="condition"
          control={control}
          render={({ field }) => (
            <div className="py-2">
              <Button
                type="button"
                onClick={toggleConditionExpand}
                className="flex items-center justify-between w-full pr-2"
              >
                <span className="font-poppins font-normal text-sm">
                  {t('filter.swapCondition')}
                </span>
                <span>{conditionExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
              </Button>

              {conditionExpanded && (
                <div className="mt-2 space-y-2">
                  {conditionDataOptions?.map((conditionItem: string) => {
                    const isChecked = field.value.includes(conditionItem);
                    return (
                      <Button
                        key={conditionItem}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            field.onChange(field.value.filter((v: string) => v !== conditionItem));
                          } else {
                            field.onChange([...field.value, conditionItem]);
                          }
                        }}
                        className={`flex items-center justify-between gap-2 cursor-pointer w-full text-blackOlive font-poppins font-normal h-[28px] ${isChecked ? 'bg-AntiFlashWhite' : ''} px-2.5 rounded-sm`}
                      >
                        <span className="text-sm">{conditionItem}</span>
                        {isChecked ? (
                          <Image
                            src={tickmarkIcon}
                            alt="tickmarkIcon icon"
                            className="h-4 w-full"
                          />
                        ) : (
                          <Image src={plusIcon} alt="plus icon" className="h-4 w-full" />
                        )}
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        />
      )}
    </div>
  );
}
