/**
 * LevelIndicator component - displays current floor/level.
 * @module components/hud/LevelIndicator
 */

import { memo } from 'react';

/**
 * Props for LevelIndicator component.
 */
export interface LevelIndicatorProps {
  /** Current level/floor number */
  level: number;
}

/**
 * Displays the current dungeon level/floor.
 */
export const LevelIndicator = memo(function LevelIndicator({
  level,
}: LevelIndicatorProps) {
  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-dungeon-amber font-bold">L {level}</span>
    </div>
  );
});
