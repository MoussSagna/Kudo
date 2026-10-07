import { formatScore } from '../formatScore';

describe('formatScore', () => {
  it('leaves scores under 1000 as they are', () => {
    expect(formatScore(0)).toBe('0');
    expect(formatScore(999)).toBe('999');
  });

  it('groups thousands with a non-breaking space', () => {
    expect(formatScore(1240)).toBe('1 240');
    expect(formatScore(1234567)).toBe('1 234 567');
  });
});
