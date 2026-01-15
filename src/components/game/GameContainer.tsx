/**
 * GameContainer component - wraps game board with HUD and modals.
 * @module components/game/GameContainer
 */

import { memo, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { GameBoard } from './GameBoard';
import { HUD } from '../hud';
import { WinModal, GameOverModal } from '../ui';
import type { GameMessage } from '../hud';

/**
 * Props for GameContainer component.
 */
export interface GameContainerProps {
  /** Current game message to display in HUD */
  message: GameMessage | null;
}

// Granular selectors for optimal re-renders
const selectRun = (state: ReturnType<typeof useGameStore.getState>) => state.run;
const selectGameOver = (state: ReturnType<typeof useGameStore.getState>) =>
  state.gameOver;
const selectPlayerGold = (state: ReturnType<typeof useGameStore.getState>) =>
  state.player.gold;
const selectMonsterCount = (state: ReturnType<typeof useGameStore.getState>) =>
  state.gridConfig.monsterCount;
const selectStartNewRun = (state: ReturnType<typeof useGameStore.getState>) =>
  state.startNewRun;
const selectStartLevel = (state: ReturnType<typeof useGameStore.getState>) =>
  state.startLevel;

/**
 * Container that composes HUD, GameBoard, and modal overlays.
 * Handles game state transitions via modals.
 */
export const GameContainer = memo(function GameContainer({
  message,
}: GameContainerProps) {
  // Read state from store
  const run = useGameStore(selectRun);
  const gameOver = useGameStore(selectGameOver);
  const playerGold = useGameStore(selectPlayerGold);
  const monsterCount = useGameStore(selectMonsterCount);

  // Get actions
  const startNewRun = useGameStore(selectStartNewRun);
  const startLevel = useGameStore(selectStartLevel);

  // Calculate monsters avoided (total monsters - monsters hit this level)
  const monstersAvoided = monsterCount - run.damageTakenThisLevel;

  // Handlers
  const handleContinue = useCallback(() => {
    startLevel(run.level + 1);
  }, [startLevel, run.level]);

  const handleRetry = useCallback(() => {
    startNewRun();
    startLevel(1);
  }, [startNewRun, startLevel]);

  // Show win modal when phase is 'shopping' (level complete)
  const showWinModal = run.phase === 'shopping';

  // Show game over modal when game over flag is set
  const showGameOverModal = gameOver;

  return (
    <>
      {/* HUD - Heads Up Display */}
      <div className="mb-4 w-full max-w-md">
        <HUD message={message} />
      </div>

      {/* Game Board */}
      <GameBoard />

      {/* Win Modal - Level Complete */}
      {showWinModal && (
        <WinModal
          tilesRevealed={run.revealedCount}
          goldCollected={run.revealedCount} // 1 gold per tile revealed
          monstersAvoided={monstersAvoided}
          onContinue={handleContinue}
        />
      )}

      {/* Game Over Modal */}
      {showGameOverModal && (
        <GameOverModal
          levelReached={run.level}
          totalGold={playerGold}
          tilesRevealed={run.revealedCount}
          monstersFlagged={run.flagsPlaced}
          damageTaken={run.totalDamageTaken}
          onRetry={handleRetry}
        />
      )}
    </>
  );
});
