/**
 * MonsterCounter component - displays remaining monsters to flag.
 * @module components/hud/MonsterCounter
 */

import { memo } from 'react';

/**
 * Props for MonsterCounter component.
 */
export interface MonsterCounterProps {
  /** Total number of monsters on the level */
  total: number;
  /** Number of monsters already flagged */
  flagged: number;
}

/**
 * Displays the number of remaining monsters (total - flagged).
 */
export const MonsterCounter = memo(function MonsterCounter({
  total,
  flagged,
}: MonsterCounterProps) {
  const remaining = total - flagged;

  return (
    <div className="flex items-center gap-1">
      <span className="text-lg" aria-hidden="true">
        👹
      </span>
      <span className="font-mono text-dungeon-blood font-bold">{remaining}</span>
    </div>
  );
});
