/**
 * BuffBar component - displays active buff icons.
 * @module components/hud/BuffBar
 */

import { memo } from 'react';
import type { ActiveBuffs } from '../../types/player';

/**
 * Icon mapping for each buff type.
 */
const BUFF_ICONS: Record<keyof ActiveBuffs, string> = {
  extraLife: '💖',
  goldenGoose: '🪿',
  goldMagnet: '🧲',
  steadyHand: '🎯',
  forcefield: '🔮',
  scrapMetal: '⚙️',
  shieldBattery: '🔋',
};

/**
 * Tooltip descriptions for each buff.
 */
const BUFF_TOOLTIPS: Record<keyof ActiveBuffs, string> = {
  extraLife: 'Extra Life: Next death restores full lives',
  goldenGoose: 'Golden Goose: Earn gold over time',
  goldMagnet: 'Gold Magnet: Double gold from tiles',
  steadyHand: 'Steady Hand: Next monster hit negated',
  forcefield: 'Forcefield: Immune to monster damage',
  scrapMetal: 'Scrap Metal: Gain gold for revealing tiles',
  shieldBattery: 'Shield Battery: Gain life if no damage taken',
};

/**
 * Props for BuffBar component.
 */
export interface BuffBarProps {
  /** Active buffs from player state */
  buffs: ActiveBuffs;
}

/**
 * Displays icons for all active buffs.
 * Shows charge count for numbered buffs (e.g., forcefield).
 * Hidden when no buffs are active.
 */
export const BuffBar = memo(function BuffBar({ buffs }: BuffBarProps) {
  // Get list of active buffs
  const activeBuffKeys = (Object.keys(buffs) as Array<keyof ActiveBuffs>).filter(
    (key) => {
      const value = buffs[key];
      // Consider buff active if truthy (boolean true or number > 0)
      return value === true || (typeof value === 'number' && value > 0);
    }
  );

  // Hide when no buffs active
  if (activeBuffKeys.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      {activeBuffKeys.map((buffKey) => {
        const value = buffs[buffKey];
        const hasCharges = typeof value === 'number' && value > 0;

        return (
          <div
            key={buffKey}
            className="relative flex items-center"
            title={BUFF_TOOLTIPS[buffKey]}
          >
            <span className="text-lg" aria-label={BUFF_TOOLTIPS[buffKey]}>
              {BUFF_ICONS[buffKey]}
            </span>
            {hasCharges && (
              <span className="absolute -bottom-1 -right-1 text-xs font-mono font-bold text-dungeon-gold bg-dungeon-shadow rounded-full w-4 h-4 flex items-center justify-center">
                {value}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
});
