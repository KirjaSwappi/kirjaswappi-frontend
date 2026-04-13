import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: { language: 'fi' },
  }),
}));

vi.mock('../../../assets/englishLanguage.png', () => ({ default: 'en.png' }));
vi.mock('../../../assets/flag.png', () => ({ default: 'fi.png' }));
vi.mock('../../../assets/swedishLanguage.png', () => ({ default: 'sv.png' }));

vi.mock('../../../components/shared/Button', () => ({
  default: ({
    children,
    onClick,
    'aria-label': ariaLabel,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    'aria-label'?: string;
    className?: string;
  }) => (
    <button onClick={onClick} aria-label={ariaLabel} className={className}>
      {children}
    </button>
  ),
}));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt || ''} />,
}));

import LanguageFlagButton from '../../../components/Header/_components/LanguageFlagButton';

describe('LanguageFlagButton', () => {
  it('renders flag image', () => {
    render(<LanguageFlagButton clicked={false} setClicked={vi.fn()} />);
    expect(screen.getByAltText('Current Language Flag')).toBeInTheDocument();
  });

  it('renders change language label', () => {
    render(<LanguageFlagButton clicked={false} setClicked={vi.fn()} />);
    expect(screen.getByLabelText('Change language')).toBeInTheDocument();
  });

  it('calls setClicked on click', () => {
    const setClicked = vi.fn();
    render(<LanguageFlagButton clicked={false} setClicked={setClicked} />);
    fireEvent.click(screen.getByLabelText('Change language'));
    expect(setClicked).toHaveBeenCalledWith(true);
  });
});
