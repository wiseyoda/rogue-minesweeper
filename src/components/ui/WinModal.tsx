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
  onContinue,
}: WinModalProps) {
  return (
    <div
      className="fixed inset-0 bg-dungeon-shadow/80 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="win-modal-title"
    >
      <div className="bg-dungeon-parchment p-8 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h2
          id="win-modal-title"
          className="text-2xl font-cinzel text-dungeon-gold text-center mb-6"
        >
          Level Complete!
        </h2>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-dungeon-stone">Tiles Revealed</span>
            <span className="font-mono font-bold text-dungeon-amber">
              {tilesRevealed}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-dungeon-stone">Gold Collected</span>
            <span className="font-mono font-bold text-dungeon-gold">
              {goldCollected}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-dungeon-stone">Monsters Avoided</span>
            <span className="font-mono font-bold text-dungeon-blood">
              {monstersAvoided}
            </span>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-3 bg-dungeon-gold text-dungeon-parchment font-cinzel rounded hover:bg-dungeon-gold/80 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
});
