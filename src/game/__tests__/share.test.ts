import { FINISHED_FREE_GAME, FINISHED_GAME } from '../sampleGame';
import { buildShareText } from '../share';
import { createGame } from '../state';

describe('buildShareText', () => {
  it('builds the score, the grid in emojis and the statistics', () => {
    expect(buildShareText(FINISHED_GAME)).toBe(
      [
        'Kubo — défi du 6 octobre — 1 780 points',
        '🟪🟪⬛🟩⬛🟥🟥⬛',
        '🟪⬛🟦🟩⬛🟥⬛🟨',
        '⬛🟦🟦⬛🟧🟧⬛🟨',
        '🟩🟦⬛🟨🟧⬛🟪🟪',
        '🟩⬛🟥🟨⬛🟦🟦⬛',
        '⬛🟧🟥⬛🟩🟩⬛🟦',
        '🟨🟧⬛🟪🟪⬛🟦🟦',
        '🟨⬛🟦🟦⬛🟥⬛🟩',
        '38 pièces posées · 21 lignes effacées · meilleure série ×4',
      ].join('\n'),
    );
  });

  it('has a title, 8 grid lines of 8 emojis and a statistics line', () => {
    const lines = buildShareText(FINISHED_GAME).split('\n');

    expect(lines).toHaveLength(10);
    for (const line of lines.slice(1, 9)) {
      expect([...line]).toHaveLength(8);
    }
  });

  it('uses the singular for a single point, piece or line', () => {
    const game = {
      ...createGame(1),
      score: 1,
      stats: { piecesPlaced: 1, linesCleared: 1, bestStreak: 1 },
    };
    const lines = buildShareText(game).split('\n');

    expect(lines[0]).toBe('Kubo — partie libre — 1 point');
    expect(lines[1]).toBe('⬛⬛⬛⬛⬛⬛⬛⬛');
    expect(lines[9]).toBe('1 pièce posée · 1 ligne effacée · meilleure série ×1');
  });

  it('uses the singular for zero', () => {
    const lines = buildShareText(createGame(1)).split('\n');

    expect(lines[0]).toBe('Kubo — partie libre — 0 point');
    expect(lines[9]).toBe('0 pièce posée · 0 ligne effacée · meilleure série ×1');
  });

  it('tells the mode: the day of the daily challenge, or the free game', () => {
    expect(buildShareText(FINISHED_GAME).split('\n')[0]).toBe(
      'Kubo — défi du 6 octobre — 1 780 points',
    );
    expect(buildShareText(FINISHED_FREE_GAME).split('\n')[0]).toBe(
      'Kubo — partie libre — 1 780 points',
    );
    expect(buildShareText({ ...createGame(20270301, 'daily'), score: 12 }).split('\n')[0]).toBe(
      'Kubo — défi du 1er mars — 12 points',
    );
  });

  it('shares the same grid and statistics in both modes', () => {
    expect(buildShareText(FINISHED_FREE_GAME).split('\n').slice(1)).toEqual(
      buildShareText(FINISHED_GAME).split('\n').slice(1),
    );
  });
});
