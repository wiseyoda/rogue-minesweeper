/**
 * ShopItemCard - Individual item display in floor shop.
 * @module components/shop/ShopItemCard
 */

import { memo } from 'react';
import type { ShopItem, ItemRarity } from '@/types/item';
import { Button } from '../ui';

/**
 * Props for ShopItemCard component.
 */
export interface ShopItemCardProps {
  /** The shop item to display */
  item: ShopItem;
  /** Whether player can afford this item */
  canAfford: boolean;
  /** Whether this item has been purchased */
  isPurchased: boolean;
  /** Called when purchase button is clicked */
  onPurchase: () => void;
}

/**
 * Get border color based on rarity.
 */
function getRarityColor(rarity: ItemRarity = 'common'): string {
  switch (rarity) {
    case 'legendary':
      return 'var(--gold)';
    case 'rare':
      return 'var(--mystic)';
    case 'uncommon':
      return 'var(--ice)';
    case 'common':
    default:
      return 'var(--stone-500)';
  }
}

/**
 * Get glow color for hover effect based on rarity.
 */
function getRarityGlow(rarity: ItemRarity = 'common'): string {
  switch (rarity) {
    case 'legendary':
      return 'rgba(212, 175, 55, 0.4)';
    case 'rare':
      return 'rgba(112, 48, 176, 0.4)';
    case 'uncommon':
      return 'rgba(135, 206, 235, 0.3)';
    case 'common':
    default:
      return 'rgba(128, 128, 128, 0.2)';
  }
}

/**
 * Individual item card in the floor shop.
 * Shows item name, description, cost, and purchase button.
 */
export const ShopItemCard = memo(function ShopItemCard({
  item,
  canAfford,
  isPurchased,
  onPurchase,
}: ShopItemCardProps) {
  const borderColor = getRarityColor(item.rarity);
  const isDisabled = isPurchased || !canAfford;

  return (
    <div
      className="flex flex-col transition-all duration-200"
      style={{
        background: isPurchased
          ? 'var(--stone-900)'
          : 'linear-gradient(180deg, var(--stone-800) 0%, var(--stone-850) 100%)',
        border: `2px solid ${isPurchased ? 'var(--stone-700)' : borderColor}`,
        padding: '12px',
        minWidth: '140px',
        opacity: isPurchased ? 0.5 : 1,
        boxShadow: !isDisabled
          ? `0 0 12px ${getRarityGlow(item.rarity)}`
          : 'none',
      }}
    >
      {/* Item Name */}
      <h3
        className="text-center mb-2"
        style={{
          fontSize: '11px',
          color: isPurchased ? 'var(--stone-500)' : 'var(--bone)',
          fontWeight: 'bold',
        }}
      >
        {item.name}
      </h3>

      {/* Description */}
      <p
        className="text-center mb-3 flex-1"
        style={{
          fontSize: '9px',
          color: isPurchased ? 'var(--stone-600)' : 'var(--stone-400)',
          lineHeight: 1.4,
        }}
      >
        {item.description}
      </p>

      {/* Purchase Button */}
      {isPurchased ? (
        <div
          className="text-center py-2"
          style={{
            fontSize: '9px',
            color: 'var(--stone-500)',
          }}
        >
          Purchased
        </div>
      ) : (
        <Button
          variant={canAfford ? 'primary' : 'secondary'}
          onClick={onPurchase}
          disabled={isDisabled}
          className="w-full"
        >
          <span
            style={{
              color: canAfford ? 'inherit' : 'var(--blood-dark)',
              fontSize: '9px',
            }}
          >
            {item.cost}g
          </span>
        </Button>
      )}
    </div>
  );
});
