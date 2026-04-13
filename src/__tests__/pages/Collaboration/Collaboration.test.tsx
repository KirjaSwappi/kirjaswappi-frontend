import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import Collaboration from '../../../pages/Collaboration';

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

vi.mock('../../../pages/Collaboration/form/CollaborationForm', () => ({
  default: ({ onSubmit, isLoading }: { onSubmit: () => void; isLoading: boolean }) => (
    <form data-testid="collaboration-form" onSubmit={onSubmit}>
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

describe('Collaboration Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSubmitForm.mockReturnValue({ unwrap: () => Promise.resolve() });
  });

  it('renders the heading', () => {
    renderWithProviders(<Collaboration />);
    expect(screen.getByText('collaboration.heading')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    renderWithProviders(<Collaboration />);
    expect(screen.getByText('collaboration.subtitle')).toBeInTheDocument();
  });

  it('renders the mobile header with translated title', () => {
    renderWithProviders(<Collaboration />);
    expect(screen.getByTestId('add-update-header')).toBeInTheDocument();
    expect(screen.getByText('collaboration.header')).toBeInTheDocument();
  });

  it('renders the collaboration form', () => {
    renderWithProviders(<Collaboration />);
    expect(screen.getByTestId('collaboration-form')).toBeInTheDocument();
  });

  it('renders inside SectionWithForm wrapper', () => {
    renderWithProviders(<Collaboration />);
    expect(screen.getByTestId('section-with-form')).toBeInTheDocument();
  });

  it('navigates back when back button is clicked', () => {
    renderWithProviders(<Collaboration />);
    screen.getByTestId('back-button').click();
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('submit button is not disabled when not loading', () => {
    renderWithProviders(<Collaboration />);
    expect(screen.getByTestId('submit-button')).not.toBeDisabled();
  });
});
