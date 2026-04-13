import { describe, it, expect } from 'vitest';
import { SUCCESS, ERROR, WARNING } from '../../constant/MESSAGETYPE';

describe('MESSAGETYPE constants', () => {
  it('exports SUCCESS as "SUCCESS"', () => {
    expect(SUCCESS).toBe('SUCCESS');
  });

  it('exports ERROR as "ERROR"', () => {
    expect(ERROR).toBe('ERROR');
  });

  it('exports WARNING as "WARNING"', () => {
    expect(WARNING).toBe('WARNING');
  });
});
