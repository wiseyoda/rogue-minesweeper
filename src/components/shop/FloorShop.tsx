/**
 * FloorShop - Between-floor shop modal.
 * @module components/shop/FloorShop
 */

import { memo, type ReactNode } from 'react';
import type { ShopItem } from '@/types/item';
import { Button, Panel } from '../ui';
import { ShopItemCard } from './ShopItemCard';
import { getRerollCost } from '@/data/shopItems';
import {
  HealPotionIcon,
  MaxHPUpIcon,
  ShieldOrbIcon,
  GoldMagnetIcon,
  RevealScrollIcon,
  PeekScrollIcon,
} from '../icons';
import { Coin } from '../icons';

/**
 * Map shop item IDs to their icon components.
 */
const ITEM_ICONS: Record<string, ReactNode> = {
  'heal-potion': <HealPotionIcon size={24} />,
  'max-hp-up': <MaxHPUpIcon size={24} />,
  'shield-orb': <ShieldOrbIcon size={24} />,
  'gold-magnet': <GoldMagnetIcon size={24} />,
  'reveal-scroll': <RevealScrollIcon size={24} />,
  'peek-scroll': <PeekScrollIcon size={24} />,
};

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
  /** Number of times shop has been rerolled this visit */
  rerollCount: number;
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
  rerollCount,
  onPurchase,
  onReroll,
  onContinue,
}: FloorShopProps) {
  const rerollCost = getRerollCost(rerollCount);
  const canAffordReroll = gold >= rerollCost;

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
      <Panel className="max-w-2xl w-full mx-4">
        {/* Title */}
        <h2
          id="shop-title"
          className="text-center"
          style={{
            fontSize: '18px',
            color: 'var(--gold)',
            textShadow: '0 0 12px var(--gold-dark)',
            marginBottom: '8px',
          }}
        >
          FLOOR SHOP
        </h2>

        {/* Gold Display */}
        <div
          className="flex items-center justify-center gap-2"
          style={{
            fontSize: '14px',
            color: 'var(--gold-bright)',
            marginBottom: '24px',
          }}
        >
          <Coin size={16} />
          <span>{gold}</span>
        </div>

        {/* Item Grid */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, 200px)',
            justifyContent: 'center',
            gap: '24px',
            marginBottom: '24px',
          }}
        >
          {items.map((item) => (
            <ShopItemCard
              key={item.id}
              item={item}
              icon={ITEM_ICONS[item.id]}
              canAfford={gold >= item.cost}
              isPurchased={purchasedIds.includes(item.id)}
              onPurchase={() => onPurchase(item.id)}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-center" style={{ gap: '16px' }}>
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
              Reroll ({rerollCost}g)
            </span>
          </Button>
          <Button variant="primary" onClick={onContinue}>
            <span style={{ fontSize: '10px' }}>Continue</span>
          </Button>
        </div>
      </Panel>
    </div>
  );
});
