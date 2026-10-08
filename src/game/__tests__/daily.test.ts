import { dailyStatus, EMPTY_DAILY_DATA, recordDailyMove } from '../daily';
import { applyMove } from '../moves';
import { pieceById } from '../notation';
import { createGame } from '../state';

const TODAY = '2026-10-07';
const todaysGame = createGame(20261007, 'daily');
const playing = applyMove({ ...todaysGame, tray: [pieceById('dot'), null, null] }, 0, 0, 0);
const over = { ...playing, score: 640, isOver: true };

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

  it('turns the challenge into the result of its day once the game is over', () => {
    const data = recordDailyMove(EMPTY_DAILY_DATA, playing);
    const finished = recordDailyMove(data, over);

    expect(finished.inProgress).toBeNull();
    expect(finished.result).toEqual({ day: '2026-10-07', game: over });
  });

  it('keeps the previous result while the next challenge is being played', () => {
    const yesterday = recordDailyMove(EMPTY_DAILY_DATA, over);
    const tomorrowsGame = createGame(20261008, 'daily');

    expect(recordDailyMove(yesterday, tomorrowsGame).result).toEqual(yesterday.result);
  });
});

describe('dailyStatus — one attempt a day', () => {
  const finished = recordDailyMove(EMPTY_DAILY_DATA, over);

  it('is done, with the final game, as long as the day has not changed', () => {
    expect(dailyStatus(finished, TODAY)).toEqual({ kind: 'done', game: over });
  });

  it('gives its score, grid and statistics back', () => {
    const status = dailyStatus(finished, TODAY);

    expect(status.kind === 'done' && status.game.score).toBe(over.score);
    expect(status.kind === 'done' && status.game.grid).toEqual(over.grid);
    expect(status.kind === 'done' && status.game.stats).toEqual(over.stats);
  });

  it('is a new challenge again the next day', () => {
    expect(dailyStatus(finished, '2026-10-08')).toEqual({ kind: 'new' });
  });

  it('stays done even if a game of the same day is recorded as in progress', () => {
    const data = { ...finished, inProgress: { day: TODAY, game: playing } };

    expect(dailyStatus(data, TODAY).kind).toBe('done');
  });

  it('counts a challenge finished after midnight for the day it was started', () => {
    expect(finished.result?.day).toBe('2026-10-07');
    expect(dailyStatus(finished, '2026-10-08')).toEqual({ kind: 'new' });
  });
});

describe('recordDailyMove — streak', () => {
  const first = { ...createGame(20261007, 'daily'), isOver: true };
  const second = { ...createGame(20261008, 'daily'), isOver: true };
  const afterGap = { ...createGame(20261010, 'daily'), isOver: true };

  it('does not count a challenge before it is finished', () => {
    expect(recordDailyMove(EMPTY_DAILY_DATA, playing).streak).toEqual(EMPTY_DAILY_DATA.streak);
  });

  it('counts each finished day, and consecutive days make a streak', () => {
    const one = recordDailyMove(EMPTY_DAILY_DATA, first);
    const two = recordDailyMove(one, second);

    expect(one.streak.count).toBe(1);
    expect(two.streak.count).toBe(2);
    expect(two.streak.days).toEqual(['2026-10-07', '2026-10-08']);
  });

  it('starts the streak again after a missed day, keeping the record', () => {
    const two = recordDailyMove(recordDailyMove(EMPTY_DAILY_DATA, first), second);
    const again = recordDailyMove(two, afterGap);

    expect(again.streak.count).toBe(1);
    expect(again.streak.best).toBe(2);
  });

  it('counts a challenge finished after midnight for the day it was started', () => {
    expect(recordDailyMove(EMPTY_DAILY_DATA, first).streak.lastDay).toBe('2026-10-07');
  });
});
