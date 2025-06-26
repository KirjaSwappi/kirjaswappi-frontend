import React, { SetStateAction } from 'react';
import plusIcon from '../../assets/plusIcon.png';
import tickMarkIcon from '../../assets/tickmark.png';
import SideDrawer from '../../pages/profile/components/SideDrawer';
import { IGenreItemType } from '../../pages/profile/interface/interface';
import { useGetGenreQuery } from '../../redux/feature/genre/genreApi';
import Button from './Button';
import Image from './Image';
import Loader from './Loader';

export default function AddGenre({
  setEditValuesChanged,
  genresValue,
  setValue,
  trigger,
  addGenreName = 'genres',
}: {
  setEditValuesChanged: React.Dispatch<SetStateAction<boolean>>;
  genresValue: string[];
  setValue?: (field: string, value: string[]) => void;
  trigger?: (field: string) => void;
  addGenreName?: string;
}) {
  const { data, isLoading } = useGetGenreQuery(undefined);
  const handleAddGenre = (genreValue: string) => {
    if (!genresValue?.includes(genreValue)) {
      const updatedGenres = [...genresValue, genreValue];
      setValue?.(`${addGenreName}`, updatedGenres);
      setEditValuesChanged(true);
      trigger?.(`${addGenreName}`);
    }
  };
  if (isLoading) return <Loader />;
  return (
    <SideDrawer title="Genre">
      <div className="flex flex-col gap-2 pb-4 mt-8">
        {data?.map((genreItem: IGenreItemType, index: string | number) => {
          const isGenActive = genresValue?.includes(genreItem.name);
          return (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-4 bg-white border border-[#E6E6E6] rounded-lg"
            >
              <h3 className="font-poppins text-sm font-light">{genreItem.name}</h3>
              {isGenActive ? (
                <Button>
                  <Image src={tickMarkIcon} alt="Selected" className="h-4" />
                </Button>
              ) : (
                <Button onClick={() => handleAddGenre(genreItem.name)}>
                  <Image src={plusIcon} alt="Add" className="h-4" />
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </SideDrawer>
  );
}
