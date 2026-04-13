import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import ChatInfoDropdown from '../../../pages/messages/components/ChatInfoDropdown';

// Mock useMouse
vi.mock('../../../hooks/useMouse', () => ({
  useMouseClick: () => ({
    clicked: false,
    setClicked: vi.fn(),
    reference: { current: null },
  }),
}));

describe('ChatInfoDropdown', () => {
  const mockProps = {
    onViewProfile: vi.fn(),
    onMute: vi.fn(),
    onBlock: vi.fn(),
    onReport: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the info button with aria-label', () => {
    renderWithProviders(<ChatInfoDropdown {...mockProps} />);
    expect(screen.getByLabelText('Chat options')).toBeInTheDocument();
  });
});
