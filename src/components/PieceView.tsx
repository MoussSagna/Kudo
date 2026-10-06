import { Image, View } from 'react-native';

import type { Piece } from '../game/pieces';
import { BLOCK_IMAGES } from '../theme';

interface PieceViewProps {
  piece: Piece;
  cellSize: number;
}

/** A piece drawn with one block image per cell, sized to its bounding box. */
export function PieceView({ piece, cellSize }: PieceViewProps) {
  const columns = Math.max(...piece.cells.map(([col]) => col)) + 1;
  const rows = Math.max(...piece.cells.map(([, row]) => row)) + 1;

  return (
    <View style={{ width: columns * cellSize, height: rows * cellSize }}>
      {piece.cells.map(([col, row]) => (
        <Image
          key={`${col}-${row}`}
          source={BLOCK_IMAGES[piece.color]}
          style={{
            position: 'absolute',
            left: col * cellSize,
            top: row * cellSize,
            width: cellSize,
            height: cellSize,
          }}
        />
      ))}
    </View>
  );
}
