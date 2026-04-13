import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../../../assets/plusAdd.png', () => ({ default: 'plus.png' }));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt || ''} />,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import AddBookAction from '../../../pages/profile/components/AddBookAction';

describe('AddBookAction', () => {
  it('renders add a book text', () => {
    render(<AddBookAction />);
    expect(screen.getByText('profile.addABook')).toBeInTheDocument();
  });

  it('renders plus icon', () => {
    render(<AddBookAction />);
    expect(screen.getByAltText('Plus')).toBeInTheDocument();
  });

  it('navigates on click', () => {
    render(<AddBookAction />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockNavigate).toHaveBeenCalledWith('/profile/add-book');
  });
});
