import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SupportUsHeader from '../../../pages/support-us/components/SupportUsHeader';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../pages/addUpdateBook/_components/BookAddUpdateHeader', () => ({
  default: ({ title, onBack }: { title: string; onBack: () => void }) => (
    <div data-testid="book-add-update-header">
      <button onClick={onBack} data-testid="back-button">
        Back
      </button>
      <span>{title}</span>
    </div>
  ),
}));

describe('SupportUsHeader', () => {
  it('renders the BookAddUpdateHeader with translated title', () => {
    render(<SupportUsHeader onBack={vi.fn()} />);

    expect(screen.getByTestId('book-add-update-header')).toBeInTheDocument();
    expect(screen.getByText('supportUs.header')).toBeInTheDocument();
  });

  it('renders the heading text', () => {
    render(<SupportUsHeader onBack={vi.fn()} />);

    expect(screen.getByText('supportUs.heading')).toBeInTheDocument();
  });

  it('renders the subtitle text', () => {
    render(<SupportUsHeader onBack={vi.fn()} />);

    expect(screen.getByText('supportUs.title')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    const onBack = vi.fn();
    render(<SupportUsHeader onBack={onBack} />);

    screen.getByTestId('back-button').click();
    expect(onBack).toHaveBeenCalledOnce();
  });
});
