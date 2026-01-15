/**
 * UpgradeShopModal component - permanent upgrade shop.
 * @module components/ui/UpgradeShopModal
 */

import { memo } from 'react';
import { useMetaStore } from '@/stores/metaStore';
import {
  getUpgradeCost,
  canPurchaseUpgrade,
  isLeveledUpgrade,
  isUnlockableUpgrade,
  type PermanentUpgrade,
} from '@/types';

/**
 * Props for UpgradeShopModal component.
 */
export interface UpgradeShopModalProps {
  /** Called when Continue button clicked */
  onContinue: () => void;
}

/**
 * Props for UpgradeCard subcomponent.
 */
interface UpgradeCardProps {
  upgradeId: string;
  upgrade: PermanentUpgrade;
  gold: number;
  onPurchase: (id: string) => void;
}

/**
 * Individual upgrade card component.
 */
const UpgradeCard = memo(function UpgradeCard({
  upgradeId,
  upgrade,
  gold,
  onPurchase,
}: UpgradeCardProps) {
  const cost = getUpgradeCost(upgrade);
  const canAfford = gold >= cost;

  // Check if maxed
  const isMaxed =
    (isLeveledUpgrade(upgrade) && upgrade.level >= upgrade.maxLevel) ||
    (isUnlockableUpgrade(upgrade) && upgrade.unlocked);

  const canPurchase = canPurchaseUpgrade(upgrade, gold);

  // Level display
  const levelDisplay = isLeveledUpgrade(upgrade)
    ? `${upgrade.level}/${upgrade.maxLevel}`
    : isUnlockableUpgrade(upgrade)
      ? upgrade.unlocked
        ? 'Unlocked'
        : 'Locked'
      : '';

  return (
    <div
      className="p-3"
      style={{
        background: isMaxed
          ? 'linear-gradient(180deg, var(--stone-750) 0%, var(--stone-800) 100%)'
          : 'linear-gradient(180deg, var(--stone-700) 0%, var(--stone-800) 100%)',
        border: isMaxed ? '2px solid var(--stone-600)' : '2px solid var(--stone-500)',
        opacity: isMaxed ? 0.6 : 1,
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3
          style={{
            fontSize: '11px',
            color: isMaxed ? 'var(--stone-400)' : 'var(--bone)',
            fontWeight: 'bold',
          }}
        >
          {upgrade.name}
        </h3>
        <span
          style={{
            fontSize: '9px',
            color: 'var(--stone-400)',
          }}
        >
          {levelDisplay}
        </span>
      </div>

      <p
        style={{
          fontSize: '9px',
          color: 'var(--stone-300)',
          marginBottom: '8px',
          minHeight: '24px',
        }}
      >
        {upgrade.description}
      </p>

      <div className="flex justify-between items-center">
        <span
          style={{
            fontSize: '10px',
            color: canAfford ? 'var(--gold)' : 'var(--blood)',
            fontWeight: 'bold',
          }}
        >
          {isMaxed ? 'MAX' : `${cost}g`}
        </span>

        <button
          onClick={() => onPurchase(upgradeId)}
          disabled={!canPurchase}
          className="px-3 py-1 transition-all"
          style={{
            background: canPurchase
              ? 'linear-gradient(180deg, var(--gold) 0%, var(--gold-dark) 100%)'
              : 'var(--stone-600)',
            color: canPurchase ? 'var(--stone-900)' : 'var(--stone-400)',
            fontSize: '9px',
            border: 'none',
            cursor: canPurchase ? 'pointer' : 'not-allowed',
            opacity: canPurchase ? 1 : 0.5,
          }}
        >
          {isMaxed ? 'Maxed' : 'Buy'}
        </button>
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
      <div
        className="max-w-md w-full mx-4"
        style={{
          background: 'linear-gradient(180deg, var(--stone-800) 0%, var(--stone-850) 100%)',
          border: '3px solid var(--gold-dark)',
          boxShadow: '0 0 30px rgba(218, 165, 32, 0.2), inset 0 1px 0 var(--stone-700)',
          padding: '20px',
        }}
      >
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
            style={{
              fontSize: '12px',
              color: 'var(--gold)',
              fontWeight: 'bold',
            }}
          >
            {metaGold}g
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
            background: 'linear-gradient(180deg, var(--stone-600) 0%, var(--stone-700) 100%)',
            color: 'var(--bone)',
            fontSize: '10px',
            border: 'none',
            boxShadow: '0 4px 0 var(--stone-800), 0 6px 12px rgba(0, 0, 0, 0.4)',
            cursor: 'pointer',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
});
