import { View } from 'react-native';

interface ChevronProps {
  direction: 'left' | 'right';
  color: string;
  size?: number;
  stroke?: number;
}

/** A « < » or « > » drawn with two borders of a rotated square. */
export function Chevron({ direction, color, size = 10, stroke = 2.5 }: ChevronProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderColor: color,
        borderTopWidth: stroke,
        borderLeftWidth: direction === 'left' ? stroke : 0,
        borderRightWidth: direction === 'right' ? stroke : 0,
        borderTopLeftRadius: direction === 'left' ? 2 : 0,
        borderTopRightRadius: direction === 'right' ? 2 : 0,
        // The corner of the square points left or right; shift it back to look centered.
        marginLeft: direction === 'left' ? size / 3 : 0,
        marginRight: direction === 'right' ? size / 3 : 0,
        transform: [{ rotate: direction === 'left' ? '-45deg' : '45deg' }],
      }}
    />
  );
}
