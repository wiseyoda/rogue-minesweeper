/**
 * ShopItemCard - Individual item display in floor shop.
 * @module components/shop/ShopItemCard
 */

import { memo, type ReactNode } from 'react';
import type { ShopItem, ItemRarity } from '@/types/item';
import { Button } from '../ui';

/**
 * Props for ShopItemCard component.
 */
export interface ShopItemCardProps {
  /** The shop item to display */
  item: ShopItem;
  /** Icon component to display (optional) */
  icon?: ReactNode;
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
 * Shows item icon, name, description, cost, and purchase button.
 */
export const ShopItemCard = memo(function ShopItemCard({
  item,
  icon,
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
        padding: '16px',
        width: '200px',
        height: '180px',
        opacity: isPurchased ? 0.5 : 1,
        boxShadow: !isDisabled
          ? `0 0 12px ${getRarityGlow(item.rarity)}`
          : 'none',
        transform: 'scale(1)',
        cursor: isDisabled ? 'default' : 'pointer',
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = `0 0 20px ${getRarityGlow(item.rarity)}`;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = !isDisabled
          ? `0 0 12px ${getRarityGlow(item.rarity)}`
          : 'none';
      }}
      onMouseDown={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = 'scale(0.98)';
        }
      }}
      onMouseUp={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = 'scale(1.02)';
        }
      }}
    >
      {/* Icon - fixed height area for alignment */}
      <div
        className="flex justify-center items-center"
        style={{
          height: '32px',
          marginBottom: '8px',
          opacity: isPurchased ? 0.5 : 1,
        }}
      >
        {icon}
      </div>

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

      {/* Description - fixed height for alignment */}
      <p
        className="text-center"
        style={{
          fontSize: '9px',
          color: isPurchased ? 'var(--stone-600)' : 'var(--stone-400)',
          lineHeight: 1.4,
          minHeight: '32px',
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
            marginTop: 'auto',
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
          style={{ marginTop: 'auto' }}
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
