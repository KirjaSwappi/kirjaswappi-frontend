import React from 'react';
import plusIcon from '../../assets/plusIcon.png';
import tickMarkIcon from '../../assets/tickmark.png';
import SideDrawer from '../../pages/profile/components/SideDrawer';
import { IChildGenre, IGenresResponse } from '../../pages/profile/interface/interface';
import { useGetGenreQuery } from '../../redux/feature/genre/genreApi';
import Button from './Button';
import Image from './Image';
import Spinner from './Spinner';

export default function AddGenre({
  setEditValuesChanged,
  genresValue,
  setValue,
  trigger,
  addGenreName = 'genres',
}: {
  setEditValuesChanged: React.Dispatch<React.SetStateAction<boolean>>;
  genresValue: string[];
  setValue?: (field: string, value: string[]) => void;
  trigger?: (field: string) => void;
  addGenreName?: string;
}) {
  const { data, isLoading } = useGetGenreQuery(undefined) as {
    data: IGenresResponse | undefined;
    isLoading: boolean;
  };

  const handleAddGenre = (genre: string) => {
    if (!genresValue.includes(genre)) {
      const updated = [...genresValue, genre];
      setValue?.(addGenreName, updated);
      setEditValuesChanged(true);
      trigger?.(addGenreName);
    }
  };

  if (isLoading) return <Spinner variant="overlay" />;

  const allGenres: IChildGenre[] = Object.values(data?.parentGenres || {}).flatMap((parent) =>
    parent.childGenres.length > 0 ? parent.childGenres : [{ id: parent.id, name: parent.name }],
  );

  return (
    <SideDrawer title="Genre">
      <div className="flex flex-col gap-2 pb-4 mt-8">
        {allGenres.map((genreItem) => {
          const isSelected = genresValue.includes(genreItem.name);

          return (
            <div
              key={genreItem.id}
              className="flex items-center justify-between px-4 py-4 bg-white border border-platinum rounded-lg"
            >
              <h3 className="font-poppins text-sm font-light">{genreItem.name}</h3>

              {isSelected ? (
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
