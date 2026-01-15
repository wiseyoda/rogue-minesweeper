/**
 * WinModal component - displays level complete screen.
 * @module components/ui/WinModal
 */

import { memo } from 'react';

/**
 * Props for WinModal component.
 */
export interface WinModalProps {
  /** Tiles revealed this level */
  tilesRevealed: number;
  /** Gold collected this level */
  goldCollected: number;
  /** Monsters avoided (not hit) this level */
  monstersAvoided: number;
  /** Gold bonus awarded for completing this floor */
  floorBonus: number;
  /** Called when Continue button clicked */
  onContinue: () => void;
}

/**
 * Modal displayed when player clears all safe tiles.
 * Shows level stats and Continue button.
 */
export const WinModal = memo(function WinModal({
  tilesRevealed,
  goldCollected,
  monstersAvoided,
  floorBonus,
  onContinue,
}: WinModalProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 200,
        background: 'rgba(5, 5, 10, 0.9)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="win-modal-title"
    >
      <div
        className="max-w-sm w-full mx-4"
        style={{
          background: 'linear-gradient(180deg, var(--stone-800) 0%, var(--stone-850) 100%)',
          border: '3px solid var(--gold)',
          boxShadow: '0 0 30px rgba(212, 175, 55, 0.3), inset 0 1px 0 var(--stone-700)',
          padding: '24px',
        }}
      >
        <h2
          id="win-modal-title"
          className="text-center mb-6"
          style={{
            fontSize: '16px',
            color: 'var(--gold)',
            textShadow: '0 0 10px var(--gold-dark)',
          }}
        >
          Level Complete!
        </h2>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span style={{ color: 'var(--stone-300)', fontSize: '10px' }}>Tiles Revealed</span>
            <span style={{ color: 'var(--bone)', fontSize: '12px', fontWeight: 'bold' }}>
              {tilesRevealed}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: 'var(--stone-300)', fontSize: '10px' }}>Gold Collected</span>
            <span style={{ color: 'var(--gold)', fontSize: '12px', fontWeight: 'bold' }}>
              {goldCollected}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: 'var(--stone-300)', fontSize: '10px' }}>Monsters Avoided</span>
            <span style={{ color: 'var(--blood)', fontSize: '12px', fontWeight: 'bold' }}>
              {monstersAvoided}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: 'var(--stone-300)', fontSize: '10px' }}>Floor Bonus</span>
            <span style={{ color: 'var(--gold)', fontSize: '12px', fontWeight: 'bold' }}>
              +{floorBonus}
            </span>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-3 transition-all"
          style={{
            background: 'linear-gradient(180deg, var(--gold) 0%, var(--gold-dark) 100%)',
            color: 'var(--void)',
            fontSize: '10px',
            border: 'none',
            boxShadow: '0 4px 0 var(--gold-shadow), 0 6px 12px rgba(0, 0, 0, 0.4)',
            cursor: 'pointer',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
});
