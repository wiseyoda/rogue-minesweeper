/**
 * FlagIcon component - displays a flag marker for flagged tiles.
 * @module components/game/FlagIcon
 *
 * Design System: .specify/reference/design-system/11-icons.md
 */

import { memo } from 'react';
import { Flag } from '../icons/Flag';

/**
 * Displays a gold SVG flag icon.
 */
export const FlagIcon = memo(function FlagIcon() {
  return <Flag size={14} />;
});
