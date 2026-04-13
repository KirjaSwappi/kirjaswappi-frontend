import { describe, it, expect } from 'vitest';
import { applicationJSON } from '../../utility/headersConstant';

describe('headersConstant', () => {
  it('exports applicationJSON with correct Content-Type', () => {
    expect(applicationJSON).toEqual({
      'Content-Type': 'application/json',
    });
  });
});
