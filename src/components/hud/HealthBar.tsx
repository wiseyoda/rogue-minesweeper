/**
 * HealthBar component - displays player health as a progress bar.
 * @module components/hud/HealthBar
 */

import { memo } from 'react';

/**
 * Props for HealthBar component.
 */
export interface HealthBarProps {
  /** Current health points */
  current: number;
  /** Maximum health points */
  max: number;
}

/**
 * Displays player health as a horizontal progress bar with numeric display.
 * Uses dungeon-blood color for filled portion, dungeon-shadow for empty.
 */
export const HealthBar = memo(function HealthBar({
  current,
  max,
}: HealthBarProps) {
  const percentage = max > 0 ? Math.round((current / max) * 100) : 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg" aria-hidden="true">
        ❤️
      </span>
      <div
        className="relative w-24 h-4 bg-dungeon-shadow rounded overflow-hidden"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label="Health"
      >
        <div
          className="absolute inset-y-0 left-0 bg-dungeon-blood transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="font-mono text-dungeon-stone font-bold text-sm">
        {current}/{max}
      </span>
    </div>
  );
});
