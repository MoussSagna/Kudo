import { applyMove } from '../moves';
import { FINISHED_GAME, SAMPLE_GAME } from '../sampleGame';
import { deserializeGame, serializeGame } from '../serialize';
import { createGame, drawTray } from '../state';

function roundTrip(game: Parameters<typeof serializeGame>[0]) {
  return deserializeGame(JSON.parse(JSON.stringify(serializeGame(game))));
}

describe('serializeGame and deserializeGame', () => {
  it('give back the same game after going through JSON', () => {
    expect(roundTrip(SAMPLE_GAME)).toEqual(SAMPLE_GAME);
    expect(roundTrip(FINISHED_GAME)).toEqual(FINISHED_GAME);
    expect(roundTrip(createGame(20261007, 'daily'))).toEqual(createGame(20261007, 'daily'));
  });

  it('write pieces by their id', () => {
    expect(serializeGame(SAMPLE_GAME).tray).toEqual(['L_d', 'sq2', 'v3']);
    expect(serializeGame(FINISHED_GAME).tray).toEqual(['sq3', 'h5', null]);
  });

  it('keep the upcoming draws: a resumed game continues like the original', () => {
    const game = createGame(20261007, 'daily');
    const playing = { ...game, tray: [null, null, game.tray[2]] };
    const resumed = roundTrip(playing);
    const [col, row] = [0, 0];

    expect(resumed).not.toBeNull();
    expect(applyMove(resumed!, 2, col, row)).toEqual(applyMove(playing, 2, col, row));
    expect(applyMove(resumed!, 2, col, row).tray).toEqual(drawTray(20261007, 1));
  });
});

describe('deserializeGame', () => {
  const saved = serializeGame(SAMPLE_GAME);

  it('refuses what is not an object', () => {
    expect(deserializeGame(null)).toBeNull();
    expect(deserializeGame(undefined)).toBeNull();
    expect(deserializeGame('game')).toBeNull();
    expect(deserializeGame(42)).toBeNull();
    expect(deserializeGame([])).toBeNull();
  });

  it('refuses a game with a missing field', () => {
    for (const field of Object.keys(saved)) {
      const incomplete: Record<string, unknown> = { ...saved };
      delete incomplete[field];

      expect(deserializeGame(incomplete)).toBeNull();
    }
  });

  it('refuses an unknown mode, piece or color', () => {
    expect(deserializeGame({ ...saved, mode: 'ranked' })).toBeNull();
    expect(deserializeGame({ ...saved, tray: ['L_d', 'nope', null] })).toBeNull();
    expect(
      deserializeGame({ ...saved, grid: [['pink', ...saved.grid[0].slice(1)], ...saved.grid.slice(1)] }),
    ).toBeNull();
  });

  it('refuses a grid or a tray of the wrong size', () => {
    expect(deserializeGame({ ...saved, grid: saved.grid.slice(1) })).toBeNull();
    expect(deserializeGame({ ...saved, grid: saved.grid.map((row) => row.slice(1)) })).toBeNull();
    expect(deserializeGame({ ...saved, tray: ['L_d', 'sq2'] })).toBeNull();
  });

  it('refuses numbers that make no sense', () => {
    expect(deserializeGame({ ...saved, score: -1 })).toBeNull();
    expect(deserializeGame({ ...saved, score: '1240' })).toBeNull();
    expect(deserializeGame({ ...saved, score: 12.5 })).toBeNull();
    expect(deserializeGame({ ...saved, streak: 0 })).toBeNull();
    expect(deserializeGame({ ...saved, draws: 0 })).toBeNull();
    expect(deserializeGame({ ...saved, isOver: 'no' })).toBeNull();
    expect(deserializeGame({ ...saved, stats: { ...saved.stats, bestStreak: 0 } })).toBeNull();
    expect(deserializeGame({ ...saved, stats: null })).toBeNull();
  });
});
