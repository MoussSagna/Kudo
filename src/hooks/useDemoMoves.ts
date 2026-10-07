import { useEffect, useRef, useState } from 'react';

import type { DemoMove } from '../game/sampleGame';
import { MOTION } from '../motion';

/** Development only: plays a scripted list of moves, one after the other, without any gesture. */
export function useDemoMoves(moves: readonly DemoMove[] | null, play: (move: DemoMove) => void) {
  const [step, setStep] = useState(0);
  const playRef = useRef(play);

  useEffect(() => {
    playRef.current = play;
  });

  useEffect(() => {
    if (!moves || step >= moves.length) {
      return;
    }
    const timer = setTimeout(
      () => {
        playRef.current(moves[step]);
        setStep(step + 1);
      },
      step === 0 ? MOTION.demoStartMs : MOTION.demoStepMs,
    );
    return () => clearTimeout(timer);
  }, [moves, step]);
}
