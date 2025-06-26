import { FieldError, FieldErrors, useFormContext } from 'react-hook-form';
import closeIcon from '../../../assets/closeIcon.png';
import Button from '../../../components/shared/Button';
import Image from '../../../components/shared/Image';
import InputLabel from '../../../components/shared/InputLabel';
import { setOpen } from '../../../redux/feature/open/openSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';

export default function OtherDetailsStep({ errors }: { errors: FieldErrors }) {
  const { open } = useAppSelector((state) => state.open);
  const dispatch = useAppDispatch();
  const { getValues, setValue } = useFormContext();
  const genres = getValues('genres');

  const handleRemoveGenre = (genreValue: string) => {
    if (!genreValue) return;
    const genres = getValues('genres');
    setValue(
      'genres',
      genres?.filter((genre: string) => genre !== genreValue),
    );
  };

  return (
    <div className="pt-5 lg:pt-0">
      <div className="lg:grid lg:grid-cols-2 gap-9 xl:gap-10 2xl:gap-20 md:gap-4">
        <div className="w-full">
          <div className="flex items-center justify-between py-4 border-b lg:border-b-0 border-platinumDark">
            <InputLabel label="Genre" required className="mb-0" />
            <Button
              type="button"
              onClick={() => dispatch(setOpen(!open))}
              className="text-[#3879E9] font-poppins font-medium text-sm leading-none underline"
            >
              Add
            </Button>
          </div>
          <div>
            {genres && genres.length > 0 ? (
              <div className="flex flex-col gap-2 pt-4">
                {genres.map((item: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-4 bg-white lg:bg-AntiFlashWhite border border-platinum lg:border-gray rounded-lg"
                  >
                    <h3 className="font-poppins text-sm font-light">{item}</h3>
                    <Button onClick={() => handleRemoveGenre(item)}>
                      <Image src={closeIcon} alt="close" className="h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[50px] lg:h-56 bg-white lg:bg-AntiFlashWhite mt-3 flex items-center justify-center rounded-md">
                <p className="text-xs text-grayDark">Click ‘Add’ to add genre</p>
              </div>
            )}
            {errors && errors['genres'] && (
              <div className="text-rose-500 text-xs mt-1 pl-2">
                {(errors['genres'] as FieldError)?.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
