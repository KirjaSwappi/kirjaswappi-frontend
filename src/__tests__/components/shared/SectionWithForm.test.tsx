import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SectionWithForm from '../../../components/shared/SectionWithForm';

describe('SectionWithForm Component', () => {
  it('renders children', () => {
    render(
      <SectionWithForm imageSrc="/test-image.jpg">
        <div data-testid="form-content">Form Content</div>
      </SectionWithForm>,
    );
    expect(screen.getByTestId('form-content')).toBeInTheDocument();
    expect(screen.getByText('Form Content')).toBeInTheDocument();
  });

  it('renders the image with the provided src', () => {
    render(
      <SectionWithForm imageSrc="/test-image.jpg">
        <div>Form</div>
      </SectionWithForm>,
    );
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/test-image.jpg');
  });

  it('applies default imageAlt when not provided', () => {
    render(
      <SectionWithForm imageSrc="/test-image.jpg">
        <div>Form</div>
      </SectionWithForm>,
    );
    expect(screen.getByAltText('section image')).toBeInTheDocument();
  });

  it('applies custom imageAlt when provided', () => {
    render(
      <SectionWithForm imageSrc="/test-image.jpg" imageAlt="Register illustration">
        <div>Form</div>
      </SectionWithForm>,
    );
    expect(screen.getByAltText('Register illustration')).toBeInTheDocument();
  });

  it('renders the section element', () => {
    render(
      <SectionWithForm imageSrc="/test-image.jpg">
        <div>Form</div>
      </SectionWithForm>,
    );
    expect(document.querySelector('section')).toBeInTheDocument();
  });

  it('image section is hidden on mobile (hidden class)', () => {
    render(
      <SectionWithForm imageSrc="/test-image.jpg">
        <div>Form</div>
      </SectionWithForm>,
    );
    const imageContainer = screen.getByRole('img').parentElement;
    expect(imageContainer).toHaveClass('hidden');
  });

  it('accepts title and description props without rendering them', () => {
    render(
      <SectionWithForm imageSrc="/test-image.jpg" title="Register" description="Create account">
        <div>Form</div>
      </SectionWithForm>,
    );
    // title and description are not rendered in the current implementation
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
    expect(screen.queryByText('Create account')).not.toBeInTheDocument();
  });

  it('renders complex children', () => {
    render(
      <SectionWithForm imageSrc="/test-image.jpg">
        <form>
          <input placeholder="Email" />
          <button type="submit">Submit</button>
        </form>
      </SectionWithForm>,
    );
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });
});
