import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import SupportUs from '../../../pages/support-us';

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

vi.mock('../../../pages/support-us/components/SupportUsHeader', () => ({
  default: ({ onBack }: { onBack: () => void }) => (
    <div data-testid="support-us-header">
      <button onClick={onBack} data-testid="back-button">
        Back
      </button>
    </div>
  ),
}));

vi.mock('../../../pages/support-us/components/SupportUsCard', () => ({
  default: ({ data }: { data: { id: number; title: string; buttonText: string } }) => (
    <div data-testid={`support-card-${data.id}`}>
      <h1>{data.title}</h1>
      <button>{data.buttonText}</button>
    </div>
  ),
}));

describe('SupportUs Page', () => {
  it('renders the support us header', () => {
    renderWithProviders(<SupportUs />);
    expect(screen.getByTestId('support-us-header')).toBeInTheDocument();
  });

  it('renders three support section cards', () => {
    renderWithProviders(<SupportUs />);
    expect(screen.getByTestId('support-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('support-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('support-card-3')).toBeInTheDocument();
  });

  it('displays translated section titles', () => {
    renderWithProviders(<SupportUs />);
    expect(screen.getByText('supportUs.sectionTitle1')).toBeInTheDocument();
    expect(screen.getByText('supportUs.sectionTitle2')).toBeInTheDocument();
    expect(screen.getByText('supportUs.sectionTitle3')).toBeInTheDocument();
  });

  it('displays translated button texts', () => {
    renderWithProviders(<SupportUs />);
    expect(screen.getByText('supportUs.sectionBtn1')).toBeInTheDocument();
    expect(screen.getByText('supportUs.sectionBtn2')).toBeInTheDocument();
    expect(screen.getByText('supportUs.sectionBtn3')).toBeInTheDocument();
  });

  it('navigates back when back button is clicked', () => {
    renderWithProviders(<SupportUs />);
    screen.getByTestId('back-button').click();
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
