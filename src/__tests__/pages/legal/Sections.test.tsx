import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-icons/fa6', () => ({
  FaAngleRight: () => <span>→</span>,
}));

vi.mock('../../../pages/privacyPolicy/interface/DummyDataType', () => ({}));

import PrivacyPolicySection from '../../../pages/privacyPolicy/components/PrivacyPolicySection';
import TermsOfServiceSection from '../../../pages/termsOfService/components/TermsOfServiceSection';

describe('PrivacyPolicySection', () => {
  it('renders category name as link', () => {
    render(
      <MemoryRouter>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <PrivacyPolicySection category="Data Collection" item={{ id: 1 }} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Data Collection')).toBeInTheDocument();
  });

  it('links to correct section', () => {
    render(
      <MemoryRouter>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <PrivacyPolicySection category="Test" item={{ id: 5 }} />
      </MemoryRouter>,
    );
    const link = screen.getByText('Test').closest('a');
    expect(link?.getAttribute('href')).toBe('/privacy-policy/5');
  });
});

describe('TermsOfServiceSection', () => {
  it('renders category name as link', () => {
    render(
      <MemoryRouter>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <TermsOfServiceSection category="User Accounts" item={{ id: 2 } as any} />
      </MemoryRouter>,
    );
    expect(screen.getByText('User Accounts')).toBeInTheDocument();
  });

  it('links to correct section', () => {
    render(
      <MemoryRouter>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <TermsOfServiceSection category="Test" item={{ id: 3 } as any} />
      </MemoryRouter>,
    );
    const link = screen.getByText('Test').closest('a');
    expect(link?.getAttribute('href')).toBe('/terms-of-service/3');
  });
});
