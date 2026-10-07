import { createRng, dailySeed } from '../pieces';

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

describe('dailySeed', () => {
  it('is the local date written as YYYYMMDD', () => {
    expect(dailySeed(new Date(2026, 9, 7, 12, 0))).toBe(20261007);
    expect(dailySeed(new Date(2027, 0, 1, 12, 0))).toBe(20270101);
  });

  it('changes at local midnight, whatever the time zone of the device', () => {
    expect(dailySeed(new Date(2026, 9, 7, 23, 59, 59))).toBe(20261007);
    expect(dailySeed(new Date(2026, 9, 8, 0, 0, 0))).toBe(20261008);
    expect(dailySeed(new Date(2026, 9, 7, 0, 30))).toBe(20261007);
  });

  it('is the same all day long', () => {
    expect(dailySeed(new Date(2026, 9, 7, 0, 0, 1))).toBe(dailySeed(new Date(2026, 9, 7, 23, 0)));
  });
});
