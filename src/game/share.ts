import { SHARE_EMOJI } from '../theme';
import { dateFromDailySeed, formatDayAndMonth } from './dates';
import { formatScore } from './formatScore';
import type { GameState } from './state';

function count(value: number, singular: string, plural: string): string {
  return `${formatScore(value)} ${value > 1 ? plural : singular}`;
}

/**
 * The text shared at the end of a game: the mode and the score, the final grid as 8 lines of
 * emojis, then the statistics.
 */
export function buildShareText(game: GameState): string {
  const { piecesPlaced, linesCleared, bestStreak } = game.stats;
  const mode =
    game.mode === 'daily'
      ? `défi du ${formatDayAndMonth(dateFromDailySeed(game.seed))}`
      : 'partie libre';
  return [
    `Kubo — ${mode} — ${count(game.score, 'point', 'points')}`,
    ...game.grid.map((row) => row.map((cell) => SHARE_EMOJI[cell ?? 'empty']).join('')),
    [
      count(piecesPlaced, 'pièce posée', 'pièces posées'),
      count(linesCleared, 'ligne effacée', 'lignes effacées'),
      `meilleure série ×${bestStreak}`,
    ].join(' · '),
  ].join('\n');
}
