import { dayOfSeed, type DayKey } from './days';
import type { GameState } from './state';

/** A daily challenge with the day it belongs to. */
export interface DailyEntry {
  day: DayKey;
  game: GameState;
}

/** What is kept about the daily challenge. */
export interface DailyData {
  /** The challenge being played, if it was left before its end. */
  inProgress: DailyEntry | null;
}

export const EMPTY_DAILY_DATA: DailyData = { inProgress: null };

/** Where today's challenge stands. */
export type DailyStatus = { kind: 'new' } | { kind: 'inProgress'; game: GameState };

/** A challenge started on another day is abandoned: it does not count. */
export function dailyStatus(data: DailyData, today: DayKey): DailyStatus {
  if (data.inProgress?.day === today && !data.inProgress.game.isOver) {
    return { kind: 'inProgress', game: data.inProgress.game };
  }
  return { kind: 'new' };
}

/** The data after a move of a daily challenge; the challenge belongs to the day of its seed. */
export function recordDailyMove(data: DailyData, game: GameState): DailyData {
  return { ...data, inProgress: game.isOver ? null : { day: dayOfSeed(game.seed), game } };
}
