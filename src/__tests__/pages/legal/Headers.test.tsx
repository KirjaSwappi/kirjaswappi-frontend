import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../pages/addUpdateBook/_components/BookAddUpdateHeader', () => ({
  default: ({ title, onBack }: { title: string; onBack: () => void }) => (
    <div data-testid="header">
      <span>{title}</span>
      <button onClick={onBack}>back</button>
    </div>
  ),
}));

import PrivacyPolicyHeader from '../../../pages/privacyPolicy/components/PrivacyPolicyHeader';
import TermsOfServiceHeader from '../../../pages/termsOfService/components/TermsOfServiceHeader';

describe('PrivacyPolicyHeader', () => {
  it('renders header title', () => {
    render(<PrivacyPolicyHeader onBack={vi.fn()} />);
    expect(screen.getAllByText('privacypolicy.header').length).toBeGreaterThanOrEqual(1);
  });
});

describe('TermsOfServiceHeader', () => {
  it('renders header title', () => {
    render(<TermsOfServiceHeader onBack={vi.fn()} />);
    expect(screen.getAllByText('termsofservice.header').length).toBeGreaterThanOrEqual(1);
  });
});
