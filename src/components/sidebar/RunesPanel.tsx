/**
 * RunesPanel - Equipped runes display
 *
 * Shows equipped runes for the current run.
 * Source: .specify/reference/design-system/08-runes-panel.css
 */

import { Panel } from '../ui/Panel';
import { getRune } from '@/data/runes';
import { getSynergy } from '@/data/synergies';

interface RunesPanelProps {
  equippedRunes: string[];
  activeSynergyIds: string[];
}

export function RunesPanel({ equippedRunes, activeSynergyIds }: RunesPanelProps) {
  const emptySlots = Math.max(0, 3 - equippedRunes.length);
  const activeSynergies = activeSynergyIds
    .map((synergyId) => getSynergy(synergyId))
    .filter((synergy): synergy is NonNullable<ReturnType<typeof getSynergy>> => synergy !== undefined);

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
          Equipped Runes
        </span>
      </div>

      {/* Rune grid */}
      <div className="flex gap-2 flex-wrap">
        {/* Equipped runes */}
        {equippedRunes.map((runeId, index) => {
          const rune = getRune(runeId);
          if (!rune) return null;

          return (
            <div
              key={`${runeId}-${index}`}
              className="relative transition-all duration-200 group"
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
                cursor: 'pointer',
              }}
              title={`${rune.name}\n${rune.description}`}
            >
              <span style={{ fontSize: '20px' }}>{rune.icon}</span>

              {/* Tooltip on hover */}
              <div
                className="absolute left-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  transform: 'translateX(-50%)',
                  zIndex: 100,
                  minWidth: '120px',
                }}
              >
                <div
                  style={{
                    background: 'var(--stone-900)',
                    border: '1px solid var(--mystic)',
                    padding: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '9px',
                      fontWeight: 'bold',
                      color: 'var(--bone)',
                      marginBottom: '4px',
                      textAlign: 'center',
                    }}
                  >
                    {rune.name}
                  </div>
                  <div
                    style={{
                      fontSize: '8px',
                      color: 'var(--stone-400)',
                      textAlign: 'center',
                      lineHeight: 1.3,
                    }}
                  >
                    {rune.description}
                  </div>
                </div>
              </div>
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

      {/* Active synergies */}
      <div style={{ marginTop: '12px' }}>
        <div
          style={{
            fontSize: '7px',
            color: 'var(--stone-400)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}
        >
          Active Synergies
        </div>

        {activeSynergies.length === 0 ? (
          <div style={{ fontSize: '8px', color: 'var(--stone-600)' }}>
            None discovered yet
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {activeSynergies.map((synergy) => (
              <div
                key={synergy.id}
                style={{
                  border: '1px solid var(--mystic-dark)',
                  background: 'linear-gradient(180deg, var(--mystic-void) 0%, var(--stone-900) 100%)',
                  padding: '5px 6px',
                }}
              >
                <div style={{ fontSize: '8px', color: 'var(--mystic-glow)', marginBottom: '2px' }}>
                  {synergy.name}
                </div>
                <div style={{ fontSize: '7px', color: 'var(--stone-400)', lineHeight: 1.35 }}>
                  {synergy.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}
