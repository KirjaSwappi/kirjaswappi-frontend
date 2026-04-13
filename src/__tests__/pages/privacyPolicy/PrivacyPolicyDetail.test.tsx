import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../pages/privacyPolicy/components/PrivacyPolicyHeader', () => ({
  default: ({ onBack }: { onBack: () => void }) => (
    <button data-testid="header-back" onClick={onBack}>
      Back
    </button>
  ),
}));

vi.mock('../../../pages/privacyPolicy/components/usePrivacyPolicyData', () => ({
  usePrivacyPolicyData: () => ({
    CategorySectionData: [],
    getSectionById: (id: number) => {
      if (id === 1) {
        return {
          id: 1,
          category: 'Data Collection',
          Mobilecategory: 'Data Collection',
          title: 'How we collect data',
          paragraph: 'Some paragraph',
          children: [
            { subHeading: 'Sub 1', points: ['Point 1', 'Point 2'] },
            { points: ['Point 3'] },
          ],
        };
      }
      return undefined;
    },
  }),
}));

import PrivacyPolicyDetail from '../../../pages/privacyPolicy/components/PrivacyPolicyDetail';

// jsdom defaults innerWidth to 1024 which triggers the desktop redirect
Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });

describe('PrivacyPolicyDetail', () => {
  const renderComponent = (sectionKey = '1') =>
    render(
      <MemoryRouter initialEntries={[`/privacy-policy/${sectionKey}`]}>
        <Routes>
          <Route path="/privacy-policy/:sectionKey" element={<PrivacyPolicyDetail />} />
        </Routes>
      </MemoryRouter>,
    );

  it('renders section title', () => {
    renderComponent('1');
    expect(screen.getByText('Data Collection')).toBeInTheDocument();
  });

  it('renders section description', () => {
    renderComponent('1');
    expect(screen.getByText(/How we collect data/)).toBeInTheDocument();
  });

  it('renders back button', () => {
    renderComponent('1');
    expect(screen.getByTestId('header-back')).toBeInTheDocument();
  });

  it('renders not found for invalid section', () => {
    renderComponent('999');
    expect(screen.getByText('privacypolicy.sectionNotFound')).toBeInTheDocument();
  });

  it('renders children points', () => {
    renderComponent('1');
    expect(screen.getByText('Point 1')).toBeInTheDocument();
    expect(screen.getByText('Point 2')).toBeInTheDocument();
  });

  it('renders subheading', () => {
    renderComponent('1');
    expect(screen.getByText(/Sub 1/)).toBeInTheDocument();
  });
});
