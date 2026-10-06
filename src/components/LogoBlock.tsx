import { Image, StyleSheet } from 'react-native';

import { BLOCK_IMAGES, CELL_EMPTY_IMAGE, type BlockColor } from '../theme';

export const LOGO_BLOCK_SIZE = 60;

interface LogoBlockProps {
  color: BlockColor | null;
}

export function LogoBlock({ color }: LogoBlockProps) {
  return <Image source={color ? BLOCK_IMAGES[color] : CELL_EMPTY_IMAGE} style={styles.block} />;
}

const styles = StyleSheet.create({
  block: {
    width: LOGO_BLOCK_SIZE,
    height: LOGO_BLOCK_SIZE,
  },
});
