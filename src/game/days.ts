/** A local day, written AAAA-MM-JJ. */
export type DayKey = string;

const DAY_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MINUTES_PER_HOUR = 60;
const DAYS_PER_WEEK = 7;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** The local day of a date. */
export function dayKey(date: Date): DayKey {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Local midnight at the start of a day; null when the text is not a real day. */
export function dateFromDayKey(day: DayKey): Date | null {
  const match = DAY_KEY_PATTERN.exec(day);
  if (!match) {
    return null;
  }
  const [year, month, dayOfMonth] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(year, month - 1, dayOfMonth);
  return dayKey(date) === day ? date : null;
}

export function isDayKey(value: unknown): value is DayKey {
  return typeof value === 'string' && dateFromDayKey(value) !== null;
}

/** The day `count` days after a day (before it when `count` is negative). */
export function addDays(day: DayKey, count: number): DayKey {
  const date = dateFromDayKey(day);
  if (!date) {
    return day;
  }
  return dayKey(new Date(date.getFullYear(), date.getMonth(), date.getDate() + count));
}

/** The seven days, Monday to Sunday, of the week a day belongs to. */
export function weekOf(day: DayKey): DayKey[] {
  const date = dateFromDayKey(day);
  if (!date) {
    return [];
  }
  const daysSinceMonday = (date.getDay() + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK;
  return Array.from({ length: DAYS_PER_WEEK }, (_, index) => addDays(day, index - daysSinceMonday));
}

/** Milliseconds left until the next local midnight. */
export function msUntilNextDay(now: Date): number {
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return nextMidnight.getTime() - now.getTime();
}

/** « 02:14:07 »: hours, minutes and seconds, rounded up so that it reaches 00:00:00 at midnight. */
export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / MS_PER_SECOND));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${pad(hours)}:${pad(minutes)}:${pad(totalSeconds % 60)}`;
}

/**
 * « 5 h 12 », or « 12 min » under an hour: a duration to the minute, rounded up so that it never
 * reads as less time than there is.
 */
export function formatHoursAndMinutes(ms: number): string {
  const totalMinutes = Math.max(0, Math.ceil(ms / MS_PER_MINUTE));
  const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR);
  const minutes = totalMinutes % MINUTES_PER_HOUR;
  return hours > 0 ? `${hours} h ${pad(minutes)}` : `${minutes} min`;
}

/**
 * « 2 heures 14 minutes », for screen readers: the same duration as `formatHoursAndMinutes`, in
 * full words.
 */
export function spokenHoursAndMinutes(ms: number): string {
  const totalMinutes = Math.max(0, Math.ceil(ms / MS_PER_MINUTE));
  const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR);
  const minutes = totalMinutes % MINUTES_PER_HOUR;
  const parts = [
    hours > 0 ? `${hours} ${hours > 1 ? 'heures' : 'heure'}` : '',
    minutes > 0 || hours === 0 ? `${minutes} ${minutes > 1 ? 'minutes' : 'minute'}` : '',
  ];
  return parts.filter(Boolean).join(' ');
}

/** Milliseconds left until the minute shown by `formatHoursAndMinutes` changes. */
export function msUntilMinuteChanges(ms: number): number {
  return ms % MS_PER_MINUTE || MS_PER_MINUTE;
}

/** The seed of the daily challenge of a day: AAAAMMJJ. */
export function seedOfDay(day: DayKey): number {
  return Number(day.replaceAll('-', ''));
}

/** The day a daily seed (AAAAMMJJ) stands for. */
export function dayOfSeed(seed: number): DayKey {
  return `${Math.floor(seed / 10000)}-${pad(Math.floor(seed / 100) % 100)}-${pad(seed % 100)}`;
}
