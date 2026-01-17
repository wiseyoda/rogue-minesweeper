/**
 * GameOverModal component - displays death screen.
 * @module components/ui/GameOverModal
 */

import { memo } from 'react';

/**
 * Props for GameOverModal component.
 */
export interface GameOverModalProps {
  /** Final level reached */
  levelReached: number;
  /** Total gold collected in run */
  totalGold: number;
  /** Tiles revealed this level */
  tilesRevealed: number;
  /** Monsters flagged this level */
  monstersFlagged: number;
  /** Total damage taken in run */
  damageTaken: number;
  /** Called when Continue button clicked (transitions to upgrade shop) */
  onContinue: () => void;
}

/**
 * Modal displayed when player dies.
 * Shows run stats and Try Again button.
 */
export const GameOverModal = memo(function GameOverModal({
  levelReached,
  totalGold,
  tilesRevealed,
  monstersFlagged,
  damageTaken,
  onContinue,
}: GameOverModalProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 200,
        background: 'rgba(5, 5, 10, 0.9)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gameover-modal-title"
    >
      <div
        className="max-w-sm w-full mx-4"
        style={{
          background: 'linear-gradient(180deg, var(--stone-800) 0%, var(--stone-850) 100%)',
          border: '3px solid var(--blood)',
          boxShadow: '0 0 30px rgba(204, 32, 32, 0.3), inset 0 1px 0 var(--stone-700)',
          padding: '24px',
        }}
      >
        <h2
          id="gameover-modal-title"
          className="text-center mb-6"
          style={{
            fontSize: '16px',
            color: 'var(--blood)',
            textShadow: '0 0 10px var(--blood-dark)',
          }}
        >
          You Died!
        </h2>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span style={{ color: 'var(--stone-300)', fontSize: '10px' }}>Level Reached</span>
            <span style={{ color: 'var(--bone)', fontSize: '12px', fontWeight: 'bold' }}>
              {levelReached}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: 'var(--stone-300)', fontSize: '10px' }}>Total Gold</span>
            <span style={{ color: 'var(--gold)', fontSize: '12px', fontWeight: 'bold' }}>
              {totalGold}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: 'var(--stone-300)', fontSize: '10px' }}>Tiles Revealed</span>
            <span style={{ color: 'var(--bone)', fontSize: '12px', fontWeight: 'bold' }}>
              {tilesRevealed}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: 'var(--stone-300)', fontSize: '10px' }}>Monsters Flagged</span>
            <span style={{ color: 'var(--bone)', fontSize: '12px', fontWeight: 'bold' }}>
              {monstersFlagged}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: 'var(--stone-300)', fontSize: '10px' }}>Damage Taken</span>
            <span style={{ color: 'var(--blood)', fontSize: '12px', fontWeight: 'bold' }}>
              {damageTaken}
            </span>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-3 transition-all"
          style={{
            background: 'linear-gradient(180deg, var(--blood) 0%, var(--blood-dark) 100%)',
            color: 'var(--bone)',
            fontSize: '10px',
            border: 'none',
            boxShadow: '0 4px 0 var(--blood-void), 0 6px 12px rgba(0, 0, 0, 0.4)',
            cursor: 'pointer',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
});
