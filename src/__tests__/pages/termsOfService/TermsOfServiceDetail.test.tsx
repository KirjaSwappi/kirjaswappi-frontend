import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../../../pages/termsOfService/components/TermsOfServiceHeader', () => ({
  default: ({ onBack }: { onBack: () => void }) => (
    <button data-testid="header-back" onClick={onBack}>
      Back
    </button>
  ),
}));

vi.mock('../../../pages/termsOfService/components/useTermsOfServiceData', () => ({
  useTermsOfServiceData: () => ({
    CategorySectionData: [],
    getSectionById: (id: number) => {
      if (id === 2) {
        return {
          id: 2,
          category: 'User Accounts',
          Mobilecategory: 'User Accounts',
          title: 'Account terms',
          children: [{ points: ['Must be 13+', 'Real info required', 'Keep password safe'] }],
        };
      }
      return undefined;
    },
  }),
}));

import TermsOfServiceDetail from '../../../pages/termsOfService/components/TermsOfServiceDetail';

Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });

describe('TermsOfServiceDetail', () => {
  const renderComponent = (sectionKey = '2') =>
    render(
      <MemoryRouter initialEntries={[`/terms-of-service/${sectionKey}`]}>
        <Routes>
          <Route path="/terms-of-service/:sectionKey" element={<TermsOfServiceDetail />} />
        </Routes>
      </MemoryRouter>,
    );

  it('renders section title', () => {
    renderComponent('2');
    expect(screen.getByText('User Accounts')).toBeInTheDocument();
  });

  it('renders back button', () => {
    renderComponent('2');
    expect(screen.getByTestId('header-back')).toBeInTheDocument();
  });

  it('renders not found for invalid section', () => {
    renderComponent('999');
    expect(screen.getByText('Section not found')).toBeInTheDocument();
  });

  it('renders children points', () => {
    renderComponent('2');
    expect(screen.getByText('Must be 13+')).toBeInTheDocument();
    expect(screen.getByText('Real info required')).toBeInTheDocument();
  });
});
