/**
 * MonsterIcon component - displays a monster indicator for revealed monster tiles.
 * @module components/game/MonsterIcon
 */

import { memo } from 'react';

/**
 * Displays a monster icon in white (for blood background contrast).
 */
export const MonsterIcon = memo(function MonsterIcon() {
  return <span className="text-white font-bold text-lg select-none">M</span>;
});
