import { useCallback, useState } from 'react';
import type Animated from 'react-native-reanimated';
import { useAnimatedRef } from 'react-native-reanimated';

import type { GridPreview } from '../components/Grid';
import { canPlace } from '../game/placement';
import type { GameState } from '../game/state';

/**
 * What a screen needs to let tray pieces be dragged onto its grid: the ref to put on the view
 * wrapping the grid, the handler telling which cell a dragged piece aims at, and the preview to
 * draw on the grid when the piece fits there.
 */
export function usePieceDrag(game: GameState) {
  const gridRef = useAnimatedRef<Animated.View>();
  /** The tray slot being dragged and the cell it aims at, whether the piece fits there or not. */
  const [target, setTarget] = useState<{ index: number; col: number; row: number } | null>(null);

  const onTargetChange = useCallback((index: number, col: number, row: number) => {
    setTarget(col < 0 ? null : { index, col, row });
  }, []);

  const targetPiece = target ? game.tray[target.index] : null;
  const preview: GridPreview | null =
    target && targetPiece && canPlace(game.grid, targetPiece, target.col, target.row)
      ? { piece: targetPiece, col: target.col, row: target.row }
      : null;

  return { gridRef, preview, onTargetChange };
}
