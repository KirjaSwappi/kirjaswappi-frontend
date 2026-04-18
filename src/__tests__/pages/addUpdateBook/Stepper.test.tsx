import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Stepper from '../../../pages/addUpdateBook/_components/Stepper';

const baseSteps = [
  { labelKey: 'addBook.bookDetails', isCompleted: false, isActive: true },
  { labelKey: 'addBook.otherDetails', isCompleted: false, isActive: false },
  { labelKey: 'addBook.swapCondition', isCompleted: false, isActive: false },
];

describe('Stepper', () => {
  it('should render all step labels', () => {
    render(<Stepper steps={baseSteps} />);
    expect(screen.getByText('Book Details')).toBeInTheDocument();
    expect(screen.getByText('Other Details')).toBeInTheDocument();
    expect(screen.getByText('Swap Condition')).toBeInTheDocument();
  });

  it('should show "Completed" text for completed steps', () => {
    const steps = [
      { labelKey: 'addBook.bookDetails', isCompleted: true, isActive: false },
      { labelKey: 'addBook.otherDetails', isCompleted: false, isActive: true },
      { labelKey: 'addBook.swapCondition', isCompleted: false, isActive: false },
    ];
    render(<Stepper steps={steps} />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('should render step numbers', () => {
    render(<Stepper steps={baseSteps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should render helper text for each step', () => {
    render(<Stepper steps={baseSteps} />);
    const helperTexts = screen.getAllByText('Add your book details here');
    expect(helperTexts.length).toBe(3);
  });
});
