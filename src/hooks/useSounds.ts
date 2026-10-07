import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { useCallback, useEffect, useRef } from 'react';

import { getPreferences } from '../storage/preferences';
import { SOUNDS } from '../theme';

export type SoundName = 'pick' | 'place' | 'invalid' | 'clear' | 'combo' | 'gameover';

const SOUND_NAMES: readonly SoundName[] = ['pick', 'place', 'invalid', 'clear', 'combo', 'gameover'];

/**
 * Loads the game sounds when the screen mounts and returns a function to play them. Sounds stay
 * silent when the phone is in silent mode, play over the user's own music without stopping it,
 * and never throw: a sound that fails to load or play is simply skipped.
 */
export function useSounds() {
  const players = useRef<Partial<Record<SoundName, AudioPlayer>>>({});

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers' }).catch(
      () => undefined,
    );

    const loaded: Partial<Record<SoundName, AudioPlayer>> = {};
    for (const name of SOUND_NAMES) {
      try {
        loaded[name] = createAudioPlayer(SOUNDS[name]);
      } catch {
        // The game goes on without this sound.
      }
    }
    players.current = loaded;

    return () => {
      players.current = {};
      for (const player of Object.values(loaded)) {
        try {
          player.remove();
        } catch {
          // Already released.
        }
      }
    };
  }, []);

  return useCallback((name: SoundName) => {
    const player = players.current[name];
    if (!player || !getPreferences().sounds) {
      return;
    }
    try {
      player.seekTo(0).catch(() => undefined);
      player.play();
    } catch {
      // A sound that cannot be played must never stop the game.
    }
  }, []);
}
