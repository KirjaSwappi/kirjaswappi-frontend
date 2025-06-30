import { useEffect, useState } from 'react';
import { Controller, ControllerRenderProps, useFormContext } from 'react-hook-form';
import closeIcon from '../../../assets/close.png';
import Button from '../../../components/shared/Button';
import Image from '../../../components/shared/Image';
const ImageFileInput = ({ name }: { name: string }) => {
  const { control, getValues, setValue } = useFormContext();
  const initialValue = getValues(name);
  const [preview, setPreview] = useState<string | null>(
    initialValue instanceof File ? URL.createObjectURL(initialValue) : initialValue || null,
  );

  useEffect(() => {
    if (initialValue instanceof File) {
      const fileUrl = URL.createObjectURL(initialValue);
      setPreview(fileUrl);
    } else if (typeof initialValue === 'string') {
      setPreview(initialValue);
    }
  }, [initialValue]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<Record<string, unknown>, string>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image')) {
        const fileUrl = URL.createObjectURL(file);
        setPreview(fileUrl);
      }
      field.onChange(file);
    }
  };

  const handleDelete = (field: ControllerRenderProps<Record<string, unknown>, string>) => {
    setPreview('');
    setValue(field.name, null);
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null}
      render={({ field, fieldState }) => {
        return (
          <div>
            <div className="w-[126px] h-[150px] border-[1px] border-dashed lg:bg-AntiFlashWhite  border-grayDark lg:border-gray rounded-lg cursor-pointer block mx-auto lg:w-full lg:h-[64px]">
              {preview ? (
                <div className="w-full h-full relative group">
                  <Button
                    onClick={() => handleDelete(field)}
                    onKeyDown={(e) => e.key === 'Enter' && handleDelete(field)}
                    className="absolute  w-6 h-6 flex items-center justify-center bg-[#0D0D0D] rounded-full p-1 -right-2 -top-2"
                    aria-label="Delete image"
                    type="button"
                  >
                    <Image src={closeIcon} alt="File Preview" className="w-4 h-4" />
                  </Button>
                  <Image
                    src={preview}
                    alt="File Preview"
                    className="w-full h-full bg-contain object-cover rounded-lg"
                  />
                </div>
              ) : (
                <label
                  htmlFor="file"
                  className="flex flex-col items-center justify-center h-full lg:flex-row lg:gap-2"
                >
                  <span className="text-grayDark lg:text-[#A6A6A6] text-3xl font-poppins font-extralight">
                    +
                  </span>
                  <span className="text-grayDark lg:text-[#A6A6A6] text-xs font-poppins font-normal">
                    Upload Picture
                  </span>

                  <input
                    id="file"
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, field)}
                  />
                </label>
              )}
            </div>
            {/* Validation Error */}
            {fieldState.error && (
              <p className="text-rose-500 text-xs mt-1 pl-2">{fieldState.error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
};

export default ImageFileInput;
