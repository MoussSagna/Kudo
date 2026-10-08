import { useWindowDimensions } from 'react-native';

import { boardCellSize } from '../components/boardCellSize';
import { GRID_PADDING } from '../components/Grid';

/** Space between the grid panel, or the tray, and the sides of the screen. */
export const GRID_MARGIN = 13;
export const TRAY_MARGIN = 19;

/**
 * Sizes of the grid and of the tray, computed from the screen. `chromeHeight` is the height of
 * everything else on the screen, safe areas included; `trayHeightRatio` is the height of the tray
 * compared to a grid cell.
 */
export function useBoardLayout(chromeHeight: number, trayHeightRatio: number) {
  const { width, height } = useWindowDimensions();
  const cellSize = boardCellSize(
    width - 2 * (GRID_MARGIN + GRID_PADDING),
    height - chromeHeight - 2 * GRID_PADDING,
    trayHeightRatio,
  );

  return {
    /** Size of a grid cell: the grid stays square. */
    cellSize,
    trayWidth: width - 2 * TRAY_MARGIN,
    trayHeight: Math.round(cellSize * trayHeightRatio),
  };
}
