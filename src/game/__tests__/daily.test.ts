import { dailyStatus, EMPTY_DAILY_DATA, recordDailyMove } from '../daily';
import { applyMove } from '../moves';
import { pieceById } from '../notation';
import { createGame } from '../state';

const TODAY = '2026-10-07';
const todaysGame = createGame(20261007, 'daily');
const playing = applyMove({ ...todaysGame, tray: [pieceById('dot'), null, null] }, 0, 0, 0);

describe('dailyStatus', () => {
  it('is a new challenge when nothing is saved', () => {
    expect(dailyStatus(EMPTY_DAILY_DATA, TODAY)).toEqual({ kind: 'new' });
  });

  it('is in progress when a challenge of today was left before its end', () => {
    const data = recordDailyMove(EMPTY_DAILY_DATA, playing);

    expect(dailyStatus(data, TODAY)).toEqual({ kind: 'inProgress', game: playing });
  });

  it('abandons a challenge left on a previous day', () => {
    const data = recordDailyMove(EMPTY_DAILY_DATA, playing);

    expect(dailyStatus(data, '2026-10-08')).toEqual({ kind: 'new' });
    expect(dailyStatus(data, '2026-11-07')).toEqual({ kind: 'new' });
  });
});

describe('recordDailyMove', () => {
  it('keeps the game with the day of its seed, whatever the day it is played', () => {
    expect(recordDailyMove(EMPTY_DAILY_DATA, playing).inProgress).toEqual({
      day: '2026-10-07',
      game: playing,
    });
  });

  it('replaces the previous state of the challenge', () => {
    const first = recordDailyMove(EMPTY_DAILY_DATA, todaysGame);
    const second = recordDailyMove(first, playing);

    expect(second.inProgress?.game).toBe(playing);
  });

  it('keeps nothing in progress once the game is over', () => {
    const data = recordDailyMove(EMPTY_DAILY_DATA, playing);

    expect(recordDailyMove(data, { ...playing, isOver: true }).inProgress).toBeNull();
  });
});
