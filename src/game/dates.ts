const WEEKDAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const MONTHS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

/** « 7 octobre », « 1er mars ». */
export function formatDayAndMonth(date: Date): string {
  const day = date.getDate();
  return `${day === 1 ? '1er' : day} ${MONTHS[date.getMonth()]}`;
}

/** « mercredi 7 octobre ». */
export function formatWeekdayAndDate(date: Date): string {
  return `${WEEKDAYS[date.getDay()]} ${formatDayAndMonth(date)}`;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** The local day a daily seed (YYYYMMDD) stands for. */
export function dateFromDailySeed(seed: number): Date {
  return new Date(Math.floor(seed / 10000), (Math.floor(seed / 100) % 100) - 1, seed % 100);
}
