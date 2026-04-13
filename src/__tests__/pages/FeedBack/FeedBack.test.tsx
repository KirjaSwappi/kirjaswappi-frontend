import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Feedback from '../../../pages/FeedBack';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockSubmitForm = vi.fn();
vi.mock('../../../redux/feature/form/formApi', () => ({
  useSubmitFormMutation: () => [mockSubmitForm, { isLoading: false }],
}));

vi.mock('../../../components/shared/toast', () => ({
  showToast: vi.fn(),
}));

vi.mock('../../../pages/addUpdateBook/_components/BookAddUpdateHeader', () => ({
  default: ({ title, onBack }: { title: string; onBack: () => void }) => (
    <div data-testid="add-update-header">
      <button onClick={onBack} data-testid="back-button">
        Back
      </button>
      <span>{title}</span>
    </div>
  ),
}));

vi.mock('../../../pages/FeedBack/form/FeedbackForm', () => ({
  default: ({ onSubmit, isLoading }: { onSubmit: () => void; isLoading: boolean }) => (
    <form data-testid="feedback-form" onSubmit={onSubmit}>
      <input data-testid="input-name" name="name" />
      <input data-testid="input-email" name="email" />
      <textarea data-testid="input-description" name="description" />
      <button type="submit" data-testid="submit-button" disabled={isLoading}>
        Submit
      </button>
    </form>
  ),
}));

describe('Feedback Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSubmitForm.mockReturnValue({ unwrap: () => Promise.resolve() });
  });

  it('renders the heading', () => {
    renderWithProviders(<Feedback />);
    expect(screen.getByText('feedback.heading')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    renderWithProviders(<Feedback />);
    expect(screen.getByText('feedback.subtitle')).toBeInTheDocument();
  });

  it('renders the mobile header with translated title', () => {
    renderWithProviders(<Feedback />);
    expect(screen.getByTestId('add-update-header')).toBeInTheDocument();
    expect(screen.getByText('feedback.header')).toBeInTheDocument();
  });

  it('renders the feedback form', () => {
    renderWithProviders(<Feedback />);
    expect(screen.getByTestId('feedback-form')).toBeInTheDocument();
  });

  it('navigates back when back button is clicked', () => {
    renderWithProviders(<Feedback />);
    screen.getByTestId('back-button').click();
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('submit button is not disabled when not loading', () => {
    renderWithProviders(<Feedback />);
    expect(screen.getByTestId('submit-button')).not.toBeDisabled();
  });
});
