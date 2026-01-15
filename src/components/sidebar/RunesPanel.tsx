/**
 * RunesPanel - Active buffs display
 *
 * Shows active buffs as rune cards.
 * Source: .specify/reference/design-system/08-runes-panel.css
 */

import { Panel } from '../ui/Panel';
import type { ActiveBuffs } from '@/types/player';

interface RunesPanelProps {
  buffs: ActiveBuffs;
}

const BUFF_NAMES: Record<keyof ActiveBuffs, string> = {
  extraLife: 'Extra Life',
  goldenGoose: 'Golden Goose',
  goldMagnet: 'Gold Magnet',
  steadyHand: 'Steady Hand',
  forcefield: 'Forcefield',
  scrapMetal: 'Scrap Metal',
  shieldBattery: 'Shield Battery',
};

const BUFF_ICONS: Record<keyof ActiveBuffs, string> = {
  extraLife: '♥',
  goldenGoose: '🪿',
  goldMagnet: '🧲',
  steadyHand: '✋',
  forcefield: '🛡',
  scrapMetal: '⚙',
  shieldBattery: '🔋',
};

export function RunesPanel({ buffs }: RunesPanelProps) {
  const activeBuffKeys = Object.entries(buffs)
    .filter(([, value]) => value !== undefined && value !== false && value !== 0)
    .map(([key]) => key as keyof ActiveBuffs);

  const emptySlots = Math.max(0, 3 - activeBuffKeys.length);

  return (
    <Panel>
      {/* Header with diamond */}
      <div className="flex items-center gap-2 mb-3">
        <span
          style={{
            width: '6px',
            height: '6px',
            background: 'var(--mystic-bright)',
            transform: 'rotate(45deg)',
            boxShadow: '0 0 4px var(--mystic)',
          }}
        />
        <span
          style={{
            fontSize: '6px',
            color: 'var(--stone-300)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          Active Runes
        </span>
      </div>

      {/* Rune grid */}
      <div className="flex gap-2 flex-wrap">
        {/* Active buffs */}
        {activeBuffKeys.map((key) => {
          const value = buffs[key];
          const hasCount = typeof value === 'number' && value > 1;

          return (
            <div
              key={key}
              className="relative transition-all duration-200"
              style={{
                width: '48px',
                height: '48px',
                background: 'var(--mystic-void)',
                border: '2px solid var(--mystic)',
                boxShadow: '0 0 10px var(--mystic-dark), inset 0 0 8px var(--mystic-shadow)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={BUFF_NAMES[key]}
            >
              <span style={{ fontSize: '16px' }}>{BUFF_ICONS[key]}</span>
              {hasCount && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '4px',
                    fontSize: '6px',
                    color: 'var(--mystic-bright)',
                  }}
                >
                  x{value}
                </span>
              )}
            </div>
          );
        })}

        {/* Empty slots */}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div
            key={`empty-${i}`}
            style={{
              width: '48px',
              height: '48px',
              border: '2px dashed var(--stone-700)',
              background: 'var(--stone-900)',
            }}
          />
        ))}
      </div>
    </Panel>
  );
}
