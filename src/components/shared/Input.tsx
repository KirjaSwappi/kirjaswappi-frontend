import React, { forwardRef } from 'react';
import { cn } from '../../utility/cn';

interface IInputFieldProps {
  id?: string;
  type?: 'text' | 'password' | 'email';
  value?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string | null | undefined;
  placeholder?: string;
  className?: string;
  showErrorMessage?: boolean;
}

const Input = forwardRef<HTMLInputElement, IInputFieldProps>(function Input(
  {
    type = 'text',
    id,
    value,
    name,
    onChange,
    placeholder,
    className,
    error,
    showErrorMessage = false,
    onBlur,
  }: IInputFieldProps,
  ref,
) {
  return (
    <div className="flex flex-col">
      <input
        ref={ref}
        type={type}
        id={id}
        value={value}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={cn(
          `w-full h-[48px] px-[14px] py-2 bg-white border border-[#E6E6E6] ${
            error ? 'border border-rose-500' : 'focus:ring-grayDark focus:border-grayDark'
          } bg-[#F2F2F2] focus:outline-none placeholder:text-sm placeholder:text-grayDark `,
          className,
        )}
      />
      {showErrorMessage && error && <div className="text-rose-500 text-xs mt-1 pl-2">{error}</div>}
    </div>
  );
});

export default Input;
