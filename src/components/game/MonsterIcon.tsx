/**
 * MonsterIcon component - displays a monster indicator for revealed monster tiles.
 * @module components/game/MonsterIcon
 *
 * Design System: .specify/reference/design-system/11-icons.md
 */

import { memo } from 'react';
import { Skull } from '../icons/Skull';

/**
 * Displays a skull SVG icon.
 */
export const MonsterIcon = memo(function MonsterIcon() {
  return <Skull size={14} />;
});
