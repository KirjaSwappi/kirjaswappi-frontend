/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import plusIcon from '../../../../assets/plus.png';
import tickmarkIcon from '../../../../assets/tickmark.png';
import { useGetGenreQuery } from '../../../../redux/feature/genre/genreApi';
import Button from '../../../shared/Button';
import Image from '../../../shared/Image';
import { getGenreIcon } from './genreIcons';
import GenreSkelton from './GenreSkelton';

type TChildGenre = { id: string; name: string };
type TParentGenre = { id: string; name: string; childGenres: TChildGenre[] };

export default function FilterByGenre() {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { data: genreData = [], isLoading: isGenreLoading } = useGetGenreQuery(undefined);

  const toggleExpand = (id: string) => {
    setExpanded((prev: any) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const genres: TParentGenre[] = genreData?.parentGenres
    ? Object.values(genreData.parentGenres)
    : [];

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
              <span className="font-poppins font-normal text-sm">{t('editProfile.genre')}</span>
              <div className="pl-2">
                {genres.map((parent) => {
                  const hasChildren = parent.childGenres?.length > 0;
                  const Icon = getGenreIcon(parent.name);
                  const isParentSelected = field.value.includes(parent.name);

                  if (!hasChildren) {
                    return (
                      <div key={parent.id} className="py-2">
                        <Button
                          type="button"
                          onClick={() => {
                            if (isParentSelected) {
                              field.onChange(field.value.filter((v: string) => v !== parent.name));
                            } else {
                              field.onChange([...field.value, parent.name]);
                            }
                          }}
                          className={`flex items-center justify-between w-full ${isParentSelected ? 'bg-AntiFlashWhite' : ''} px-2.5 rounded-sm`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon
                              className="w-5 h-5"
                              style={{
                                color: isParentSelected ? '#3879E9' : '#808080',
                                transition: 'color 0.2s ease-in-out',
                              }}
                            />
                            <span
                              className={`${isParentSelected ? 'text-primary' : 'text-blackOlive'} font-poppins font-normal text-sm`}
                            >
                              {parent.name}
                            </span>
                          </div>
                          {isParentSelected ? (
                            <Image
                              src={tickmarkIcon}
                              alt="tickmarkIcon icon"
                              className="h-4 w-full"
                            />
                          ) : (
                            <Image src={plusIcon} alt="plus icon" className="h-4 w-full" />
                          )}
                        </Button>
                      </div>
                    );
                  }

                  return (
                    <div key={parent.id} className="py-2">
                      <Button
                        type="button"
                        onClick={() => toggleExpand(parent.id)}
                        className="flex items-center justify-between w-full"
                      >
                        <div className="flex items-center gap-2">
                          <Icon
                            className="w-5 h-5"
                            style={{
                              color: expanded[parent.id] ? '#3879E9' : '#808080',
                              transition: 'color 0.2s ease-in-out',
                            }}
                          />
                          <span
                            className={`${expanded[parent.id] ? 'text-primary' : 'text-blackOlive'} font-poppins font-normal text-sm`}
                          >
                            {parent.name}
                          </span>
                        </div>
                        <span>{expanded[parent.id] ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
                      </Button>

                      {expanded[parent.id] && (
                        <div className="ml-3 mt-2 space-y-2 border-l border-platinumMix pl-4">
                          {parent.childGenres.map((child) => {
                            const isChecked = field.value.includes(child.name);
                            return (
                              <Button
                                type="button"
                                key={child.id}
                                onClick={() => {
                                  if (isChecked) {
                                    field.onChange(
                                      field.value.filter((v: string) => v !== child.name),
                                    );
                                  } else {
                                    field.onChange([...field.value, child.name]);
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
                  );
                })}
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
}
