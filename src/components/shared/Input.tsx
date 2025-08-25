import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '../../utility/cn';

export interface IInputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string | null;
  showErrorMessage?: boolean;
}
const Input = forwardRef<HTMLInputElement, IInputFieldProps>(function Input(
  {
    type = 'text',
    id,
    value,
    name,
    onChange,
    onBlur,
    onFocus,
    placeholder,
    className,
    error,
    showErrorMessage = false,
    autoComplete,
    ...props
  },
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
        autoComplete={autoComplete}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={placeholder}
        className={cn(
          `w-full h-[48px] px-[14px] py-2 bg-white ${
            error
              ? 'border border-red'
              : 'focus:ring-primary focus:border-primary  lg:bg-AntiFlashWhite border lg:border-grayDark border-gray'
          } focus:outline-none placeholder:text-sm placeholder:text-grayDark`,
          className,
        )}
        {...props}
      />
      {showErrorMessage && error && <div className="text-rose-500 text-xs mt-1 pl-2">{error}</div>}
    </div>
  );
});

export default Input;
