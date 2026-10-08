/**
 * Every duration (milliseconds), distance (points) and scale of the game screen animations.
 */
export const MOTION = {
  /** A picked-up piece grows to grid size and rises above the finger. */
  pickUpMs: 120,
  /** A refused piece springs back to the tray. */
  returnSpring: { duration: 220, dampingRatio: 0.8 },

  /** A placed piece slides from where it was released to its cells… */
  landMs: 90,
  /** …then its blocks bounce. */
  landBounceMs: 140,
  landBounceScale: 1.1,

  /** Cleared cells light up, then shrink away, one after the other along the line. */
  clearFlashMs: 90,
  clearShrinkMs: 150,
  clearStaggerMs: 8,
  clearFlashOpacity: 0.7,

  /** The score pulses when it changes. */
  scorePulseMs: 220,
  scorePulseScale: 1.12,

  /** The gain of a clear rises from the placed piece and fades. */
  gainMs: 800,
  gainRise: 36,

  /** The pieces of a new tray grow into place, one after the other. */
  trayAppearMs: 220,
  trayAppearStaggerMs: 70,

  /** At the end of a game, the grid stays visible, then the result screen fades in. */
  resultDelayMs: 600,
  resultFadeMs: 250,

  /** Going from one screen to another: the screen fades out, then the next one fades in. */
  screenFadeMs: 160,

  /** Settings: the thumb of a switch slides to its other side. */
  switchMs: 150,

  /** Tutorial: the suggested cells blink, and the arrow above the piece bobs up and down. */
  tutorialBlinkMs: 700,
  tutorialArrowMs: 650,
  tutorialArrowRise: 6,
  /** Tutorial: the success message and its button fade in. */
  tutorialSuccessFadeMs: 220,

  /** Development demo (EXPO_PUBLIC_SAMPLE_GAME=demo): delay before the first move, then between moves. */
  demoStartMs: 1500,
  demoStepMs: 1800,
} as const;
