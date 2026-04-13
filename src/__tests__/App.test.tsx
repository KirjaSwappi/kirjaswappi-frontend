import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('../layout', () => ({
  default: () => <div data-testid="layout">Layout</div>,
}));

vi.mock('../App.css', () => ({}));

import App from '../App';

describe('App', () => {
  it('renders Layout', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('layout')).toBeInTheDocument();
  });
});
