import { useEffect, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import Button from '../../../components/shared/Button';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '../../../components/shared/Carousel';
import { clearAllFilters, setGenreFilter } from '../../../redux/feature/filter/filterSlice';
import { useGetGenreQuery } from '../../../redux/feature/genre/genreApi';
import { IGenre } from '../types/interface';

export default function CategorySlider() {
  const [api, setApi] = useState<CarouselApi>();
  const dispatch = useDispatch();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const { data: genreData = [], isLoading: isGenreLoading } = useGetGenreQuery(undefined);
  const parentGenres = genreData?.parentGenres ?? {};

  const genres = Object.values(parentGenres as IGenre[] | []).map((value: IGenre) => ({
    id: value.id,
    name: value.name,
  }));

  const handleSelectGenre = (genreId: string) => {
    if (genreId === selectedGenre) {
      setSelectedGenre(null);
      return;
    }

    setSelectedGenre(genreId);
  };

  useEffect(() => {
    if (selectedGenre) {
      dispatch(setGenreFilter([selectedGenre]));
    } else {
      dispatch(setGenreFilter([]));
    }
  }, [selectedGenre, dispatch]);

  useEffect(() => {
    dispatch(clearAllFilters());
  }, []);

  return (
    <div className="flex justify-between items-center gap-x-2 w-full">
      <Button
        onClick={() => api?.scrollPrev()}
        className="flex items-center justify-center rounded-full bg-white w-7 h-7 shadow-sm"
      >
        <IoIosArrowBack className="text-blackOlive text-base" />
      </Button>
      <Carousel
        opts={{
          align: 'center',
        }}
        setApi={setApi}
        className="flex-1"
      >
        <CarouselContent className="flex items-center">
          {isGenreLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <CarouselItem key={index} className="basis-1/4">
                  <div className="h-[37px] w-full bg-platinum animate-pulse rounded-full" />
                </CarouselItem>
              ))
            : genres?.map((genre) => (
                <CarouselItem key={genre.id} className="basis-1/4">
                  <Button
                    className={`w-full h-[37px] rounded-full text-sm shadow-sm ${
                      genre.name === selectedGenre
                        ? 'bg-primary text-white'
                        : 'bg-white text-grayDark'
                    }`}
                    onClick={() => handleSelectGenre(genre.name)}
                  >
                    {genre.name}
                  </Button>
                </CarouselItem>
              ))}
        </CarouselContent>
      </Carousel>

      {/* Next */}
      <Button
        onClick={() => api?.scrollNext()}
        className="flex items-center justify-center rounded-full bg-white w-7 h-7 shadow-sm"
      >
        <IoIosArrowForward className="text-blackOlive text-base" />
      </Button>
    </div>
  );
}
