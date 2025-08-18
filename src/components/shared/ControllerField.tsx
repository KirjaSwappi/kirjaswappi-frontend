import { forwardRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Input from './Input';
import Select from './Select';
import TextArea from './TextArea';

interface ControlledInputFieldProps {
  name: string;
  type?: string;
  placeholder?: string;
  className?: string;
  options?: {
    label: string;
    value: string;
  }[];
  radioOptions?: { label: string; value: string }[];
  showErrorMessage?: boolean;
  autoComplete?: 'on' | 'off';
}

const ControlledInputField = forwardRef<HTMLInputElement, ControlledInputFieldProps>(
  (
    {
      name,
      type = 'input',
      placeholder,
      className,
      options,
      showErrorMessage = false,
      autoComplete = 'on',
    },
    ref,
  ) => {
    const { control } = useFormContext();

    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          return type === 'input' ? (
            <Input
              {...field}
              ref={ref}
              placeholder={placeholder}
              error={error?.message}
              className={className}
              showErrorMessage={showErrorMessage}
              autoComplete={autoComplete}
            />
          ) : type === 'select' ? (
            <Select
              {...field}
              placeholder={placeholder}
              options={options || []}
              error={error?.message}
              className={className}
              showErrorMessage={showErrorMessage}
            />
          ) : (
            <TextArea
              {...field}
              placeholder={placeholder}
              error={error?.message}
              className={className}
              showErrorMessage={showErrorMessage}
            />
          );
        }}
      />
    );
  },
);

ControlledInputField.displayName = 'ControlledInputField';
export default ControlledInputField;
