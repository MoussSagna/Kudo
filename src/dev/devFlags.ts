/** The development variables, as they are written when the app is started. */
export interface DevEnv {
  fakeDate?: string;
  resetData?: string;
  tutorial?: string;
  sampleGame?: string;
  sampleDaily?: string;
  settings?: string;
}

/** What the development tools are asked to do. */
export interface DevFlags {
  /** EXPO_PUBLIC_FAKE_DATE: the day the app must believe it is, AAAA-MM-JJ. */
  fakeDate: string | undefined;
  /** EXPO_PUBLIC_RESET_DATA=1: erase everything saved when the app starts. */
  resetData: boolean;
  /** EXPO_PUBLIC_TUTORIAL: force, skip or open the tutorial in a given state. */
  tutorial: string | undefined;
  /** EXPO_PUBLIC_SAMPLE_GAME: the sample game to open, `stress` included. */
  sampleGame: string | undefined;
  /** EXPO_PUBLIC_SAMPLE_DAILY: the sample state of the daily challenge. */
  sampleDaily: string | undefined;
  /** EXPO_PUBLIC_SETTINGS=1: open the app on the settings screen. */
  opensOnSettings: boolean;
}

/** No development tool at all: what a release build always gets. */
export const NO_DEV_FLAGS: DevFlags = {
  fakeDate: undefined,
  resetData: false,
  tutorial: undefined,
  sampleGame: undefined,
  sampleDaily: undefined,
  opensOnSettings: false,
};

/** The development tools asked for. Outside development, every variable is ignored. */
export function readDevFlags(isDev: boolean, env: DevEnv): DevFlags {
  if (!isDev) {
    return NO_DEV_FLAGS;
  }
  return {
    fakeDate: env.fakeDate,
    resetData: env.resetData === '1',
    tutorial: env.tutorial,
    sampleGame: env.sampleGame,
    sampleDaily: env.sampleDaily,
    opensOnSettings: env.settings === '1',
  };
}

/**
 * The only place of the app that reads development variables. Each one is written in full:
 * Expo replaces `process.env.EXPO_PUBLIC_…` with its value when it builds the app.
 */
export const DEV_FLAGS: DevFlags = readDevFlags(__DEV__, {
  fakeDate: process.env.EXPO_PUBLIC_FAKE_DATE,
  resetData: process.env.EXPO_PUBLIC_RESET_DATA,
  tutorial: process.env.EXPO_PUBLIC_TUTORIAL,
  sampleGame: process.env.EXPO_PUBLIC_SAMPLE_GAME,
  sampleDaily: process.env.EXPO_PUBLIC_SAMPLE_DAILY,
  settings: process.env.EXPO_PUBLIC_SETTINGS,
});
