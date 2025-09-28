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
  const { data: genreData = [], isLoading: isGenreLoading } = useGetGenreQuery(undefined);
  const { data: languageDataOptions, isLoading: languageLoading } =
    useGetSupportLanguageQuery(undefined);
  const { data: conditionDataOptions, isLoading: conditionLoading } =
    useGetSupportConditionQuery(undefined);
  const { reset, control } = useFormContext();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [languageExpanded, setLanguageExpanded] = useState(true);
  const [conditionExpanded, setConditionExpanded] = useState(true);

  const toggleExpand = (id: string) => {
    setExpanded((prev: any) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleLanguageExpand = () => {
    setLanguageExpanded((prev) => !prev);
  };
  const toggleConditionExpand = () => {
    setConditionExpanded((prev) => !prev);
  };
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
      <InputLabel label="Genre" className="mb-2" />
      {isGenreLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }, (_, index) => (
            <GenreSkelton key={index} />
          ))}
        </div>
      ) : (
        <Controller
          name="genre"
          control={control}
          render={({ field }) => (
            <div className="px-2">
              {genres.map((parent) => (
                <div key={parent.id} className="py-2">
                  <Button
                    type="button"
                    onClick={() => toggleExpand(parent.id)}
                    className="flex items-center justify-between w-full"
                  >
                    <div className={`flex items-center gap-2 `}>
                      <Image
                        src={parent.icon}
                        alt={parent.name}
                        className="w-5 h-5 "
                        style={{
                          filter: expanded[parent.id]
                            ? 'brightness(0) saturate(100%) invert(39%) sepia(99%) saturate(1747%) hue-rotate(194deg) brightness(96%) contrast(101%)'
                            : 'brightness(0) saturate(100%) invert(74%) sepia(6%) saturate(0%) hue-rotate(180deg) brightness(93%) contrast(88%)',
                          transition: 'filter 0.2s ease-in-out',
                        }}
                      />
                      <span
                        className={`${expanded[parent.id] ? 'text-primary' : 'text-blackOlive'}  font-poppins font-normal text-sm `}
                      >
                        {parent.name}
                      </span>
                    </div>
                    <span>{expanded[parent.id] ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
                  </Button>

                  {expanded[parent.id] && parent?.childGenres?.length > 0 && (
                    <div className="ml-3 mt-2 space-y-2 border-l border-platinumMix pl-4">
                      {parent.childGenres.map((child) => {
                        const isChecked = field.value.includes(child.id);
                        return (
                          <Button
                            type="button"
                            key={child.id}
                            onClick={() => {
                              if (isChecked) {
                                field.onChange(field.value.filter((v: string) => v !== child.id));
                              } else {
                                field.onChange([...field.value, child.id]);
                              }
                            }}
                            className={`flex items-center justify-between gap-2 cursor-pointer w-full text-blackOlive font-poppins font-normal h-[28px] ${isChecked ? 'bg-AntiFlashWhite' : ''} px-2.5 rounded-sm`}
                          >
                            <span className="text-sm">{child.name}</span>
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
              ))}
            </div>
          )}
        />
      )}
      <Line className="my-4" />
      <div>
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
      <Line className="my-4" />
      <div>
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
                  <span className="font-poppins font-normal text-sm">Swap Condition</span>
                  <span>{conditionExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
                </Button>

                {conditionExpanded && (
                  <div className="mt-2 space-y-2">
                    {conditionDataOptions.map((conditionItem: string) => {
                      const isChecked = field.value.includes(conditionItem);
                      return (
                        <Button
                          key={conditionItem}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              field.onChange(
                                field.value.filter((v: string) => v !== conditionItem),
                              );
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
