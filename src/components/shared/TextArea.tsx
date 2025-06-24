import React, { forwardRef } from 'react';
import { cn } from '../../utility/cn';

interface TextAreaProps {
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value?: string | undefined;
  placeholder?: string;
  max?: number;
  error?: string | null | undefined;
  showErrorMessage?: boolean;
  className?: string;
  onBlur?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ name, onChange, value, placeholder, error, showErrorMessage, className, onBlur }, ref) => {
    return (
      <div className="flex flex-col">
        <textarea
          ref={ref}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          placeholder={placeholder}
          className={cn(
            `w-full h-[48px] px-[14px] py-2  bg-white border border-[#E6E6E6] ${
              error ? 'border-rose-500' : 'focus:ring-grayDark focus:border-grayDark'
            } bg-[#F2F2F2] focus:outline-none  placeholder:text-sm placeholder:text-grayDark `,
            className,
          )}
        ></textarea>
        {showErrorMessage && error && (
          <div className="text-rose-500 text-xs mt-1 pl-2">{error}</div>
        )}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';

export default TextArea;
