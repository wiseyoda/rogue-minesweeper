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
  /** Called when Try Again button clicked */
  onRetry: () => void;
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
  onRetry,
}: GameOverModalProps) {
  return (
    <div
      className="fixed inset-0 bg-dungeon-shadow/80 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gameover-modal-title"
    >
      <div className="bg-dungeon-parchment p-8 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h2
          id="gameover-modal-title"
          className="text-2xl font-cinzel text-dungeon-blood text-center mb-6"
        >
          You Died!
        </h2>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-dungeon-stone">Level Reached</span>
            <span className="font-mono font-bold text-dungeon-amber">
              {levelReached}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-dungeon-stone">Total Gold</span>
            <span className="font-mono font-bold text-dungeon-gold">
              {totalGold}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-dungeon-stone">Tiles Revealed</span>
            <span className="font-mono font-bold text-dungeon-stone">
              {tilesRevealed}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-dungeon-stone">Monsters Flagged</span>
            <span className="font-mono font-bold text-dungeon-stone">
              {monstersFlagged}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-dungeon-stone">Damage Taken</span>
            <span className="font-mono font-bold text-dungeon-blood">
              {damageTaken}
            </span>
          </div>
        </div>

        <button
          onClick={onRetry}
          className="w-full py-3 bg-dungeon-blood text-dungeon-parchment font-cinzel rounded hover:bg-dungeon-blood/80 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
});
