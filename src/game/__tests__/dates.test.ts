import {
  capitalize,
  dateFromDailySeed,
  formatDayAndMonth,
  formatWeekdayAndDate,
} from '../dates';
import { dailySeed } from '../pieces';

describe('formatDayAndMonth', () => {
  it('writes the day and the month in French', () => {
    expect(formatDayAndMonth(new Date(2026, 9, 7))).toBe('7 octobre');
    expect(formatDayAndMonth(new Date(2026, 7, 15))).toBe('15 août');
    expect(formatDayAndMonth(new Date(2026, 11, 31))).toBe('31 décembre');
  });

  it('writes « 1er » for the first day of a month', () => {
    expect(formatDayAndMonth(new Date(2027, 2, 1))).toBe('1er mars');
  });
});

describe('formatWeekdayAndDate', () => {
  it('adds the day of the week', () => {
    expect(formatWeekdayAndDate(new Date(2026, 9, 6))).toBe('mardi 6 octobre');
    expect(formatWeekdayAndDate(new Date(2026, 9, 7))).toBe('mercredi 7 octobre');
    expect(formatWeekdayAndDate(new Date(2026, 9, 11))).toBe('dimanche 11 octobre');
  });
});

describe('capitalize', () => {
  it('puts the first letter in upper case', () => {
    expect(capitalize('mercredi 7 octobre')).toBe('Mercredi 7 octobre');
    expect(capitalize('')).toBe('');
  });
});

describe('dateFromDailySeed', () => {
  it('reads back the day of a daily seed', () => {
    const date = dateFromDailySeed(20261006);

    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2026, 9, 6]);
  });

  it('is the inverse of dailySeed', () => {
    const day = new Date(2027, 0, 1, 18, 30);

    expect(dailySeed(dateFromDailySeed(dailySeed(day)))).toBe(20270101);
  });
});
