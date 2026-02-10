import { describe, expect, it } from 'vitest';

function validateQc(ordered: number, recGood: number, recBad: number, inputGood: number, inputBad: number) {
  const remaining = ordered - recGood - recBad;
  if (inputGood + inputBad > remaining) throw new Error('Qty QC melebihi sisa');
}

describe('QC validation', () => {
  it('allows partial receive', () => {
    expect(() => validateQc(10, 2, 1, 3, 2)).not.toThrow();
  });

  it('blocks over receive', () => {
    expect(() => validateQc(10, 4, 3, 3, 1)).toThrow();
  });
});
