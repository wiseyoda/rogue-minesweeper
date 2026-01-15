/**
 * FloorShop - Between-floor shop modal.
 * @module components/shop/FloorShop
 */

import { memo } from 'react';
import type { ShopItem } from '@/types/item';
import { Button } from '../ui';
import { ShopItemCard } from './ShopItemCard';
import { REROLL_COST } from '@/data/shopItems';

/**
 * Props for FloorShop component.
 */
export interface FloorShopProps {
  /** Available items in the shop */
  items: ShopItem[];
  /** Player's current gold */
  gold: number;
  /** IDs of items already purchased */
  purchasedIds: string[];
  /** Called when an item is purchased */
  onPurchase: (itemId: string) => void;
  /** Called when reroll button is clicked */
  onReroll: () => void;
  /** Called when continue button is clicked */
  onContinue: () => void;
}

/**
 * Between-floor shop modal.
 * Displays purchasable items with reroll and continue options.
 */
export const FloorShop = memo(function FloorShop({
  items,
  gold,
  purchasedIds,
  onPurchase,
  onReroll,
  onContinue,
}: FloorShopProps) {
  const canAffordReroll = gold >= REROLL_COST;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 200,
        background: 'rgba(5, 5, 10, 0.95)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shop-title"
    >
      <div
        className="max-w-2xl w-full mx-4"
        style={{
          background:
            'linear-gradient(180deg, var(--stone-800) 0%, var(--stone-900) 100%)',
          border: '3px solid var(--gold)',
          boxShadow:
            '0 0 40px rgba(212, 175, 55, 0.3), inset 0 1px 0 var(--stone-700)',
          padding: '24px',
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2
            id="shop-title"
            style={{
              fontSize: '18px',
              color: 'var(--gold)',
              textShadow: '0 0 12px var(--gold-dark)',
              marginBottom: '8px',
            }}
          >
            FLOOR SHOP
          </h2>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--gold-bright)',
            }}
          >
            Gold: {gold}
          </div>
        </div>

        {/* Item Grid */}
        <div
          className="flex justify-center gap-4 flex-wrap mb-6"
          style={{ minHeight: '180px' }}
        >
          {items.map((item) => (
            <ShopItemCard
              key={item.id}
              item={item}
              canAfford={gold >= item.cost}
              isPurchased={purchasedIds.includes(item.id)}
              onPurchase={() => onPurchase(item.id)}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button
            variant="secondary"
            onClick={onReroll}
            disabled={!canAffordReroll}
          >
            <span
              style={{
                color: canAffordReroll ? 'inherit' : 'var(--stone-600)',
                fontSize: '10px',
              }}
            >
              Reroll ({REROLL_COST}g)
            </span>
          </Button>
          <Button variant="primary" onClick={onContinue}>
            <span style={{ fontSize: '10px' }}>Continue</span>
          </Button>
        </div>
      </div>
    </div>
  );
});
