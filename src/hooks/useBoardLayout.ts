import { useWindowDimensions } from 'react-native';

import { GRID_PADDING } from '../components/Grid';
import { GRID_SIZE } from '../theme';

/** Space between the grid panel, or the tray, and the sides of the screen. */
export const GRID_MARGIN = 13;
export const TRAY_MARGIN = 19;

/** Sizes of the grid and of the tray, computed from the width of the screen. */
export function useBoardLayout() {
  const { width } = useWindowDimensions();

  return {
    /** Size of a grid cell: the grid stays square and fills the width. */
    cellSize: Math.floor((width - 2 * (GRID_MARGIN + GRID_PADDING)) / GRID_SIZE),
    trayWidth: width - 2 * TRAY_MARGIN,
  };
}
