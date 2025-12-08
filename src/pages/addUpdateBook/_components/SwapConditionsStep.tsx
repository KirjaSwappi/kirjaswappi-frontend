import { useCallback, useEffect, useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { FaDeleteLeft } from 'react-icons/fa6';
import { SwapType } from '../../../../types/enum';
import closeIcon from '../../../assets/close.svg';
import Button from '../../../components/shared/Button';
import ControlledInputField from '../../../components/shared/ControllerField';
import Image from '../../../components/shared/Image';
import Input from '../../../components/shared/Input';
import InputLabel from '../../../components/shared/InputLabel';
import Separator from '../../../components/shared/Separator';
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
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col gap-2">
          <Separator className="lg:hidden" />
          <InputLabel className="mb-0 lg:text-smokyBlack" label="Swap Type" required />
          {SWAP_TYPES.map(({ value, label }) => (
            <Controller
              key={value}
              name="swapType"
              control={control}
              render={({ field }) => (
                <div className="px-4 py-4 bg-white lg:bg-AntiFlashWhite border border-platinum lg:border-platinumMix rounded-lg">
                  <label className="flex items-center gap-2 w-full cursor-pointer">
                    <Input
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
        <Separator className="lg:hidden" />
        <div className=" ">
          {swapType === SwapType.BYBOOKS && (
            <div className="  ">
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
                ) : (
                  <div
                    className={index == 1 ? 'mt-3' : ''}
                    id={`swappableBook-${swappableBook.id}`}
                    key={swappableBook.id}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <InputLabel
                          label="Cover Photo"
                          required
                          className="lg:mb-3 lg:text-smokyBlack"
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-500 w-7 h-7 flex items-center justify-center rounded-sm"
                          >
                            <FaDeleteLeft />
                          </Button>
                        )}
                      </div>
                      <ImageFileInput name={`swappableBooks.${index}.coverPhoto`} />
                    </div>
                    <div className="mt-4 lg:mt-3 pb-4 lg:pb-0 border-b lg:border-none border-[#E4E4E4]">
                      <InputLabel
                        className="lg:text-smokyBlack lg:mb-1 lg:mt-2"
                        label="Book Title"
                        required
                      />
                      <ControlledInputField
                        name={`swappableBooks.${index}.title`}
                        placeholder="Enter book title"
                        className="rounded-md lg:border-gray"
                        showErrorMessage
                      />
                    </div>
                    <div className="mt-4 lg:mt-3 pb-4 lg:pb-0 border-b lg:border-none border-[#E4E4E4]">
                      <InputLabel
                        className="lg:text-smokyBlack lg:mb-2 lg:mt-2"
                        label="Author Name"
                        required
                      />
                      <ControlledInputField
                        name={`swappableBooks.${index}.author`}
                        placeholder="Enter author name"
                        className="rounded-md lg:border-gray"
                        showErrorMessage
                      />
                    </div>
                  </div>
                );
              })}
              <AddAnotherBookButton addAnotherBook={addAnotherBook} />
            </div>
          )}
          {swapType === SwapType.BYGENRES && (
            <div>
              <div className="flex items-center justify-between py-4 lg:py-0 lg:pb-2">
                <InputLabel className="lg:mb-0 leading-none" label="Genre To Swap With" required />
                <Button
                  type="button"
                  onClick={() => dispatch(setOpen(!open))}
                  className="text-[#3879E9] font-poppins font-medium text-sm leading-none underline"
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
