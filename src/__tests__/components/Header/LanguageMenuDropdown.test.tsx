import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: { language: 'en' },
  }),
}));

vi.mock('../../../assets/englishLanguage.png', () => ({ default: 'en.png' }));
vi.mock('../../../assets/finlandIcon.png', () => ({ default: 'fi.png' }));
vi.mock('../../../assets/swedishLanguage.png', () => ({ default: 'sv.png' }));

vi.mock('../../../utility/i18n', () => ({
  setLanguage: vi.fn(),
}));

import LanguageMenuDropdown from '../../../components/Header/_components/LanguageMenuDropdown';

describe('LanguageMenuDropdown', () => {
  it('renders all language options', () => {
    render(<LanguageMenuDropdown />);
    expect(screen.getByText('Finnish')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Swedish')).toBeInTheDocument();
  });

  it('renders flag images', () => {
    render(<LanguageMenuDropdown />);
    expect(screen.getByAltText('Finnish flag')).toBeInTheDocument();
    expect(screen.getByAltText('English flag')).toBeInTheDocument();
    expect(screen.getByAltText('Swedish flag')).toBeInTheDocument();
  });

  it('highlights current language', () => {
    render(<LanguageMenuDropdown />);
    const enBtn = screen.getByText('English').closest('button');
    expect(enBtn?.className).toContain('bg-primary');
  });
});
