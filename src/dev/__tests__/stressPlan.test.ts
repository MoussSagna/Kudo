import { canPlace } from '../../game/placement';
import { createGame } from '../../game/state';
import { buildStressPlan, STRESS_CYCLES, STRESS_PATTERNS, STRESS_SEED } from '../stressPlan';

describe('buildStressPlan', () => {
  const plan = buildStressPlan();
  const moves = plan.flatMap((cycle) => cycle.moves);

  it('lasts at least 60 moves and 10 new draws', () => {
    expect(plan).toHaveLength(STRESS_CYCLES);
    expect(moves.length).toBeGreaterThanOrEqual(60);
    expect(plan.length).toBeGreaterThanOrEqual(10);
  });

  it('is a valid game: every move follows from the previous one', () => {
    let state = createGame(STRESS_SEED, 'free');
    for (const move of moves) {
      const piece = state.tray[move.trayIndex];

      expect(piece).not.toBeNull();
      expect(canPlace(state.grid, piece!, move.col, move.row)).toBe(true);
      state = move.result.next;
    }
    expect(state.draws).toBe(STRESS_CYCLES + 1);
    expect(state.isOver).toBe(false);
  });

  it('uses every release pattern several times', () => {
    for (const pattern of STRESS_PATTERNS) {
      expect(plan.filter((cycle) => cycle.pattern === pattern).length).toBeGreaterThanOrEqual(4);
    }
  });

  it('clears lines right before a new draw at least five times', () => {
    const clearing = plan.filter(({ moves: [, , last] }) => {
      return last.result.clearedRows.length + last.result.clearedCols.length > 0;
    });

    expect(clearing.length).toBeGreaterThanOrEqual(5);
  });

  it('has a cell to be refused on for every refused release', () => {
    for (const cycle of plan.filter(({ pattern }) => pattern === 'refused')) {
      expect(cycle.moves[0].refused).not.toBeNull();
    }
  });
});
