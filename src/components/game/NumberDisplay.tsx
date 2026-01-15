/**
 * NumberDisplay component - renders a colored number (1-8) for adjacent monster count.
 * @module components/game/NumberDisplay
 *
 * Design System: .specify/reference/design-system/04-tiles.css
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
 * Color mapping for adjacent monster counts using CSS custom properties.
 */
const NUMBER_STYLES: Record<number, React.CSSProperties> = {
  1: { color: 'var(--num-1)', textShadow: '0 0 6px var(--num-1)' },
  2: { color: 'var(--num-2)', textShadow: '0 0 6px var(--num-2)' },
  3: { color: 'var(--num-3)', textShadow: '0 0 6px var(--num-3)' },
  4: { color: 'var(--num-4)', textShadow: '0 0 6px var(--num-4)' },
  5: { color: 'var(--num-5)', textShadow: '0 0 6px var(--num-5)' },
  6: { color: 'var(--num-6)', textShadow: '0 0 6px var(--num-6)' },
  7: { color: 'var(--num-7)', textShadow: '0 0 6px var(--num-7)' },
  8: { color: 'var(--num-8)', textShadow: '0 0 6px var(--num-8)' },
};

/**
 * Displays a colored number representing adjacent monster count.
 */
export const NumberDisplay = memo(function NumberDisplay({
  count,
}: NumberDisplayProps) {
  const style = NUMBER_STYLES[count] ?? { color: 'var(--stone-400)' };

  return (
    <span
      className="select-none"
      style={{
        fontSize: '12px',
        fontFamily: "'Press Start 2P', monospace",
        fontWeight: 'bold',
        ...style,
      }}
    >
      {count}
    </span>
  );
});
