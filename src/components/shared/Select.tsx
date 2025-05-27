import React, { forwardRef } from 'react';

interface ISelectProps {
  value?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null | undefined;
  placeholder?: string;
  className?: string;
  showErrorMessage?: boolean;
  options: {
    label: string;
    value: string;
  }[];
}
const Select = forwardRef<HTMLSelectElement, ISelectProps>(
  ({ value, name, onChange, className, error, options, showErrorMessage = false }, ref) => {
    return (
      <div className="flex flex-col">
        <select
          ref={ref}
          value={value}
          name={name}
          className={`w-full border rounded-md px-[14px] py-4 outline-none text-sm  text-[#31373D] border-[#E6E6E6]  ${error ? 'border border-rose-500' : ''}  ${
            className && className
          }`}
          onChange={onChange}
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
