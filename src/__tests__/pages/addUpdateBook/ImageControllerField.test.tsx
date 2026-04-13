import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';

vi.mock('../../../assets/close.png', () => ({ default: 'close.png' }));

vi.mock('../../../components/shared/Button', () => ({
  default: ({
    children,
    onClick,
    className,
    type,
    'aria-label': ariaLabel,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: string;
    'aria-label'?: string;
  }) => (
    <button
      onClick={onClick}
      className={className}
      type={type as 'button' | 'submit'}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  ),
}));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt || ''} />,
}));

import ImageFileInput from '../../../pages/addUpdateBook/_components/ImageControllerField';

function Wrapper() {
  const methods = useForm({ defaultValues: { coverPhoto: null } });
  return (
    <FormProvider {...methods}>
      <ImageFileInput name="coverPhoto" />
    </FormProvider>
  );
}

describe('ImageFileInput', () => {
  it('renders upload picture text when no image', () => {
    render(<Wrapper />);
    expect(screen.getByText('Upload Picture')).toBeInTheDocument();
  });

  it('renders + icon', () => {
    render(<Wrapper />);
    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('renders file input', () => {
    render(<Wrapper />);
    const input = document.getElementById('file-coverPhoto') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.type).toBe('file');
  });
});
