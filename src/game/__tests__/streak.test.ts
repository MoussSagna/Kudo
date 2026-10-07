import { currentStreak, EMPTY_STREAK, extendStreak, type Streak } from '../streak';

function finishOn(days: readonly string[], from: Streak = EMPTY_STREAK): Streak {
  return days.reduce(extendStreak, from);
}

describe('extendStreak', () => {
  it('starts at 1 with the first challenge', () => {
    expect(extendStreak(EMPTY_STREAK, '2026-10-07')).toEqual({
      count: 1,
      best: 1,
      lastDay: '2026-10-07',
      days: ['2026-10-07'],
    });
  });

  it('grows by one the next day', () => {
    const streak = finishOn(['2026-10-07', '2026-10-08', '2026-10-09']);

    expect(streak.count).toBe(3);
    expect(streak.best).toBe(3);
    expect(streak.lastDay).toBe('2026-10-09');
  });

  it('starts again at 1 after a missed day, and keeps the record', () => {
    const streak = finishOn(['2026-10-07', '2026-10-08', '2026-10-09', '2026-10-11']);

    expect(streak.count).toBe(1);
    expect(streak.best).toBe(3);
  });

  it('counts a day only once', () => {
    const once = finishOn(['2026-10-07', '2026-10-08']);

    expect(extendStreak(once, '2026-10-08')).toBe(once);
  });

  it('ignores a day older than the last one', () => {
    const streak = finishOn(['2026-10-07', '2026-10-08']);

    expect(extendStreak(streak, '2026-10-06')).toBe(streak);
  });

  it('goes on across a month and a year', () => {
    expect(finishOn(['2026-10-30', '2026-10-31', '2026-11-01']).count).toBe(3);
    expect(finishOn(['2026-12-30', '2026-12-31', '2027-01-01', '2027-01-02']).count).toBe(4);
    expect(finishOn(['2028-02-28', '2028-02-29', '2028-03-01']).count).toBe(3);
  });

  it('beats the record only when the run gets longer than it', () => {
    const long = finishOn(['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04']);
    const short = finishOn(['2026-10-10', '2026-10-11'], long);

    expect(short.count).toBe(2);
    expect(short.best).toBe(4);
  });

  it('remembers the last 14 days played, oldest first', () => {
    const days = Array.from({ length: 20 }, (_, index) => `2026-10-${String(index + 1).padStart(2, '0')}`);
    const streak = finishOn(days);

    expect(streak.days).toHaveLength(14);
    expect(streak.days[0]).toBe('2026-10-07');
    expect(streak.days[13]).toBe('2026-10-20');
  });
});

describe('currentStreak', () => {
  const streak = finishOn(['2026-10-06', '2026-10-07', '2026-10-08']);

  it('is 0 when no challenge was ever finished', () => {
    expect(currentStreak(EMPTY_STREAK, '2026-10-07')).toBe(0);
  });

  it('holds on the day of the last challenge', () => {
    expect(currentStreak(streak, '2026-10-08')).toBe(3);
  });

  it('still holds the next day, before that day is played', () => {
    expect(currentStreak(streak, '2026-10-09')).toBe(3);
  });

  it('falls back to 0 once a whole day has been missed', () => {
    expect(currentStreak(streak, '2026-10-10')).toBe(0);
    expect(currentStreak(streak, '2026-11-08')).toBe(0);
  });

  it('holds across a month and a year', () => {
    expect(currentStreak(finishOn(['2026-12-30', '2026-12-31']), '2027-01-01')).toBe(2);
    expect(currentStreak(finishOn(['2026-12-30', '2026-12-31']), '2027-01-02')).toBe(0);
  });

  it('is the same however many times the app is opened on the same day', () => {
    expect(currentStreak(streak, '2026-10-08')).toBe(currentStreak(streak, '2026-10-08'));
    expect(extendStreak(extendStreak(streak, '2026-10-09'), '2026-10-09').count).toBe(4);
  });
});
