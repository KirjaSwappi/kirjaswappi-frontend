import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import PrivacyPolicy from '../../../pages/privacyPolicy/index';

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
    useLocation: () => ({ pathname: '/privacy' }),
  };
});

// Mock child components
vi.mock('../../../pages/privacyPolicy/components/PrivacyPolicyHeader', () => ({
  default: ({ onBack }: { onBack: () => void }) => (
    <div data-testid="privacy-header">
      <button onClick={onBack} data-testid="privacy-back-btn">
        Back
      </button>
    </div>
  ),
}));

vi.mock('../../../pages/privacyPolicy/components/PrivacyPolicySection', () => ({
  default: ({ category }: { category: string; item: unknown }) => (
    <div data-testid="privacy-section">{category}</div>
  ),
}));

// Mock the hook to return predictable data
vi.mock('../../../pages/privacyPolicy/components/usePrivacyPolicyData', () => ({
  usePrivacyPolicyData: () => ({
    CategorySectionData: [
      {
        id: 1,
        category: 'Data Collection',
        Mobilecategory: 'Collection',
        title: 'We collect your data.',
        children: [],
      },
      {
        id: 2,
        category: 'Data Security',
        Mobilecategory: 'Security',
        title: 'We protect your data.',
        children: [
          {
            subHeading: 'Encryption',
            points: ['We use industry-standard encryption.'],
          },
        ],
      },
    ],
  }),
}));

describe('PrivacyPolicy Page', () => {
  it('renders the privacy policy header', () => {
    renderWithProviders(<PrivacyPolicy />);

    expect(screen.getByTestId('privacy-header')).toBeInTheDocument();
  });

  it('renders mobile sections via PrivacyPolicySection', () => {
    renderWithProviders(<PrivacyPolicy />);

    expect(screen.getAllByTestId('privacy-section').length).toBe(2);
  });

  it('renders last updated date', () => {
    renderWithProviders(<PrivacyPolicy />);

    expect(screen.getByText(/16.03.2025/)).toBeInTheDocument();
  });

  it('renders intro text', () => {
    renderWithProviders(<PrivacyPolicy />);

    expect(screen.getByText('privacypolicy.intro1')).toBeInTheDocument();
    expect(screen.getByText('privacypolicy.intro2')).toBeInTheDocument();
  });

  it('renders category headings on desktop view', () => {
    renderWithProviders(<PrivacyPolicy />);

    expect(screen.getByText(/Data Collection/)).toBeInTheDocument();
    expect(screen.getByText(/Data Security/)).toBeInTheDocument();
  });

  it('renders subtitle for mobile', () => {
    renderWithProviders(<PrivacyPolicy />);

    expect(screen.getByText('privacypolicy.subtitle')).toBeInTheDocument();
  });

  it('renders end section title', () => {
    renderWithProviders(<PrivacyPolicy />);

    expect(screen.getByText('privacypolicy.end.title')).toBeInTheDocument();
  });

  it('renders end section description', () => {
    renderWithProviders(<PrivacyPolicy />);

    expect(screen.getByText('privacypolicy.end.description')).toBeInTheDocument();
  });

  it('navigates back when back button is clicked', () => {
    renderWithProviders(<PrivacyPolicy />);

    const backBtn = screen.getByTestId('privacy-back-btn');
    backBtn.click();

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
