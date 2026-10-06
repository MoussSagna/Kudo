import { createRng } from '../pieces';

function take(rng: () => number, count: number): number[] {
  return Array.from({ length: count }, () => rng());
}

describe('createRng', () => {
  it('returns the same sequence for the same seed', () => {
    expect(take(createRng(20261006), 20)).toEqual(take(createRng(20261006), 20));
  });

  it('returns a different sequence for a different seed', () => {
    expect(take(createRng(20261006), 20)).not.toEqual(take(createRng(20261007), 20));
  });

  it('returns values in [0, 1)', () => {
    for (const value of take(createRng(1), 1000)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});
