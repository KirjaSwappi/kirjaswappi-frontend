import { ButtonHTMLAttributes, FC, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  // onClick?: () => void;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({ children, type, ...props }) => {
  return (
    <button type={type} {...props}>
      {children}
    </button>
  );
};

export default Button;
