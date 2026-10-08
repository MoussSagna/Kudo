import { DEV_FLAGS } from './dev/devFlags';
import { dateFromDayKey } from './game/days';

/**
 * Development only: EXPO_PUBLIC_FAKE_DATE=2026-10-08 makes the app believe it is that day, at the
 * real time of day, to test the daily challenge and the streak without waiting.
 */
const FAKE_DAY = dateFromDayKey(DEV_FLAGS.fakeDate ?? '');

/** The current date. The game logic never reads the clock itself: it receives this date. */
export function now(): Date {
  const real = new Date();
  if (!FAKE_DAY) {
    return real;
  }
  return new Date(
    FAKE_DAY.getFullYear(),
    FAKE_DAY.getMonth(),
    FAKE_DAY.getDate(),
    real.getHours(),
    real.getMinutes(),
    real.getSeconds(),
    real.getMilliseconds(),
  );
}
