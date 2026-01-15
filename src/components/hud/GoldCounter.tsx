/**
 * GoldCounter component - displays current gold amount.
 * @module components/hud/GoldCounter
 */

import { memo } from 'react';

/**
 * Props for GoldCounter component.
 */
export interface GoldCounterProps {
  /** Current gold amount */
  amount: number;
}

/**
 * Displays the player's current gold with an icon.
 */
export const GoldCounter = memo(function GoldCounter({
  amount,
}: GoldCounterProps) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-lg" aria-hidden="true">
        💰
      </span>
      <span className="font-mono text-dungeon-gold font-bold">{amount}</span>
    </div>
  );
});
