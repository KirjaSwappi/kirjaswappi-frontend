import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, type, ...props }, ref) => {
  return (
    <button type={type} ref={ref} {...props}>
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
