import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Stepper from '../../../pages/addUpdateBook/_components/Stepper';

const baseSteps = [
  { label: 'Details', isCompleted: false, isActive: true },
  { label: 'Condition', isCompleted: false, isActive: false },
  { label: 'Photos', isCompleted: false, isActive: false },
];

describe('Stepper', () => {
  it('should render all step labels', () => {
    render(<Stepper steps={baseSteps} />);
    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('Condition')).toBeInTheDocument();
    expect(screen.getByText('Photos')).toBeInTheDocument();
  });

  it('should show "Completed" text for completed steps', () => {
    const steps = [
      { label: 'Details', isCompleted: true, isActive: false },
      { label: 'Condition', isCompleted: false, isActive: true },
      { label: 'Photos', isCompleted: false, isActive: false },
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
