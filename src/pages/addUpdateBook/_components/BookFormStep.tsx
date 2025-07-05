import { FieldErrors } from 'react-hook-form';
import { TOptions } from '../types/interface';
import BookDetailsStep from './BookDetailsStep';
import OtherDetailsStep from './OtherDetailsStep';
import SwapConditionsStep from './SwapConditionsStep';

const BookFormStep = ({
  activeStep,
  errors,
  languages,
  conditions,
}: {
  activeStep: number;
  errors: FieldErrors;
  languages: TOptions[] | undefined;
  conditions: TOptions[] | undefined;
}) => {
  switch (activeStep) {
    case 0:
      return (
        <BookDetailsStep
          errors={errors}
          languageOptions={languages}
          conditionOptions={conditions}
        />
      );
    case 1:
      return <OtherDetailsStep errors={errors} />;
    case 2:
      return <SwapConditionsStep errors={errors} />;
    default:
      return null;
  }
};

export default BookFormStep;
