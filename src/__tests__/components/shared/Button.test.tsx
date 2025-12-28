import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../../components/shared/Button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies default button type when no type is provided', () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByRole('button');
    expect(button).not.toHaveAttribute('type'); // No type prop provided, so no type attribute
  });

  it('applies correct button type when type is provided', () => {
    render(<Button type="button">Button Type</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('applies submit type correctly', () => {
    render(<Button type="submit">Submit Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('applies reset type correctly', () => {
    render(<Button type="reset">Reset Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'reset');
  });

  it('passes through additional props to button element', () => {
    const onClick = vi.fn();
    const onMouseEnter = vi.fn();

    render(
      <Button
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        data-testid="custom-button"
        aria-label="Custom Button"
      >
        Custom Button
      </Button>,
    );

    const button = screen.getByTestId('custom-button');

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);

    fireEvent.mouseEnter(button);
    expect(onMouseEnter).toHaveBeenCalledTimes(1);

    expect(button).toHaveAttribute('aria-label', 'Custom Button');
  });

  it('handles disabled state correctly', () => {
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Disabled Button
      </Button>,
    );

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies className correctly', () => {
    render(<Button className="custom-class">Styled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('renders without children', () => {
    render(<Button />);
    const button = screen.getByRole('button');
    expect(button).toBeEmptyDOMElement();
  });

  it('renders complex children correctly', () => {
    render(
      <Button>
        <span>Icon</span>
        <strong>Text</strong>
      </Button>,
    );

    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('maintains button semantics', () => {
    render(<Button>Button Text</Button>);
    const button = screen.getByRole('button');
    expect(button.tagName).toBe('BUTTON');
  });
});
