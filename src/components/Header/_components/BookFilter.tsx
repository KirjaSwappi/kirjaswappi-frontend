/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import deleteIcon from '../../../assets/deleteIcon.png';
import plusIcon from '../../../assets/plus.png';
import tickmarkIcon from '../../../assets/tickmark.png';

import {
  useGetSupportConditionQuery,
  useGetSupportLanguageQuery,
} from '../../../redux/feature/book/bookApi';
import { useGetGenreQuery } from '../../../redux/feature/genre/genreApi';
import Button from '../../shared/Button';
import Image from '../../shared/Image';
import InputLabel from '../../shared/InputLabel';
import Line from '../../shared/Line';
import CheckboxControllerField from './CheckboxInputControllerField';
import GenreSkelton from './GenreSkelton';
import { genreIcons } from './genreIcons';

type TChildGenre = {
  id: string;
  name: string;
};
interface IGenreWithIcon {
  id: string;
  name: string;
  icon?: string;
  childGenres: TChildGenre[];
}

export default function BookFilter() {
  const { data: genreData = [] } = useGetGenreQuery(undefined);
  const { data: languageDataOptions, isLoading: languageLoading } =
    useGetSupportLanguageQuery(undefined);
  const { data: conditionDataOptions, isLoading: conditionLoading } =
    useGetSupportConditionQuery(undefined);
  const { reset, control, watch } = useFormContext();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev: any) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  console.log(watch('genre'));
  function mergeGenresWithIcons(genres: IGenreWithIcon[]): IGenreWithIcon[] {
    if (!genres) return [];
    return Object.values(genres)?.map((parent) => ({
      ...parent,
      icon: genreIcons[parent.name] ?? undefined,
    }));
  }
  const genres = mergeGenresWithIcons(genreData?.parentGenres);

  return (
    <div className="overflow-y-scroll h-screen custom-scrollbar px-2">
      <div className="flex items-center justify-between">
        <h3 className="text-grayDark font-poppins font-medium text-sm">Book Filter</h3>
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
      <Line className="my-4" />
      <InputLabel label="Genre" className="mb-4" />
      <Controller
        name="genre"
        control={control}
        render={({ field }) => (
          <>
            {genres.map((parent) => (
              <div key={parent.id} className="pb-2">
                <Button
                  type="button"
                  onClick={() => toggleExpand(parent.id)}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-2">
                    <Image src={parent.icon} alt={parent.name} className="w-5 h-5" />
                    <span className="font-medium">{parent.name}</span>
                  </div>
                  <span>{expanded[parent.id] ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
                </Button>

                {expanded[parent.id] && parent?.childGenres?.length > 0 && (
                  <div className="ml-3 mt-2 space-y-2 border-l pl-4">
                    {parent.childGenres.map((child) => {
                      const isChecked = field.value.includes(child.id);
                      return (
                        <button
                          type="button"
                          key={child.id}
                          onClick={() => {
                            if (isChecked) {
                              field.onChange(field.value.filter((v: string) => v !== child.id));
                            } else {
                              field.onChange([...field.value, child.id]);
                            }
                          }}
                          className="flex items-center justify-between gap-2 cursor-pointer w-full"
                        >
                          <span className="text-sm">{child.name}</span>
                          {isChecked ? (
                            <Image
                              src={tickmarkIcon}
                              alt="tickmarkIcon icon"
                              className="h-5 w-full"
                            />
                          ) : (
                            <Image src={plusIcon} alt="plus icon" className="h-5 w-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      />

      <Line className="my-4" />
      <InputLabel label="Language" className="mb-4" />
      <div className="pl-3">
        {languageLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }, (_, index) => (
              <GenreSkelton key={index} />
            ))}
          </div>
        ) : (
          languageDataOptions?.map((language: string, index: number) => (
            <CheckboxControllerField key={index} name="language" value={language} />
          ))
        )}
      </div>
      <Line className="my-4" />
      <InputLabel label="Swap Condition" className="mb-4" />
      <div className="pl-3">
        {conditionLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }, (_, index) => (
              <GenreSkelton key={index} />
            ))}
          </div>
        ) : (
          conditionDataOptions?.map((condition: string, index: number) => (
            <CheckboxControllerField key={index} name="condition" value={condition} />
          ))
        )}
      </div>
      <Line className="my-4" />
      <Button
        type="submit"
        className="bg-primary text-white mb-12 w-full py-3 rounded-lg font-poppins font-medium text-base"
      >
        Apply Filter
      </Button>
    </div>
  );
}
