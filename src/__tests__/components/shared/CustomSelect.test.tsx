import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/shared/cusSelect/CustomSelect';

describe('CustomSelect', () => {
  it('should render the select trigger', () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
  });

  it('should display the placeholder text', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose a genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fiction">Fiction</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByText('Choose a genre')).toBeInTheDocument();
  });

  it('should render with a default value', () => {
    render(
      <Select defaultValue="fiction">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fiction">Fiction</SelectItem>
          <SelectItem value="nonfiction">Non-Fiction</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByText('Fiction')).toBeInTheDocument();
  });

  it('should export all expected components', () => {
    expect(Select).toBeDefined();
    expect(SelectTrigger).toBeDefined();
    expect(SelectValue).toBeDefined();
    expect(SelectContent).toBeDefined();
    expect(SelectItem).toBeDefined();
  });
});
