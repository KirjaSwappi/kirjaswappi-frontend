import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import plusIcon from '../../../../assets/plus.png';
import tickmarkIcon from '../../../../assets/tickmark.png';
import { useGetSupportLanguageQuery } from '../../../../redux/feature/book/bookApi';
import Button from '../../../shared/Button';
import Image from '../../../shared/Image';
import GenreSkelton from './GenreSkelton';

export default function FilterByLanguage() {
  const { control } = useFormContext();
  const [languageExpanded, setLanguageExpanded] = useState(true);
  const { data: languageDataOptions, isLoading: languageLoading } =
    useGetSupportLanguageQuery(undefined);
  const toggleLanguageExpand = () => {
    setLanguageExpanded((prev) => !prev);
  };
  return (
    <div className="px-4">
      {languageLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }, (_, index) => (
            <GenreSkelton key={index} />
          ))}
        </div>
      ) : (
        <Controller
          name="language"
          control={control}
          render={({ field }) => (
            <div className="py-2">
              <Button
                type="button"
                onClick={toggleLanguageExpand}
                className="flex items-center justify-between w-full pr-2"
              >
                <span className="font-poppins font-normal text-sm">Language</span>
                <span>{languageExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
              </Button>

              {languageExpanded && (
                <div className="mt-2 space-y-2">
                  {languageDataOptions.map((lang: string) => {
                    const isChecked = field.value.includes(lang);
                    return (
                      <Button
                        key={lang}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            field.onChange(field.value.filter((v: string) => v !== lang));
                          } else {
                            field.onChange([...field.value, lang]);
                          }
                        }}
                        className={`flex items-center justify-between gap-2 cursor-pointer w-full text-blackOlive font-poppins font-normal h-[28px] ${isChecked ? 'bg-AntiFlashWhite' : ''} px-2.5 rounded-sm`}
                      >
                        <span className="text-sm">{lang}</span>
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
