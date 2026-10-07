import {
  addDays,
  dateFromDayKey,
  dayKey,
  dayOfSeed,
  formatCountdown,
  isDayKey,
  msUntilNextDay,
  seedOfDay,
  weekOf,
} from '../days';
import { dailySeed } from '../pieces';

describe('dayKey', () => {
  it('writes the local day as AAAA-MM-JJ', () => {
    expect(dayKey(new Date(2026, 9, 7, 14, 30))).toBe('2026-10-07');
    expect(dayKey(new Date(2027, 0, 1, 0, 0, 0))).toBe('2027-01-01');
  });

  it('changes at local midnight', () => {
    expect(dayKey(new Date(2026, 9, 7, 23, 59, 59, 999))).toBe('2026-10-07');
    expect(dayKey(new Date(2026, 9, 8, 0, 0, 0, 0))).toBe('2026-10-08');
  });
});

describe('dateFromDayKey', () => {
  it('gives local midnight at the start of the day', () => {
    expect(dateFromDayKey('2026-10-07')).toEqual(new Date(2026, 9, 7, 0, 0, 0, 0));
  });

  it('refuses what is not a real day', () => {
    expect(dateFromDayKey('2026-13-01')).toBeNull();
    expect(dateFromDayKey('2026-02-30')).toBeNull();
    expect(dateFromDayKey('07/10/2026')).toBeNull();
    expect(dateFromDayKey('')).toBeNull();
  });
});

describe('isDayKey', () => {
  it('accepts only real days written AAAA-MM-JJ', () => {
    expect(isDayKey('2026-10-07')).toBe(true);
    expect(isDayKey('2026-10-32')).toBe(false);
    expect(isDayKey(20261007)).toBe(false);
    expect(isDayKey(null)).toBe(false);
  });
});

describe('addDays', () => {
  it('gives the next and the previous day', () => {
    expect(addDays('2026-10-07', 1)).toBe('2026-10-08');
    expect(addDays('2026-10-07', -1)).toBe('2026-10-06');
    expect(addDays('2026-10-07', 0)).toBe('2026-10-07');
  });

  it('crosses months, years and leap days', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2027-01-01', -1)).toBe('2026-12-31');
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
    expect(addDays('2027-02-28', 1)).toBe('2027-03-01');
  });
});

describe('weekOf', () => {
  it('gives Monday to Sunday of the week of a day', () => {
    const week = [
      '2026-10-05',
      '2026-10-06',
      '2026-10-07',
      '2026-10-08',
      '2026-10-09',
      '2026-10-10',
      '2026-10-11',
    ];

    expect(weekOf('2026-10-06')).toEqual(week);
    expect(weekOf('2026-10-05')).toEqual(week);
    expect(weekOf('2026-10-11')).toEqual(week);
  });

  it('crosses a month and a year', () => {
    expect(weekOf('2027-01-01')[0]).toBe('2026-12-28');
    expect(weekOf('2027-01-01')[6]).toBe('2027-01-03');
  });
});

describe('msUntilNextDay', () => {
  it('counts the time left until local midnight', () => {
    expect(msUntilNextDay(new Date(2026, 9, 7, 21, 45, 53))).toBe((2 * 3600 + 14 * 60 + 7) * 1000);
    expect(msUntilNextDay(new Date(2026, 9, 7, 23, 59, 59, 500))).toBe(500);
    expect(msUntilNextDay(new Date(2026, 9, 7, 0, 0, 0, 0))).toBe(24 * 3600 * 1000);
  });
});

describe('formatCountdown', () => {
  it('writes hours, minutes and seconds on two digits', () => {
    expect(formatCountdown((2 * 3600 + 14 * 60 + 7) * 1000)).toBe('02:14:07');
    expect(formatCountdown(24 * 3600 * 1000)).toBe('24:00:00');
    expect(formatCountdown(59 * 1000)).toBe('00:00:59');
  });

  it('rounds up to the second and stops at zero', () => {
    expect(formatCountdown(500)).toBe('00:00:01');
    expect(formatCountdown(0)).toBe('00:00:00');
    expect(formatCountdown(-3000)).toBe('00:00:00');
  });
});

describe('seedOfDay and dayOfSeed', () => {
  it('convert between a day and its daily seed', () => {
    expect(seedOfDay('2026-10-07')).toBe(20261007);
    expect(dayOfSeed(20261007)).toBe('2026-10-07');
    expect(dayOfSeed(20270101)).toBe('2027-01-01');
  });

  it('agree with dailySeed', () => {
    const date = new Date(2026, 9, 7, 18, 0);

    expect(seedOfDay(dayKey(date))).toBe(dailySeed(date));
  });
});
