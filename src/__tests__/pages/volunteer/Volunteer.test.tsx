import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Volunteer from '../../../pages/volunteer';

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

vi.mock('../../../components/shared/SectionWithForm', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="section-with-form">{children}</div>
  ),
}));

vi.mock('../../../pages/volunteer/form/VolunteerForm', () => ({
  default: ({ onSubmit, isLoading }: { onSubmit: () => void; isLoading: boolean }) => (
    <form data-testid="volunteer-form" onSubmit={onSubmit}>
      <input data-testid="input-name" name="name" />
      <input data-testid="input-email" name="email" />
      <input data-testid="input-subject" name="subject" />
      <textarea data-testid="input-description" name="description" />
      <button type="submit" data-testid="submit-button" disabled={isLoading}>
        Submit
      </button>
    </form>
  ),
}));

describe('Volunteer Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSubmitForm.mockReturnValue({ unwrap: () => Promise.resolve() });
  });

  it('renders the heading', () => {
    renderWithProviders(<Volunteer />);
    expect(screen.getByText('volunteer.heading')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    renderWithProviders(<Volunteer />);
    expect(screen.getByText('volunteer.subtitle')).toBeInTheDocument();
  });

  it('renders the mobile header with translated title', () => {
    renderWithProviders(<Volunteer />);
    expect(screen.getByTestId('add-update-header')).toBeInTheDocument();
    expect(screen.getByText('volunteer.header')).toBeInTheDocument();
  });

  it('renders the volunteer form', () => {
    renderWithProviders(<Volunteer />);
    expect(screen.getByTestId('volunteer-form')).toBeInTheDocument();
  });

  it('renders inside SectionWithForm wrapper', () => {
    renderWithProviders(<Volunteer />);
    expect(screen.getByTestId('section-with-form')).toBeInTheDocument();
  });

  it('navigates back when back button is clicked', () => {
    renderWithProviders(<Volunteer />);
    screen.getByTestId('back-button').click();
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('submit button is not disabled when not loading', () => {
    renderWithProviders(<Volunteer />);
    expect(screen.getByTestId('submit-button')).not.toBeDisabled();
  });
});
