import { useWindowDimensions } from 'react-native';

/** Under this height (iPhone SE and the like), screens tighten their spacing and their titles. */
const COMPACT_HEIGHT = 700;

/** True on short screens, where the layout of the mockups does not fit as it is. */
export function useIsCompactScreen(): boolean {
  return useWindowDimensions().height < COMPACT_HEIGHT;
}
