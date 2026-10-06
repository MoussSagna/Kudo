import type { BlockColor } from '../theme';

/** Une cellule occupée, en [colonne, ligne] depuis le coin haut-gauche de la pièce. */
export type Cell = readonly [number, number];

export interface Piece {
  id: string;
  color: BlockColor;
  cells: readonly Cell[];
}

export const PIECES: readonly Piece[] = [
  { id: 'dot',   color: 'yellow', cells: [[0,0]] },
  { id: 'h2',    color: 'cyan',   cells: [[0,0],[1,0]] },
  { id: 'v2',    color: 'cyan',   cells: [[0,0],[0,1]] },
  { id: 'h3',    color: 'green',  cells: [[0,0],[1,0],[2,0]] },
  { id: 'v3',    color: 'green',  cells: [[0,0],[0,1],[0,2]] },
  { id: 'h4',    color: 'blue',   cells: [[0,0],[1,0],[2,0],[3,0]] },
  { id: 'v4',    color: 'blue',   cells: [[0,0],[0,1],[0,2],[0,3]] },
  { id: 'h5',    color: 'red',    cells: [[0,0],[1,0],[2,0],[3,0],[4,0]] },
  { id: 'v5',    color: 'red',    cells: [[0,0],[0,1],[0,2],[0,3],[0,4]] },
  { id: 'sq2',   color: 'orange', cells: [[0,0],[1,0],[0,1],[1,1]] },
  { id: 'sq3',   color: 'purple', cells: [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]] },
  { id: 'l2_a',  color: 'yellow', cells: [[0,0],[0,1],[1,1]] },
  { id: 'l2_b',  color: 'yellow', cells: [[1,0],[0,1],[1,1]] },
  { id: 'l2_c',  color: 'yellow', cells: [[0,0],[1,0],[0,1]] },
  { id: 'l2_d',  color: 'yellow', cells: [[0,0],[1,0],[1,1]] },
  { id: 'l3_a',  color: 'blue',   cells: [[0,0],[0,1],[0,2],[1,2],[2,2]] },
  { id: 'l3_b',  color: 'blue',   cells: [[2,0],[2,1],[0,2],[1,2],[2,2]] },
  { id: 'l3_c',  color: 'blue',   cells: [[0,0],[1,0],[2,0],[0,1],[0,2]] },
  { id: 'l3_d',  color: 'blue',   cells: [[0,0],[1,0],[2,0],[2,1],[2,2]] },
  { id: 'L_a',   color: 'orange', cells: [[0,0],[0,1],[0,2],[1,2]] },
  { id: 'L_b',   color: 'orange', cells: [[1,0],[1,1],[0,2],[1,2]] },
  { id: 'L_c',   color: 'orange', cells: [[0,0],[1,0],[2,0],[0,1]] },
  { id: 'L_d',   color: 'orange', cells: [[0,0],[1,0],[2,0],[2,1]] },
  { id: 'T_up',  color: 'purple', cells: [[1,0],[0,1],[1,1],[2,1]] },
  { id: 'T_down',color: 'purple', cells: [[0,0],[1,0],[2,0],[1,1]] },
  { id: 'T_left',color: 'purple', cells: [[1,0],[0,1],[1,1],[1,2]] },
  { id: 'T_right',color:'purple', cells: [[0,0],[0,1],[1,1],[0,2]] },
  { id: 'S_h',   color: 'green',  cells: [[1,0],[2,0],[0,1],[1,1]] },
  { id: 'S_v',   color: 'green',  cells: [[0,0],[0,1],[1,1],[1,2]] },
  { id: 'Z_h',   color: 'red',    cells: [[0,0],[1,0],[1,1],[2,1]] },
  { id: 'Z_v',   color: 'red',    cells: [[1,0],[0,1],[1,1],[0,2]] },
];

/** Aléatoire à graine (mulberry32) : même graine => même suite sur tous les téléphones. */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Graine du défi du jour, basée sur la date UTC (AAAAMMJJ). */
export function dailySeed(date: Date = new Date()): number {
  return date.getUTCFullYear() * 10000 + (date.getUTCMonth() + 1) * 100 + date.getUTCDate();
}

export function nextPieces(rng: () => number, count = 3): Piece[] {
  return Array.from({ length: count }, () => PIECES[Math.floor(rng() * PIECES.length)]);
}
