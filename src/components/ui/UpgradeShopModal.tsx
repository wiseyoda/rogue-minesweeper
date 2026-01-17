/**
 * UpgradeShopModal component - permanent upgrade shop.
 * @module components/ui/UpgradeShopModal
 */

import { memo, type ReactNode } from 'react';
import { useMetaStore } from '@/stores/metaStore';
import {
  getUpgradeCost,
  canPurchaseUpgrade,
  isLeveledUpgrade,
  isUnlockableUpgrade,
  type PermanentUpgrade,
} from '@/types';
import { Panel } from './Panel';
import {
  VitalityIcon,
  FortuneIcon,
  ResilienceIcon,
  FirstClickSafetyIcon,
  PreparationIcon,
  Coin,
} from '../icons';

/**
 * Map upgrade IDs to their icon components.
 */
const UPGRADE_ICONS: Record<string, ReactNode> = {
  vitality: <VitalityIcon size={24} />,
  fortune: <FortuneIcon size={24} />,
  resilience: <ResilienceIcon size={24} />,
  firstClickSafety: <FirstClickSafetyIcon size={24} />,
  preparation: <PreparationIcon size={24} />,
};

/**
 * Props for UpgradeShopModal component.
 */
export interface UpgradeShopModalProps {
  /** Called when Continue button clicked */
  onContinue: () => void;
}

/**
 * Level indicator component - shows progress for leveled upgrades.
 * Uses pips for low-level upgrades, text for high-level ones.
 */
const LevelIndicator = memo(function LevelIndicator({
  current,
  max,
}: {
  current: number;
  max: number;
}) {
  // For upgrades with many levels, show text instead of pips
  if (max > 10) {
    const percentage = Math.round((current / max) * 100);
    return (
      <div className="flex flex-col items-center gap-1">
        <div
          className="text-center"
          style={{
            fontSize: '10px',
            color: current === max ? 'var(--venom)' : 'var(--gold)',
            fontWeight: 'bold',
          }}
        >
          {current} / {max}
        </div>
        {/* Progress bar */}
        <div
          style={{
            width: '80%',
            height: '4px',
            background: 'var(--stone-700)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--stone-500)',
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: '100%',
              background: current === max ? 'var(--venom)' : 'var(--gold)',
              transition: 'width 0.2s',
            }}
          />
        </div>
      </div>
    );
  }

  // For low-level upgrades, show pips
  return (
    <div className="flex justify-center gap-1">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          style={{
            width: '10px',
            height: '10px',
            background: i < current ? 'var(--gold)' : 'var(--stone-700)',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: 'var(--stone-500)',
          }}
        />
      ))}
    </div>
  );
});

/**
 * Props for UpgradeCard subcomponent.
 */
interface UpgradeCardProps {
  upgradeId: string;
  upgrade: PermanentUpgrade;
  icon?: ReactNode;
  gold: number;
  onPurchase: (id: string) => void;
}

/**
 * Individual upgrade card component.
 * Layout matches ShopItemCard: Icon centered → Name → Level/Status → Description → Cost/Button
 */
const UpgradeCard = memo(function UpgradeCard({
  upgradeId,
  upgrade,
  icon,
  gold,
  onPurchase,
}: UpgradeCardProps) {
  const cost = getUpgradeCost(upgrade);

  // Check if maxed
  const isMaxed =
    (isLeveledUpgrade(upgrade) && upgrade.level >= upgrade.maxLevel) ||
    (isUnlockableUpgrade(upgrade) && upgrade.unlocked);

  const canPurchase = canPurchaseUpgrade(upgrade, gold);

  return (
    <div
      className="flex flex-col p-3 transition-all duration-200"
      style={{
        background: isMaxed
          ? 'linear-gradient(180deg, var(--stone-800) 0%, var(--stone-850) 100%)'
          : 'linear-gradient(180deg, var(--stone-700) 0%, var(--stone-800) 100%)',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: isMaxed ? 'var(--stone-600)' : 'var(--stone-500)',
        opacity: isMaxed ? 0.5 : 1,
        cursor: canPurchase ? 'pointer' : 'default',
        minHeight: '160px',
      }}
      onMouseEnter={(e) => {
        if (canPurchase) {
          e.currentTarget.style.borderColor = 'var(--gold)';
          e.currentTarget.style.boxShadow = '0 0 12px rgba(212, 175, 55, 0.3)';
          e.currentTarget.style.transform = 'scale(1.02)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isMaxed
          ? 'var(--stone-600)'
          : 'var(--stone-500)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onMouseDown={(e) => {
        if (canPurchase) {
          e.currentTarget.style.transform = 'scale(0.98)';
        }
      }}
      onMouseUp={(e) => {
        if (canPurchase) {
          e.currentTarget.style.transform = 'scale(1.02)';
        }
      }}
      onClick={() => canPurchase && onPurchase(upgradeId)}
    >
      {/* Icon - centered at top */}
      {icon && (
        <div
          className="flex justify-center mb-2"
          style={{ opacity: isMaxed ? 0.5 : 1 }}
        >
          {icon}
        </div>
      )}

      {/* Name - centered */}
      <h3
        className="text-center mb-1"
        style={{
          fontSize: '10px',
          color: isMaxed ? 'var(--stone-400)' : 'var(--bone)',
          fontWeight: 'bold',
        }}
      >
        {upgrade.name}
      </h3>

      {/* Level indicator - centered below name */}
      <div className="mb-2">
        {isLeveledUpgrade(upgrade) ? (
          <LevelIndicator current={upgrade.level} max={upgrade.maxLevel} />
        ) : isUnlockableUpgrade(upgrade) ? (
          <div
            className="text-center"
            style={{
              fontSize: '10px',
              color: upgrade.unlocked ? 'var(--venom)' : 'var(--stone-500)',
              fontWeight: 'bold',
            }}
          >
            {upgrade.unlocked ? '✓ Unlocked' : '○ Locked'}
          </div>
        ) : null}
      </div>

      {/* Description - centered, flex-1 to push button down */}
      <p
        className="text-center flex-1"
        style={{
          fontSize: '8px',
          color: 'var(--stone-400)',
          lineHeight: 1.4,
        }}
      >
        {upgrade.description}
      </p>

      {/* Cost and button - full width at bottom */}
      <div className="mt-2">
        {isMaxed ? (
          <div
            className="text-center py-2"
            style={{
              fontSize: '9px',
              color: 'var(--stone-500)',
              fontWeight: 'bold',
            }}
          >
            MAXED
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPurchase(upgradeId);
            }}
            disabled={!canPurchase}
            className="w-full py-2 transition-all flex items-center justify-center gap-1"
            style={{
              background: canPurchase
                ? 'linear-gradient(180deg, var(--gold) 0%, var(--gold-dark) 100%)'
                : 'var(--stone-600)',
              color: canPurchase ? 'var(--stone-900)' : 'var(--stone-400)',
              fontSize: '9px',
              fontWeight: 'bold',
              border: 'none',
              cursor: canPurchase ? 'pointer' : 'not-allowed',
            }}
          >
            <Coin size={12} />
            {cost}
          </button>
        )}
      </div>
    </div>
  );
});

/**
 * Modal for purchasing permanent upgrades after death.
 */
export const UpgradeShopModal = memo(function UpgradeShopModal({
  onContinue,
}: UpgradeShopModalProps) {
  const { upgrades, metaGold, purchaseUpgrade } = useMetaStore();

  const handlePurchase = (id: string) => {
    purchaseUpgrade(id);
  };

  const upgradeEntries = Object.entries(upgrades);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 200,
        background: 'rgba(5, 5, 10, 0.95)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-shop-title"
    >
      <Panel className="max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2
            id="upgrade-shop-title"
            style={{
              fontSize: '14px',
              color: 'var(--gold)',
              textShadow: '0 0 10px var(--gold-dark)',
            }}
          >
            Permanent Upgrades
          </h2>
          <div
            className="flex items-center gap-1"
            style={{
              fontSize: '12px',
              color: 'var(--gold)',
              fontWeight: 'bold',
            }}
          >
            <Coin size={14} />
            {metaGold}
          </div>
        </div>

        {/* Upgrade Grid */}
        <div
          className="grid gap-3 mb-4"
          style={{
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          {upgradeEntries.map(([id, upgrade]) => (
            <UpgradeCard
              key={id}
              upgradeId={id}
              upgrade={upgrade}
              icon={UPGRADE_ICONS[id]}
              gold={metaGold}
              onPurchase={handlePurchase}
            />
          ))}
        </div>

        {/* Info Text */}
        <p
          className="text-center mb-4"
          style={{
            fontSize: '9px',
            color: 'var(--stone-400)',
          }}
        >
          Upgrades persist between runs. Remaining gold will be saved.
        </p>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full py-3 transition-all"
          style={{
            background: 'linear-gradient(180deg, var(--gold-dark) 0%, var(--gold-shadow) 100%)',
            color: 'var(--bone)',
            fontSize: '12px',
            fontWeight: 'bold',
            border: '2px solid var(--gold)',
            boxShadow: '0 4px 0 var(--stone-800), 0 6px 12px rgba(0, 0, 0, 0.4)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              'linear-gradient(180deg, var(--gold) 0%, var(--gold-dark) 100%)';
            e.currentTarget.style.color = 'var(--stone-900)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              'linear-gradient(180deg, var(--gold-dark) 0%, var(--gold-shadow) 100%)';
            e.currentTarget.style.color = 'var(--bone)';
          }}
        >
          Continue
        </button>
      </Panel>
    </div>
  );
});
