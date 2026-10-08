import { Share } from 'react-native';

import { buildShareText } from './game/share';
import type { GameState } from './game/state';

/** Opens the system share sheet. Cancelling it, or a phone that cannot share, is not an error. */
export function shareGame(game: GameState): void {
  Share.share({ message: buildShareText(game) }).catch(() => undefined);
}
