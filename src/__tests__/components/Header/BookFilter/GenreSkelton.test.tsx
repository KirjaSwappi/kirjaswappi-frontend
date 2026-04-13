import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import GenreSkelton from '../../../../components/Header/_components/BookFilter/GenreSkelton';

describe('GenreSkelton', () => {
  it('renders skeleton elements', () => {
    const { container } = render(<GenreSkelton />);
    const skeletons = container.querySelectorAll('.bg-platinum');
    expect(skeletons.length).toBe(2);
  });
});
