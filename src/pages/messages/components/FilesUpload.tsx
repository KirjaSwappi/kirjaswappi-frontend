/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import {
  Controller,
  FieldError,
  FieldErrors,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  useFormContext,
} from 'react-hook-form';
import { IoCloseOutline } from 'react-icons/io5';
import Image from '../../../components/shared/Image';
import Input from '../../../components/shared/Input';
import { SUPPORTED_FORMATS } from '../../../utility/constant';
import UploadPicture from '../../addUpdateBook/_components/UploadPicture';

interface IFilesProps {
  name: string;
  errors: FieldErrors<FieldValues>;
  triggerRef?: React.RefObject<HTMLButtonElement | null> | null;
}

const FilesUpload = ({ name, errors, triggerRef }: IFilesProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { control, setValue, trigger, watch } = useFormContext();
  const [previews, setPreviews] = useState<string[]>([]);
  const imageFiles = watch('files');

  useEffect(() => {
    const triggerButton = triggerRef?.current;
    const openFileDialog = () => {
      fileInputRef.current?.click();
    };
    triggerButton?.addEventListener('click', openFileDialog);
    return () => {
      triggerButton?.removeEventListener('click', openFileDialog);
    };
  }, [triggerRef]);

  // Reset Previous state
  useEffect(() => {
    if (imageFiles.length === 0) setPreviews([]);
  }, [imageFiles]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: { value: File[]; onChange: (files: File[]) => void },
  ) => {
    const files = Array.from(e.target.files || []);
    const validImages = files.filter((file) => SUPPORTED_FORMATS.includes(file.type));
    const fileUrls = validImages.map((file) => URL.createObjectURL(file));
    const updatedPreviews = [...previews, ...fileUrls];
    setPreviews(updatedPreviews);
    const updatedFiles = [...(field.value || []), ...validImages];
    field.onChange(updatedFiles);
    e.target.value = '';
  };

  const handleDelete = async (
    index: number,
    field: { value: File[]; onChange: (files: File[]) => void },
  ) => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    const updatedFiles = (field.value || []).filter((_: File, i: number) => i !== index);
    setPreviews(updatedPreviews);
    setValue(name, updatedFiles, { shouldValidate: true });
    await trigger(name);
  };

  const findErrorPosition = (errorsObject: Record<string, FieldError | undefined>): number[] => {
    if (!errorsObject || typeof errorsObject !== 'object') return [];
    return Object.keys(errorsObject)
      .map((key) => (errorsObject[key]?.message ? parseInt(key, 10) : null))
      .filter((index): index is number => index !== null);
  };

  const getAllErrorMessages = (errorObject: Record<number, FieldError> | undefined): string[] => {
    if (!errorObject || typeof errorObject !== 'object') return [];
    return Object.values(errorObject)
      .map((error) => error?.message)
      .filter((msg): msg is string => Boolean(msg));
  };

  const parseFieldErrors = (
    fieldError:
      | FieldError
      | FieldErrorsImpl<any>
      | Merge<FieldError, FieldErrorsImpl<any>>
      | undefined,
  ): { messages: string[]; indexes: number[] } => {
    if (!fieldError) return { messages: [], indexes: [] };
    if (typeof fieldError === 'object' && !('message' in fieldError) && !('type' in fieldError)) {
      // It's a FieldErrorsImpl or Merge
      return {
        messages: getAllErrorMessages(fieldError as Record<string, FieldError>),
        indexes: findErrorPosition(fieldError as Record<string, FieldError>),
      };
    }
    return {
      messages:
        typeof (fieldError as FieldError)?.message === 'string'
          ? [(fieldError as FieldError).message!]
          : [],
      indexes: [],
    };
  };

  const fieldError = errors?.[name];
  const { messages: errorMessages, indexes: errorIndex } = parseFieldErrors(fieldError);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field }) => {
        return (
          <div>
            <Input
              multiple
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e, field)}
            />
            <div className="flex flex-wrap items-center gap-3">
              {previews &&
                previews?.map((src, index: number) => {
                  return (
                    <div
                      key={index}
                      className={`w-[63px] h-[63px]  ${
                        errorIndex.includes(index) ? 'border-2 border-rose-600' : ''
                      } rounded-lg relative group`}
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => handleDelete(index, field)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') handleDelete(index, field);
                        }}
                        className="absolute w-5 lg:w-6 h-5 lg:h-6 flex items-center justify-center bg-smokyBlack lg:bg-smokyBlack  text-white rounded-full  cursor-pointer z-10 shadow-md -right-2 -top-2"
                      >
                        <IoCloseOutline />
                      </div>
                      <Image
                        src={src}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  );
                })}
              {imageFiles.length > 0 && (
                <UploadPicture
                  className={` cursor-pointer bg-platinumMix border-none w-[63px] h-[63px] z-30`}
                  onChange={(e) => handleFileChange(e, field)}
                  isShow={false}
                />
              )}
            </div>
            {errorMessages.length > 0 && (
              <p className="text-rose-500 text-xs mt-1 pl-2">{errorMessages[0]}</p>
            )}
          </div>
        );
      }}
    />
  );
};

export default FilesUpload;
