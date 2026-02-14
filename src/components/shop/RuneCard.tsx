/**
 * RuneCard - Individual rune display in floor shop.
 * @module components/shop/RuneCard
 */

import { memo } from 'react';
import type { RuneDefinition, RuneRarity, RuneCategory } from '@/types';
import { Button } from '../ui';

/**
 * Props for RuneCard component.
 */
export interface RuneCardProps {
  /** The rune definition to display */
  rune: RuneDefinition;
  /** Whether this rune is already selected */
  isSelected: boolean;
  /** Whether rune selection is disabled (already selected one this visit) */
  isDisabled: boolean;
  /** Whether player can afford this rune */
  canAfford: boolean;
  /** Called when select button is clicked */
  onSelect: () => void;
  /** Whether to show the replacement cost (rune cost + removal fee) */
  showReplacementCost?: boolean;
  /** Whether this offer came from a tile drop this floor */
  isTileDropOffer?: boolean;
}

/**
 * Get border color based on rarity.
 */
function getRarityColor(rarity: RuneRarity): string {
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
function getRarityGlow(rarity: RuneRarity): string {
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
 * Get category accent color.
 */
function getCategoryColor(category: RuneCategory): string {
  switch (category) {
    case 'information':
      return 'var(--ice)';
    case 'defense':
      return 'var(--stone-400)';
    case 'economy':
      return 'var(--gold)';
    case 'utility':
      return 'var(--grass)';
  }
}

/**
 * Individual rune card in the floor shop.
 * Shows rune icon, name, description, category, and select button.
 */
export const RuneCard = memo(function RuneCard({
  rune,
  isSelected,
  isDisabled,
  canAfford,
  onSelect,
  showReplacementCost = false,
  isTileDropOffer = false,
}: RuneCardProps) {
  const borderColor = getRarityColor(rune.rarity);
  const categoryColor = getCategoryColor(rune.category);
  const disabled = isSelected || isDisabled || !canAfford;

  // Calculate displayed cost
  const removalFee = showReplacementCost ? Math.floor(rune.cost / 2) : 0;
  const displayCost = rune.cost + removalFee;

  return (
    <div
      className="flex flex-col transition-all duration-200"
      style={{
        background: isSelected
          ? 'linear-gradient(180deg, var(--stone-800) 0%, var(--mystic-dark) 50%)'
          : 'linear-gradient(180deg, var(--stone-800) 0%, var(--stone-850) 100%)',
        border: `2px solid ${isSelected ? 'var(--mystic)' : borderColor}`,
        padding: '12px',
        width: '200px',
        height: '180px',
        opacity: disabled && !isSelected ? 0.5 : 1,
        boxShadow: isSelected
          ? '0 0 20px rgba(112, 48, 176, 0.5)'
          : !disabled
            ? `0 0 12px ${getRarityGlow(rune.rarity)}`
            : 'none',
        transform: 'scale(1)',
        cursor: disabled ? 'default' : 'pointer',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = `0 0 20px ${getRarityGlow(rune.rarity)}`;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow =
          isSelected
            ? '0 0 20px rgba(112, 48, 176, 0.5)'
            : !disabled
              ? `0 0 12px ${getRarityGlow(rune.rarity)}`
              : 'none';
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(0.98)';
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(1.02)';
        }
      }}
    >
      {/* Category badge - top right corner */}
      <span
        style={{
          position: 'absolute',
          top: '6px',
          right: '6px',
          fontSize: '7px',
          color: categoryColor,
          padding: '2px 4px',
          background: 'var(--stone-900)',
          borderRadius: '2px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {rune.category.slice(0, 3)}
      </span>

      {isTileDropOffer && (
        <span
          style={{
            position: 'absolute',
            top: '6px',
            left: '6px',
            fontSize: '7px',
            color: 'var(--mystic-glow)',
            padding: '2px 4px',
            background: 'var(--stone-900)',
            borderRadius: '2px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            border: '1px solid var(--mystic)',
          }}
        >
          Drop
        </span>
      )}

      {/* Icon */}
      <div
        className="flex justify-center items-center"
        style={{
          height: '32px',
          marginBottom: '8px',
          fontSize: '24px',
        }}
      >
        {rune.icon}
      </div>

      {/* Rune Name */}
      <h3
        className="text-center"
        style={{
          fontSize: '11px',
          color: 'var(--bone)',
          fontWeight: 'bold',
          marginBottom: '6px',
        }}
      >
        {rune.name}
      </h3>

      {/* Description - fixed height with overflow handling */}
      <p
        className="text-center"
        style={{
          fontSize: '9px',
          color: 'var(--stone-400)',
          lineHeight: 1.3,
          height: '36px',
          overflow: 'hidden',
        }}
      >
        {rune.description}
      </p>

      {/* Select Button */}
      {isSelected ? (
        <div
          className="text-center py-2"
          style={{
            fontSize: '9px',
            color: 'var(--mystic)',
            marginTop: 'auto',
            fontWeight: 'bold',
          }}
        >
          Equipped
        </div>
      ) : (
        <Button
          variant="primary"
          onClick={onSelect}
          disabled={disabled}
          className="w-full"
          style={{ marginTop: 'auto' }}
        >
          <span
            style={{
              fontSize: '9px',
              color: !canAfford ? 'var(--blood)' : 'inherit',
            }}
          >
            {displayCost}g
            {showReplacementCost && (
              <span style={{ fontSize: '7px', opacity: 0.7 }}> (+{removalFee})</span>
            )}
          </span>
        </Button>
      )}
    </div>
  );
});
