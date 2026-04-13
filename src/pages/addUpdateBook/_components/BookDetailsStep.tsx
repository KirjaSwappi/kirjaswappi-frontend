import { FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ControlledInputField from '../../../components/shared/ControllerField';
import InputLabel from '../../../components/shared/InputLabel';
import { IBookDetailsProps } from '../types/interface';
import MultipleImageFileInput from './MultipleImageControllerField';

export default function BookDetailsStep({
  errors,
  languageOptions,
  conditionOptions,
}: IBookDetailsProps) {
  const { t } = useTranslation();
  return (
    <div className="lg:grid lg:grid-cols-2 gap-9 xl:gap-10 2xl:gap-20 md:gap-4">
      <div>
        <div className="w-full">
          <div className="py-4 lg:py-0 border-b lg:border-b-0 border-platinumDark">
            <InputLabel
              className="mb-2 lg:text-smokyBlack"
              label={t('addBook.coverPhoto')}
              required
            />
            <MultipleImageFileInput
              errors={errors as Record<string, FieldError>}
              name="coverPhotos"
            />
          </div>
        </div>
        <div className="mt-4 pb-4">
          <InputLabel label={t('addBook.bookTitle')} required className="mb-2 lg:text-smokyBlack" />
          <ControlledInputField
            name="title"
            placeholder={t('addBook.bookTitlePlaceholder')}
            className="rounded-md lg:border-gray"
            showErrorMessage
          />
        </div>
        <div className="pb-4">
          <InputLabel
            label={t('addBook.authorName')}
            required
            className="mb-2 lg:text-smokyBlack"
          />
          <ControlledInputField
            name="author"
            placeholder={t('addBook.authorPlaceholder')}
            className="rounded-md lg:border-gray"
            showErrorMessage
          />
        </div>
      </div>
      <div>
        <div className="pb-4">
          <InputLabel
            label={t('addBook.bookLanguage')}
            required
            className="mb-2 lg:text-smokyBlack"
          />
          <ControlledInputField
            type="select"
            name="language"
            className="rounded-md lg:border-gray"
            options={languageOptions}
            showErrorMessage
          />
        </div>
        <div className="lg:mt-0 pb-4">
          <InputLabel
            label={t('addBook.bookCondition')}
            required
            className="mb-2 lg:text-smokyBlack"
          />
          <ControlledInputField
            type="select"
            name="condition"
            className="rounded-md lg:border-gray"
            options={conditionOptions}
            showErrorMessage
          />
        </div>
        <div className="pb-4">
          <InputLabel label={t('addBook.shortDescription')} className="mb-2 lg:text-smokyBlack" />
          <ControlledInputField
            type="textarea"
            name="description"
            placeholder={t('addBook.descriptionPlaceholder')}
            className="rounded-md lg:border-gray h-[83px]"
            showErrorMessage
          />
        </div>
      </div>
    </div>
  );
}
