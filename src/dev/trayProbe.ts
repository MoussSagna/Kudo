/**
 * Development only: lets the stress test (EXPO_PUBLIC_SAMPLE_GAME=stress) drive the tray pieces
 * through the same code as a real gesture, and read what they actually display.
 */
export const TRAY_PROBE_ENABLED = __DEV__ && process.env.EXPO_PUBLIC_SAMPLE_GAME === 'stress';

/** What a tray piece displays, read on the UI thread. */
export interface PieceReading {
  dragX: number;
  dragY: number;
  lift: number;
  scale: number;
  /** Frame of the piece on screen, or null when it cannot be measured. */
  box: { x: number; y: number; width: number; height: number } | null;
}

export interface TrayProbe {
  pieceId: string;
  /** A whole gesture: picked up, moved over the cell, released (or cancelled by the system). */
  release: (col: number, row: number, success?: boolean) => void;
  /** The start of a gesture: picked up and moved over the cell, not released yet. */
  hold: (col: number, row: number) => void;
  /** The end of a gesture started with `hold`. */
  letGo: (col: number, row: number) => void;
  read: (onRead: (reading: PieceReading) => void) => void;
}

/** The probes of the pieces currently mounted in the tray, by slot. */
export const trayProbes = new Map<number, TrayProbe>();
