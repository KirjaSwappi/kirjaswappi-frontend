import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { cn } from '../../utility/cn';
import Input from './Input';

interface ControlledPasswordFieldProps {
  name: string;
  placeholder?: string;
  className?: string;
  showErrorMessage?: boolean;
}

const ControlledPasswordField: React.FC<ControlledPasswordFieldProps> = ({
  name,
  placeholder,
  className,
  showErrorMessage = false,
}) => {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="relative">
          <Input
            {...field}
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            className={cn(className, error && 'border-red')}
            error={error?.message}
            showErrorMessage={showErrorMessage}
          />

          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <AiOutlineEyeInvisible className="text-gray-500" />
            ) : (
              <AiOutlineEye className="text-gray-500" />
            )}
          </button>
        </div>
      )}
    />
  );
};

export default ControlledPasswordField;
