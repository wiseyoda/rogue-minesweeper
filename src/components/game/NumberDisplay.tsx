/**
 * NumberDisplay component - renders a colored number (1-8) for adjacent monster count.
 * @module components/game/NumberDisplay
 */

import { memo } from 'react';

/**
 * Props for NumberDisplay component.
 */
export interface NumberDisplayProps {
  /** Number to display (1-8) */
  count: number;
}

/**
 * Color mapping for adjacent monster counts.
 * Classic Minesweeper colors.
 */
const NUMBER_COLORS: Record<number, string> = {
  1: 'text-blue-600',
  2: 'text-green-600',
  3: 'text-red-600',
  4: 'text-purple-600',
  5: 'text-amber-600',
  6: 'text-cyan-600',
  7: 'text-gray-800',
  8: 'text-gray-600',
};

/**
 * Displays a colored number representing adjacent monster count.
 */
export const NumberDisplay = memo(function NumberDisplay({
  count,
}: NumberDisplayProps) {
  const colorClass = NUMBER_COLORS[count] ?? 'text-gray-500';

  return (
    <span className={`font-bold text-lg select-none ${colorClass}`}>
      {count}
    </span>
  );
});
