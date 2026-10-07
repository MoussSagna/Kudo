import { moveFeedback } from '../game/feedback';
import type { MoveResult } from '../game/moves';
import { playHaptic } from '../haptics';
import { useSounds } from './useSounds';

/** The sounds and vibrations answering the player's actions, shared by every screen with a grid. */
export function useFeedback() {
  const playSound = useSounds();

  return {
    playSound,
    /** A piece was picked up from the tray. */
    pickUp: () => {
      playSound('pick');
      playHaptic('pick');
    },
    /** A piece went back to the tray instead of being placed. */
    refuse: () => {
      playSound('invalid');
      playHaptic('invalid');
    },
    /** A piece was placed, with or without clearing lines. */
    move: (move: MoveResult) => {
      const feedback = moveFeedback(move);
      playSound(feedback);
      playHaptic(feedback === 'place' ? 'place' : 'clear');
    },
  };
}
