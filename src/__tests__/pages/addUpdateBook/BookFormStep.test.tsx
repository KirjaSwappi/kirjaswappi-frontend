import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';

vi.mock('../../../pages/addUpdateBook/_components/BookDetailsStep', () => ({
  default: () => <div data-testid="book-details-step">BookDetailsStep</div>,
}));

vi.mock('../../../pages/addUpdateBook/_components/OtherDetailsStep', () => ({
  default: () => <div data-testid="other-details-step">OtherDetailsStep</div>,
}));

vi.mock('../../../pages/addUpdateBook/_components/SwapConditionsStep', () => ({
  default: () => <div data-testid="swap-conditions-step">SwapConditionsStep</div>,
}));

vi.mock('../../../pages/addUpdateBook/types/interface', () => ({}));

import BookFormStep from '../../../pages/addUpdateBook/_components/BookFormStep';

function Wrapper({ step }: { step: number }) {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <BookFormStep activeStep={step} errors={{}} languages={[]} conditions={[]} />
    </FormProvider>
  );
}

describe('BookFormStep', () => {
  it('renders BookDetailsStep for step 0', () => {
    render(<Wrapper step={0} />);
    expect(screen.getByTestId('book-details-step')).toBeInTheDocument();
  });

  it('renders OtherDetailsStep for step 1', () => {
    render(<Wrapper step={1} />);
    expect(screen.getByTestId('other-details-step')).toBeInTheDocument();
  });

  it('renders SwapConditionsStep for step 2', () => {
    render(<Wrapper step={2} />);
    expect(screen.getByTestId('swap-conditions-step')).toBeInTheDocument();
  });

  it('renders nothing for invalid step', () => {
    const { container } = render(<Wrapper step={99} />);
    expect(container.querySelector('[data-testid]')).toBeNull();
  });
});
