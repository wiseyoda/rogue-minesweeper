/**
 * ShieldDisplay component - displays current shield count.
 * @module components/hud/ShieldDisplay
 */

import { memo } from 'react';

/**
 * Props for ShieldDisplay component.
 */
export interface ShieldDisplayProps {
  /** Current shield count */
  count: number;
}

/**
 * Displays the player's current shields.
 * Hidden when shields = 0.
 */
export const ShieldDisplay = memo(function ShieldDisplay({
  count,
}: ShieldDisplayProps) {
  // Hide when no shields
  if (count === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-lg" aria-hidden="true">
        🛡
      </span>
      <span className="font-mono text-dungeon-stone font-bold">{count}</span>
    </div>
  );
});
