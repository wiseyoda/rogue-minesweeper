/**
 * PlayerStats - Display player's permanent upgrades and meta progression.
 * @module components/ui/RunStats
 *
 * Compact horizontal layout for header area showing:
 * - Meta gold (spendable currency)
 * - Lifetime gold earned
 * - Purchased upgrade icons with level indicators
 */

import { memo } from 'react';
import { useMetaStore } from '@/stores/metaStore';
import { Panel } from './Panel';
import {
  FortuneIcon,
  VitalityIcon,
  ResilienceIcon,
  PreparationIcon,
  FirstClickSafetyIcon,
} from '../icons';
import { isLeveledUpgrade, isUnlockableUpgrade } from '@/types';

/**
 * Upgrade icon mapping.
 */
const UPGRADE_ICONS: Record<string, React.FC<{ size?: number }>> = {
  fortune: FortuneIcon,
  vitality: VitalityIcon,
  resilience: ResilienceIcon,
  preparation: PreparationIcon,
  firstClickSafety: FirstClickSafetyIcon,
};

/**
 * Single upgrade badge with icon and level indicator.
 */
function UpgradeBadge({
  upgradeId,
  level,
  name,
}: {
  upgradeId: string;
  level: number;
  name: string;
}) {
  const IconComponent = UPGRADE_ICONS[upgradeId];
  if (!IconComponent) return null;

  return (
    <div
      className="flex items-center"
      style={{ position: 'relative' }}
      title={`${name} x${level}`}
    >
      <IconComponent size={18} />
      {level > 1 && (
        <span
          style={{
            fontSize: '9px',
            fontWeight: 'bold',
            color: 'var(--gold-bright)',
            marginLeft: '2px',
          }}
        >
          x{level}
        </span>
      )}
    </div>
  );
}

/**
 * Compact player stats for header area.
 * Shows meta gold, lifetime gold, and purchased upgrades.
 */
export const RunStats = memo(function RunStats() {
  const metaGold = useMetaStore((s) => s.metaGold);
  const upgrades = useMetaStore((s) => s.upgrades);

  // Get purchased upgrades (level > 0 or unlocked)
  const purchasedUpgrades = Object.entries(upgrades).filter(([, upgrade]) => {
    if (isLeveledUpgrade(upgrade)) return upgrade.level > 0;
    if (isUnlockableUpgrade(upgrade)) return upgrade.unlocked;
    return false;
  });

  const hasUpgrades = purchasedUpgrades.length > 0;

  return (
    <Panel>
      <div
        className="flex items-center justify-center"
        style={{ gap: '20px' }}
      >
        {/* Gold (spendable on permanent upgrades) */}
        <div className="flex items-center" style={{ gap: '6px' }}>
          <span
            style={{
              fontSize: '10px',
              color: 'var(--stone-400)',
              textTransform: 'uppercase',
            }}
          >
            Gold
          </span>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: 'var(--gold)',
            }}
          >
            {metaGold.toLocaleString()}
          </span>
        </div>

        {/* Upgrades section (only show if has upgrades) */}
        {hasUpgrades && (
          <>
            {/* Separator */}
            <span style={{ color: 'var(--stone-600)' }}>•</span>

            {/* Upgrade Icons */}
            <div className="flex items-center" style={{ gap: '8px' }}>
              {purchasedUpgrades.map(([id, upgrade]) => {
                const level = isLeveledUpgrade(upgrade)
                  ? upgrade.level
                  : 1; // Unlockables count as level 1
                return (
                  <UpgradeBadge
                    key={id}
                    upgradeId={id}
                    level={level}
                    name={upgrade.name}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </Panel>
  );
});
