const THOUSANDS_SEPARATOR = ' ';

/** French grouping: 1240 → « 1 240 », with a non-breaking space. */
export function formatScore(score: number): string {
  return String(score).replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS_SEPARATOR);
}
