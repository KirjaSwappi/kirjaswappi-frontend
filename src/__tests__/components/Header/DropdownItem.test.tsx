import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DropdownItem from '../../../components/Header/_components/DropdownItem';

describe('DropdownItem', () => {
  it('renders icon and label', () => {
    render(<DropdownItem icon={<span>icon</span>} label="Settings" />);
    expect(screen.getByText('icon')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <DropdownItem icon={<span>x</span>} label="Test" className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
