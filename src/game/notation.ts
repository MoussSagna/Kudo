import type { BlockColor } from '../theme';
import { PIECES, type Piece } from './pieces';
import type { Grid, GridCell } from './state';

const COLOR_BY_LETTER: Readonly<Record<string, BlockColor>> = {
  r: 'red',
  o: 'orange',
  y: 'yellow',
  g: 'green',
  c: 'cyan',
  b: 'blue',
  p: 'purple',
};

/**
 * Builds a grid from one string per row, one character per cell: r red, o orange, y yellow,
 * g green, c cyan, b blue, p purple, anything else empty.
 */
export function gridFrom(rows: readonly string[]): Grid {
  return rows.map((row) => [...row].map((letter): GridCell => COLOR_BY_LETTER[letter] ?? null));
}

export function pieceById(id: string): Piece {
  const piece = PIECES.find((candidate) => candidate.id === id);
  if (!piece) {
    throw new Error(`Unknown piece: ${id}`);
  }
  return piece;
}
