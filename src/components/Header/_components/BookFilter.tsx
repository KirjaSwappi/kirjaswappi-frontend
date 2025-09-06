/* eslint-disable @typescript-eslint/no-explicit-any */
import deleteIcon from '../../../assets/deleteIcon.png';
import { useGetGenreQuery } from '../../../redux/feature/genre/genreApi';
import Button from '../../shared/Button';
import Image from '../../shared/Image';
import InputLabel from '../../shared/InputLabel';
import Line from '../../shared/Line';
import CheckboxControllerField from './CheckboxInputControllerField';
import GenreSkelton from './GenreSkelton';

import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { BiCheck, BiChevronDown } from 'react-icons/bi';
import {
  useGetSupportConditionQuery,
  useGetSupportLanguageQuery,
} from '../../../redux/feature/book/bookApi';
import { genreIcons } from './genreIcons';

export default function BookFilter() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { data: genreData = [] } = useGetGenreQuery(undefined);
  const { data: languageDataOptions, isLoading: languageLoading } =
    useGetSupportLanguageQuery(undefined);
  const { data: conditionDataOptions, isLoading: conditionLoading } =
    useGetSupportConditionQuery(undefined);
  const { reset, control } = useFormContext();

  const genres = genreData.map((g: { name: string }) => ({
    ...g,
    icon: genreIcons[g.name],
  }));
  // console.log(genreLoading);
  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };
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
        name={'genre'}
        control={control}
        render={({ field }) => (
          <div>
            {genres.map((genre: any) => (
              <div key={genre.id}>
                <div
                  role="button"
                  tabIndex={0}
                  className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-gray-50"
                  onClick={() => field.onChange(genre.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') field.onChange(genre.id);
                  }}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(genre.id);
                    }}
                    className="flex items-center gap-2 justify-between w-full h-[28px]  "
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === 'Enter' || e.key === ' ') toggleExpand(genre.id);
                    }}
                  >
                    <div className="flex items-center gap-2 ">
                      <Image src={genre.icon} alt={genre.name} />
                      <span>{genre.name}</span>
                    </div>
                    <BiChevronDown size={16} />
                  </div>
                </div>

                {expanded[genre.id] &&
                  genres
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .filter((sub: any) => sub.parentGenre?.id === genre.id)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .map((sub: any) => (
                      <div
                        role="button"
                        tabIndex={0}
                        key={sub.id}
                        className="pl-10 flex items-center justify-between cursor-pointer py-1 hover:bg-gray-50"
                        onClick={() => field.onChange(sub.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') field.onChange(sub.id);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Image src={sub.icon} alt={sub.name} />
                          <span>{sub.name}</span>
                        </div>
                        {field.value === sub.id && <BiCheck className="text-green-500" />}
                      </div>
                    ))}
              </div>
            ))}
          </div>
        )}
      />

      {/* <div className="pl-3">
        {genreLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }, (_, index) => (
              <GenreSkelton key={index} />
            ))}
          </div>
        ) : (
          genreData?.map((genre: { id: string; name: string }, index: number) => (
            <CheckboxControllerField key={index} name="genre" value={genre.name} />
          ))
        )}
      </div> */}
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
