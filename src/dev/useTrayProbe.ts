import { useEffect } from 'react';
import type Animated from 'react-native-reanimated';
import { measure, type AnimatedRef, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN, scheduleOnUI } from 'react-native-worklets';

import { TRAY_PROBE_ENABLED, trayProbes, type PieceReading, type TrayProbe } from './trayProbe';

interface TrayProbeTarget {
  index: number;
  pieceId: string;
  gridCellSize: number;
  pieceRef: AnimatedRef<Animated.View>;
  values: Record<
    'dragX' | 'dragY' | 'lift' | 'scale' | 'startLeft' | 'startTop',
    SharedValue<number>
  >;
  /** The worklets the real gesture runs. */
  beginDrag: () => void;
  moveDrag: (translationX: number, translationY: number) => void;
  endDrag: (translationX: number, translationY: number, success: boolean) => void;
  finalizeDrag: () => void;
}

/**
 * Development only: registers a tray piece for the stress test, which then plays gestures on it
 * through the worklets of the real gesture. Does nothing outside the stress test.
 */
export function useTrayProbe(target: TrayProbeTarget) {
  const { index, pieceId, gridCellSize, pieceRef, values } = target;
  const { beginDrag, moveDrag, endDrag, finalizeDrag } = target;

  useEffect(() => {
    if (!TRAY_PROBE_ENABLED) {
      return;
    }
    /** Runs a gesture from its start to the cell (col, row), and to its end unless it is held. */
    const gesture = (col: number, row: number, starts: boolean, ends: boolean, success: boolean) => {
      'worklet';
      if (starts) {
        beginDrag();
      }
      const translationX = col * gridCellSize - values.startLeft.value;
      const translationY = row * gridCellSize - values.startTop.value;
      moveDrag(translationX, translationY);
      if (ends) {
        endDrag(translationX, translationY, success);
        finalizeDrag();
      }
    };
    const readOnUI = (onRead: (reading: PieceReading) => void) => {
      'worklet';
      const box = measure(pieceRef);
      scheduleOnRN(onRead, {
        dragX: values.dragX.value,
        dragY: values.dragY.value,
        lift: values.lift.value,
        scale: values.scale.value,
        box: box ? { x: box.pageX, y: box.pageY, width: box.width, height: box.height } : null,
      });
    };

    const probe: TrayProbe = {
      pieceId,
      release: (col, row, success = true) => scheduleOnUI(gesture, col, row, true, true, success),
      hold: (col, row) => scheduleOnUI(gesture, col, row, true, false, true),
      letGo: (col, row) => scheduleOnUI(gesture, col, row, false, true, true),
      read: (onRead) => scheduleOnUI(readOnUI, onRead),
    };
    trayProbes.set(index, probe);
    return () => {
      if (trayProbes.get(index) === probe) {
        trayProbes.delete(index);
      }
    };
  });
}
