import { NO_DEV_FLAGS, readDevFlags, type DevEnv } from '../devFlags';

const EVERYTHING_ASKED: DevEnv = {
  fakeDate: '2026-10-08',
  resetData: '1',
  tutorial: '2a',
  sampleGame: 'stress',
  sampleDaily: 'tomorrow',
  settings: '1',
};

describe('readDevFlags', () => {
  it('ignores every development variable in production', () => {
    expect(readDevFlags(false, EVERYTHING_ASKED)).toEqual(NO_DEV_FLAGS);
  });

  it('asks for nothing when no tool is enabled', () => {
    expect(NO_DEV_FLAGS).toEqual({
      fakeDate: undefined,
      resetData: false,
      tutorial: undefined,
      sampleGame: undefined,
      sampleDaily: undefined,
      opensOnSettings: false,
    });
  });

  it('reads the variables in development', () => {
    expect(readDevFlags(true, EVERYTHING_ASKED)).toEqual({
      fakeDate: '2026-10-08',
      resetData: true,
      tutorial: '2a',
      sampleGame: 'stress',
      sampleDaily: 'tomorrow',
      opensOnSettings: true,
    });
  });

  it('asks for nothing in development when no variable is set', () => {
    expect(readDevFlags(true, {})).toEqual(NO_DEV_FLAGS);
  });
});
