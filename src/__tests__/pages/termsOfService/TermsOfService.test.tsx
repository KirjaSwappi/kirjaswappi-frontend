import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import TermsOfService from '../../../pages/termsOfService/index';

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

// Mock child components
vi.mock('../../../pages/termsOfService/components/TermsOfServiceHeader', () => ({
  default: ({ onBack }: { onBack: () => void }) => (
    <div data-testid="tos-header">
      <button onClick={onBack} data-testid="tos-back-btn">
        Back
      </button>
    </div>
  ),
}));

vi.mock('../../../pages/termsOfService/components/TermsOfServiceSection', () => ({
  default: ({ category }: { category: string; item: unknown }) => (
    <div data-testid="tos-section">{category}</div>
  ),
}));

// Mock the hook to return predictable data
vi.mock('../../../pages/termsOfService/components/useTermsOfServiceData', () => ({
  useTermsOfServiceData: () => ({
    CategorySectionData: [
      {
        id: 1,
        category: 'Acceptance of Terms',
        Mobilecategory: 'Acceptance',
        title: 'By using our service, you accept these terms.',
        children: [],
      },
      {
        id: 2,
        category: 'User Accounts',
        Mobilecategory: 'Accounts',
        title: 'You must create an account to use our service.',
        children: [
          {
            subHeading: 'Registration',
            points: ['You must be 18 years or older.'],
          },
        ],
      },
    ],
    getSectionById: vi.fn(),
  }),
}));

describe('TermsOfService Page', () => {
  it('renders the terms of service header', () => {
    renderWithProviders(<TermsOfService />);

    expect(screen.getByTestId('tos-header')).toBeInTheDocument();
  });

  it('renders section categories on mobile', () => {
    renderWithProviders(<TermsOfService />);

    // Mobile sections render via TermsOfServiceSection
    expect(screen.getAllByTestId('tos-section').length).toBe(2);
  });

  it('renders last updated date', () => {
    renderWithProviders(<TermsOfService />);

    // The date is hard-coded in the component
    expect(screen.getByText(/13.04.2026/)).toBeInTheDocument();
  });

  it('renders intro text', () => {
    renderWithProviders(<TermsOfService />);

    expect(screen.getByText('termsofservice.intro')).toBeInTheDocument();
  });

  it('renders category headings on desktop view', () => {
    renderWithProviders(<TermsOfService />);

    expect(screen.getByText(/Acceptance of Terms/)).toBeInTheDocument();
    expect(screen.getByText(/User Accounts/)).toBeInTheDocument();
  });

  it('navigates back when back button is clicked', () => {
    renderWithProviders(<TermsOfService />);

    const backBtn = screen.getByTestId('tos-back-btn');
    backBtn.click();

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('renders subtitle for mobile', () => {
    renderWithProviders(<TermsOfService />);

    expect(screen.getByText('termsofservice.subtitle')).toBeInTheDocument();
  });
});
