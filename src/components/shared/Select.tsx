import React, { forwardRef } from 'react';
import { cn } from '../../utility/cn';

interface ISelectProps {
  value?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null | undefined;
  placeholder?: string;
  className?: string;
  showErrorMessage?: boolean;
  disabled?: boolean;
  options: {
    label: string;
    value: string;
  }[];
}
const Select = forwardRef<HTMLSelectElement, ISelectProps>(
  (
    {
      value,
      name,
      onChange,
      className,
      error,
      options,
      showErrorMessage = false,
      disabled = false,
    },
    ref,
  ) => {
    return (
      <div className="flex flex-col">
        <select
          ref={ref}
          value={value}
          name={name}
          className={cn(
            `w-full border rounded-md px-[14px] py-4 outline-none text-sm  text-[#31373D] bg-white lg:bg-AntiFlashWhite lg:border-grayDark border-gray  ${error ? 'border border-rose-500' : ''} `,
            className,
          )}
          onChange={onChange}
          disabled={disabled}
        >
          <option value="">Select {name || 'options'}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {showErrorMessage && error && (
          <div className="text-rose-500 text-xs mt-1 pl-2">{error}</div>
        )}
      </div>
    );
  },
);
Select.displayName = 'Select';
export default Select;
