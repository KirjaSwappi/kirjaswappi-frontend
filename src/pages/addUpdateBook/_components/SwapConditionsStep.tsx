import { useCallback, useEffect, useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { FaDeleteLeft } from 'react-icons/fa6';
import { SwapType } from '../../../../types/enum';
import closeIcon from '../../../assets/close.svg';
import Button from '../../../components/shared/Button';
import ControlledInputField from '../../../components/shared/ControllerField';
import Image from '../../../components/shared/Image';
import InputLabel from '../../../components/shared/InputLabel';
import { useMouseClick } from '../../../hooks/useMouse';
import { setOpen } from '../../../redux/feature/open/openSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getFileToUrl } from '../../../utility/helper';
import { SWAP_TYPES } from '../helper';
import { ISwappableBook } from '../types/interface';
import AddAnotherBookButton from './AddAnotherBookButton';
import ConditionMessageBox from './ConditionMessageBox';
import ImageFileInput from './ImageControllerField';
import SwappableBookCard from './SwappableBookCard';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SwapConditionsStep({ errors }: { errors: any }) {
  const dispatch = useAppDispatch();
  const [swappableBookIndex, setSwappableBookIndex] = useState<number | null>(null);
  const { open } = useAppSelector((state) => state.open);
  const { control, getValues, watch, setValue, trigger } = useFormContext();
  const { reference, setClicked, clicked } = useMouseClick();
  const swapType = watch('swapType');
  const swappableGenres = getValues('swappableGenres');
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'swappableBooks',
  });

  //  INITIALIZE WITH ONE BOOK IF EMPTY
  useEffect(() => {
    if (fields.length === 0) append({ title: '', author: '', coverPhoto: null, flag: false });
  }, [fields, append]);

  const handleRemoveGenre = (genreValue: string) => {
    if (!genreValue) return;
    setValue(
      'swappableGenres',
      swappableGenres?.filter((swappableGenre: string) => swappableGenre !== genreValue),
    );
  };

  const addAnotherBook = async () => {
    const valid = await trigger();
    const values = getValues('swappableBooks');
    // RESET LOCAL STATE
    setClicked(false);
    setSwappableBookIndex(null);

    // Update the flags based on field validation
    values.forEach((_book: ISwappableBook, idx: number) => {
      const isValidBook = ['title', 'author', 'coverPhoto'].every(
        (field) => !!watch(`swappableBooks.${idx}.${field}`),
      );
      setValue(`swappableBooks.${idx}.flag`, isValidBook);
    });

    if (valid) {
      append({ title: '', author: '', coverPhoto: null, flag: false });
    }
  };

  // EDIT SWAPPABLE BOOK
  const editAnotherBook = useCallback(
    (index: number) => {
      setValue(`swappableBooks.${index}.flag`, false);
    },
    [setValue],
  );

  // DELETE SWAPPABLE BOOK
  const deleteSwappableBookByIndex = useCallback(
    (index: number) => {
      const values = getValues('swappableBooks');
      const filteredSwapBooks = values.filter(
        (_book: ISwappableBook, idx: number) => index !== idx,
      );
      setValue('swappableBooks', filteredSwapBooks);
      setSwappableBookIndex(null);
    },
    [getValues, setValue],
  );

  return (
    <div>
      <div className="block lg:hidden">
        <div className="mb-4">
          <InputLabel label="Condition Type" required />
        </div>
        <div className="flex flex-col gap-4">
          {SWAP_TYPES.map(({ value, label }) => (
            <Controller
              key={value}
              name="swapType"
              control={control}
              render={({ field }) => (
                <div className="px-4 py-4 bg-white lg:bg-AntiFlashWhite border lg:border-grayDark border-gray rounded-lg">
                  <label className="flex items-center gap-2 w-full cursor-pointer">
                    <input
                      type="radio"
                      value={value}
                      checked={field.value === value}
                      onChange={field.onChange}
                      className="w-4 h-4"
                    />
                    {label}
                  </label>
                </div>
              )}
            />
          ))}
        </div>
      </div>

      {/* Headers for lg devices */}
      <div className="hidden lg:flex lg:gap-8 pt-4">
        <div className="w-[320px] flex-shrink-0">
          <div className="text-left mb-2">
            <InputLabel label="Swap Type" required />
          </div>
        </div>
        <div className="flex-1">
          {swapType === SwapType.BYBOOKS && (
            <div className="text-left mb-2">
              <InputLabel
                label={
                  fields.some((_, index) => watch(`swappableBooks.${index}.flag`))
                    ? 'Book Cover'
                    : 'Cover Photo'
                }
                required
              />
            </div>
          )}
          {swapType === SwapType.BYGENRES && (
            <div className="flex items-center justify-between mb-2">
              <InputLabel label="Genre To Swap With" required />
              <Button
                type="button"
                onClick={() => dispatch(setOpen(!open))}
                className="text-[#3879E9] font-poppins font-medium text-sm leading-none underline"
              >
                Add
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main content layout */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mt-2">
        {/* Left Column - Swap Type Options for lg devices */}
        <div className="hidden lg:block w-[320px] flex-shrink-0">
          <div className="flex flex-col gap-4">
            {SWAP_TYPES.map(({ value, label }) => (
              <Controller
                key={value}
                name="swapType"
                control={control}
                render={({ field }) => (
                  <div className="px-4 py-4 bg-gray-100 border border-[#E6E6E6] rounded-lg">
                    <label className="flex items-center gap-2 w-full cursor-pointer">
                      <input
                        type="radio"
                        value={value}
                        checked={field.value === value}
                        onChange={field.onChange}
                        className="w-4 h-4"
                      />
                      {label}
                    </label>
                  </div>
                )}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Dynamic Content */}
        <div className="flex-1">
          <hr className="w-full border-t border-platinumDark block lg:hidden my-4" />

          {swapType === SwapType.BYBOOKS && (
            <div>
              {/* Grid for completed books on lg, single column on sm */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {fields.map((swappableBook, index) => {
                  const flag = watch(`swappableBooks.${index}.flag`);
                  const { coverPhoto, title, author } = watch(`swappableBooks.${index}`);
                  return flag ? (
                    <SwappableBookCard
                      key={swappableBook.id}
                      id={swappableBook.id}
                      index={index}
                      title={title}
                      author={author}
                      coverPhotoUrl={getFileToUrl(coverPhoto)}
                      swappableBookIndex={swappableBookIndex}
                      clicked={clicked}
                      reference={reference}
                      setSwappableBookIndex={setSwappableBookIndex}
                      setClicked={setClicked}
                      editAnotherBook={editAnotherBook}
                      deleteSwappableBookByIndex={deleteSwappableBookByIndex}
                    />
                  ) : null;
                })}
              </div>

              {/* Form fields for incomplete books */}
              {fields.map((swappableBook, index) => {
                const flag = watch(`swappableBooks.${index}.flag`);
                return !flag ? (
                  <div key={swappableBook.id}>
                    <div className="pt-4 lg:pt-0">
                      <div className="flex items-center justify-between mb-2 lg:mb-0">
                        {index > 0 && (
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-500 w-7 h-7 flex items-center justify-center rounded-sm ml-auto"
                          >
                            <FaDeleteLeft />
                          </Button>
                        )}
                      </div>
                      {/* Image upload - hidden on sm for first section, shown on lg */}
                      <div className="lg:mb-4 ">
                        <ImageFileInput name={`swappableBooks.${index}.coverPhoto`} />
                      </div>
                    </div>
                    <div className="mt-4 pb-4 border-b border-[#E4E4E4] lg:border-b-0 lg:pb-0">
                      <InputLabel label="Book Title" required />
                      <ControlledInputField
                        name={`swappableBooks.${index}.title`}
                        placeholder="Enter book title"
                        className="rounded-md"
                        showErrorMessage
                      />
                    </div>
                    <div className="mt-4 pb-4 border-b border-[#E4E4E4] lg:border-b-0 lg:pb-0">
                      <InputLabel label="Author Name" required />
                      <ControlledInputField
                        name={`swappableBooks.${index}.author`}
                        placeholder="Enter author name"
                        className="rounded-md"
                        showErrorMessage
                      />
                    </div>
                  </div>
                ) : null;
              })}

              <div className="mt-4 pb-4 border-t border-[#E4E4E4] lg:border-t-0 lg:pt-0">
                <AddAnotherBookButton addAnotherBook={addAnotherBook} />
              </div>
            </div>
          )}

          {swapType === SwapType.BYGENRES && (
            <div>
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <Button
                  type="button"
                  onClick={() => dispatch(setOpen(!open))}
                  className="text-[#3879E9] font-poppins font-medium text-sm leading-none underline ml-auto"
                >
                  Add
                </Button>
              </div>
              {swappableGenres && swappableGenres.length > 0 ? (
                <div className="flex flex-col gap-2 pb-4">
                  {swappableGenres.map((item: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-4 py-4 bg-white border border-[#E6E6E6] rounded-lg"
                    >
                      <h3 className="font-poppins text-sm font-light">{item}</h3>
                      <Button type="button" onClick={() => handleRemoveGenre(item)}>
                        <Image src={closeIcon} alt="close" className="h-2" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <ConditionMessageBox swapType={swapType} />
              )}
              {errors && errors['swappableGenres'] && (
                <div className="text-rose-500 text-xs mt-1 pl-2">
                  {errors['swappableGenres']?.message}
                </div>
              )}
            </div>
          )}

          {[SwapType.OPENTOOFFERS, SwapType.GIVEAWAY].includes(swapType) && (
            <ConditionMessageBox swapType={swapType} />
          )}
        </div>
      </div>
    </div>
  );
}
