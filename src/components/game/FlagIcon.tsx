/**
 * FlagIcon component - displays a flag marker for flagged tiles.
 * @module components/game/FlagIcon
 */

import { memo } from 'react';

/**
 * Displays a flag icon in dungeon-gold color.
 */
export const FlagIcon = memo(function FlagIcon() {
  return (
    <span className="text-dungeon-gold font-bold text-lg select-none">F</span>
  );
});
