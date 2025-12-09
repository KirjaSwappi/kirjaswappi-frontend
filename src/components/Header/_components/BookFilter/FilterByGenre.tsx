/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import plusIcon from '../../../../assets/plus.png';
import tickmarkIcon from '../../../../assets/tickmark.png';
import { useGetGenreQuery } from '../../../../redux/feature/genre/genreApi';
import Button from '../../../shared/Button';
import Image from '../../../shared/Image';
import { IGenreWithIcon } from '../../types/interface';
import { genreIcons } from './genreIcons';
import GenreSkelton from './GenreSkelton';

export default function FilterByGenre() {
  const { control } = useFormContext();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { data: genreData = [], isLoading: isGenreLoading } = useGetGenreQuery(undefined);

  const toggleExpand = (id: string) => {
    setExpanded((prev: any) => ({
      ...prev,
      [id]: !prev[id],
    }));
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
    <div className="px-4  ">
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
            <div>
              <span className="font-poppins font-normal text-sm">Genre</span>
              <div className="pl-2">
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
                          className="w-5 h-5"
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
            </div>
          )}
        />
      )}
    </div>
  );
}
