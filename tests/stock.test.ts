import { describe, expect, it } from 'vitest';
import { validateNonNegative } from '@/server/stock';

describe('validateNonNegative', () => {
  it('accepts non-negative result', () => {
    expect(() => validateNonNegative(10, -3)).not.toThrow();
  });

  it('throws on negative result', () => {
    expect(() => validateNonNegative(2, -3)).toThrow('Stock tidak cukup');
  });
});
