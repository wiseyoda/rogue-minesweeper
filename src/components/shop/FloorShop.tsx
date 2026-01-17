/**
 * FloorShop - Between-floor shop modal.
 * @module components/shop/FloorShop
 */

import { memo, type ReactNode } from 'react';
import type { ShopItem } from '@/types/item';
import type { RuneDefinition } from '@/types';
import { Button, Panel } from '../ui';
import { ShopItemCard } from './ShopItemCard';
import { RuneCard } from './RuneCard';
import { getRerollCost } from '@/data/shopItems';
import { getRune } from '@/data/runes';
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
  /** Available rune reward IDs for this shop visit */
  availableRuneRewards?: string[];
  /** Whether a rune has been selected this shop visit */
  runeSelected?: boolean;
  /** Called when a rune is selected */
  onSelectRune?: (runeId: string) => void;
  /** Player's currently equipped rune IDs */
  equippedRunes?: string[];
  /** Rune ID pending replacement (when at max capacity) */
  pendingRuneReplacement?: string;
  /** Called to confirm replacement of a specific slot */
  onConfirmReplacement?: (slotIndex: number) => void;
  /** Called to cancel the pending replacement */
  onCancelReplacement?: () => void;
}

/**
 * Between-floor shop modal.
 * Displays purchasable items and rune rewards with reroll and continue options.
 */
export const FloorShop = memo(function FloorShop({
  items,
  gold,
  purchasedIds,
  rerollCount,
  onPurchase,
  onReroll,
  onContinue,
  availableRuneRewards = [],
  runeSelected = false,
  onSelectRune,
  equippedRunes = [],
  pendingRuneReplacement,
  onConfirmReplacement,
  onCancelReplacement,
}: FloorShopProps) {
  const rerollCost = getRerollCost(rerollCount);
  const canAffordReroll = gold >= rerollCost;
  const isAtMaxRunes = equippedRunes.length >= 3;

  // Convert rune IDs to definitions
  const runeRewards: RuneDefinition[] = availableRuneRewards
    .map((id) => getRune(id))
    .filter((r): r is RuneDefinition => r !== undefined);

  // Get pending rune details for replacement UI
  const pendingRune = pendingRuneReplacement ? getRune(pendingRuneReplacement) : null;
  const removalFee = pendingRune ? Math.floor(pendingRune.cost / 2) : 0;
  const totalReplacementCost = pendingRune ? pendingRune.cost + removalFee : 0;

  // Get equipped rune definitions for replacement UI
  const equippedRuneDefs = equippedRunes
    .map((id) => getRune(id))
    .filter((r): r is RuneDefinition => r !== undefined);

  // Calculate affordability considering replacement costs
  const canAffordRune = (rune: RuneDefinition): boolean => {
    if (isAtMaxRunes) {
      const fee = Math.floor(rune.cost / 2);
      return gold >= rune.cost + fee;
    }
    return gold >= rune.cost;
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-y-auto py-4"
      style={{
        zIndex: 200,
        background: 'rgba(5, 5, 10, 0.95)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shop-title"
    >
      <Panel className="max-w-3xl w-full mx-4 my-auto">
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

        {/* Rune Rewards Section */}
        {runeRewards.length > 0 && (
          <>
            <div
              className="text-center"
              style={{
                fontSize: '12px',
                color: 'var(--mystic)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '12px',
              }}
            >
              Runes For Sale
              {isAtMaxRunes && !runeSelected && (
                <span
                  style={{
                    display: 'block',
                    fontSize: '8px',
                    color: 'var(--stone-400)',
                    marginTop: '4px',
                    textTransform: 'none',
                    letterSpacing: 'normal',
                  }}
                >
                  (Max runes equipped - buying requires removal fee)
                </span>
              )}
            </div>

            {/* Replacement Selection Panel */}
            {pendingRune && (
              <div
                style={{
                  background: 'linear-gradient(180deg, var(--mystic-dark) 0%, var(--stone-850) 100%)',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: 'var(--mystic)',
                  padding: '16px',
                  marginBottom: '16px',
                }}
              >
                <div
                  className="text-center"
                  style={{
                    fontSize: '11px',
                    color: 'var(--bone)',
                    marginBottom: '12px',
                  }}
                >
                  Select a rune to replace with{' '}
                  <span style={{ color: 'var(--mystic)' }}>{pendingRune.name}</span>
                </div>

                {/* Cost breakdown */}
                <div
                  className="text-center"
                  style={{
                    fontSize: '9px',
                    color: 'var(--stone-400)',
                    marginBottom: '16px',
                  }}
                >
                  Cost: {pendingRune.cost}g (rune) + {removalFee}g (removal) ={' '}
                  <span style={{ color: gold >= totalReplacementCost ? 'var(--gold)' : 'var(--blood)' }}>
                    {totalReplacementCost}g total
                  </span>
                </div>

                {/* Current runes to choose from */}
                <div
                  className="flex justify-center"
                  style={{ gap: '12px', marginBottom: '12px' }}
                >
                  {equippedRuneDefs.map((rune, index) => (
                    <button
                      key={rune.id}
                      onClick={() => onConfirmReplacement?.(index)}
                      disabled={gold < totalReplacementCost}
                      style={{
                        background: 'linear-gradient(180deg, var(--stone-700) 0%, var(--stone-800) 100%)',
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderColor: 'var(--stone-500)',
                        padding: '8px 12px',
                        cursor: gold >= totalReplacementCost ? 'pointer' : 'not-allowed',
                        opacity: gold >= totalReplacementCost ? 1 : 0.5,
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        if (gold >= totalReplacementCost) {
                          e.currentTarget.style.borderColor = 'var(--blood)';
                          e.currentTarget.style.boxShadow = '0 0 8px var(--blood-dark)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--stone-500)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ fontSize: '18px', marginBottom: '4px' }}>{rune.icon}</div>
                      <div style={{ fontSize: '8px', color: 'var(--bone)' }}>{rune.name}</div>
                    </button>
                  ))}
                </div>

                {/* Cancel button */}
                <div className="text-center">
                  <Button variant="secondary" onClick={onCancelReplacement}>
                    <span style={{ fontSize: '9px' }}>Cancel</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Rune cards (hidden when replacement panel is shown) */}
            {!pendingRune && (
              <div
                className="grid"
                style={{
                  gridTemplateColumns: 'repeat(auto-fit, 200px)',
                  justifyContent: 'center',
                  gap: '24px',
                  marginBottom: '24px',
                }}
              >
                {runeRewards.map((rune) => (
                  <RuneCard
                    key={rune.id}
                    rune={rune}
                    isSelected={false}
                    isDisabled={runeSelected}
                    canAfford={canAffordRune(rune)}
                    onSelect={() => onSelectRune?.(rune.id)}
                    showReplacementCost={isAtMaxRunes && !runeSelected}
                  />
                ))}
              </div>
            )}

            {/* Divider */}
            <div
              style={{
                borderTop: '1px solid var(--stone-700)',
                marginBottom: '24px',
              }}
            />
          </>
        )}

        {/* Items Section Header */}
        <div
          className="text-center"
          style={{
            fontSize: '12px',
            color: 'var(--gold)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '12px',
          }}
        >
          Items For Sale
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
