import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import ContactUs from '../../../pages/contactUs/ContactUs';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock formApi
const mockSubmitFormMutation = vi.fn();
vi.mock('../../../redux/feature/form/formApi', () => ({
  useSubmitFormMutation: () => [mockSubmitFormMutation, { isLoading: false }],
}));

// Mock toast
vi.mock('../../../components/shared/toast', () => ({
  showToast: vi.fn(),
}));

// Mock child components
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

vi.mock('../../../components/shared/ControllerField', () => ({
  default: ({
    name,
    placeholder,
    type,
  }: {
    name: string;
    placeholder?: string;
    type?: string;
    className?: string;
    showErrorMessage?: boolean;
  }) =>
    type === 'textarea' ? (
      <textarea data-testid={`input-${name}`} placeholder={placeholder} />
    ) : (
      <input data-testid={`input-${name}`} placeholder={placeholder} />
    ),
}));

vi.mock('../../../components/shared/InputLabel', () => ({
  default: ({ label }: { label: string; className?: string }) => (
    <label data-testid={`label-${label}`}>{label}</label>
  ),
}));

vi.mock('../../../components/shared/Button', () => ({
  default: ({
    children,
    type,
    disabled,
  }: {
    children: React.ReactNode;
    type?: string;
    disabled?: boolean;
    className?: string;
  }) => (
    <button
      type={(type as 'button' | 'submit' | 'reset') || 'button'}
      disabled={disabled}
      data-testid="submit-button"
    >
      {children}
    </button>
  ),
}));

describe('ContactUs Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSubmitFormMutation.mockResolvedValue({ unwrap: () => Promise.resolve({}) });
  });

  it('renders the contact us header text', () => {
    renderWithProviders(<ContactUs />);

    // t('contactus.header') returns 'contactus.header' in our mock
    expect(screen.getAllByText('contactus.header').length).toBeGreaterThan(0);
  });

  it('renders name input field', () => {
    renderWithProviders(<ContactUs />);

    expect(screen.getByTestId('input-name')).toBeInTheDocument();
  });

  it('renders email input field', () => {
    renderWithProviders(<ContactUs />);

    expect(screen.getByTestId('input-email')).toBeInTheDocument();
  });

  it('renders subject input field', () => {
    renderWithProviders(<ContactUs />);

    expect(screen.getByTestId('input-subject')).toBeInTheDocument();
  });

  it('renders message/description textarea', () => {
    renderWithProviders(<ContactUs />);

    expect(screen.getByTestId('input-description')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    renderWithProviders(<ContactUs />);

    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('renders subtitle text', () => {
    renderWithProviders(<ContactUs />);

    expect(screen.getByText('contactus.subtitle')).toBeInTheDocument();
  });

  it('renders back header on mobile', () => {
    renderWithProviders(<ContactUs />);

    expect(screen.getByTestId('add-update-header')).toBeInTheDocument();
  });

  it('navigates back when back button clicked', () => {
    renderWithProviders(<ContactUs />);

    const backButton = screen.getByTestId('back-button');
    backButton.click();

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
