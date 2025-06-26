import { FieldError } from 'react-hook-form';
import ControlledInputField from '../../../components/shared/ControllerField';
import InputLabel from '../../../components/shared/InputLabel';
import { IBookDetailsProps } from '../types/interface';
import MultipleImageFileInput from './MultipleImageControllerField';

export default function BookDetailsStep({
  errors,
  languageOptions,
  conditionOptions,
}: IBookDetailsProps) {
  return (
    <div className="lg:grid lg:grid-cols-2 gap-9 xl:gap-10 2xl:gap-20 md:gap-4">
      <div>
        <div className="w-full">
          <div className="py-4 lg:py-0 border-b lg:border-b-0 border-platinumDark">
            <InputLabel className="mb-2" label="Cover Photo" required />
            <MultipleImageFileInput
              errors={errors as Record<string, FieldError>}
              name="coverPhotos"
            />
          </div>
        </div>
        <div className="mt-4 pb-4">
          <InputLabel label="Book Title" required className="mb-2" />
          <ControlledInputField
            name="title"
            placeholder="Enter book title"
            className="rounded-md"
            showErrorMessage
          />
        </div>
        <div className="pb-4">
          <InputLabel label="Author Name" required className="mb-2" />
          <ControlledInputField
            name="author"
            placeholder="Enter book author"
            className="rounded-md"
            showErrorMessage
          />
        </div>
      </div>
      <div>
        <div className="pb-4">
          <InputLabel label="Book Language" required className="mb-2" />
          <ControlledInputField
            type="select"
            name="language"
            className="rounded-md "
            options={languageOptions}
            showErrorMessage
          />
        </div>
        <div className="lg:mt-0 pb-4">
          <InputLabel label="Book Condition" required className="mb-2" />
          <ControlledInputField
            type="select"
            name="condition"
            className="rounded-md bg-white"
            options={conditionOptions}
            showErrorMessage
          />
        </div>
        <div className="pb-4">
          <InputLabel label="Short Description" className="mb-2" />
          <ControlledInputField
            type="textarea"
            name="description"
            placeholder="Enter a short description of the book"
            className="rounded-md h-[83px]"
            showErrorMessage
          />
        </div>
      </div>
    </div>
  );
}
