/**
 * GameContainer component - wraps game board with panel and modals.
 * @module components/game/GameContainer
 *
 * Design System: .specify/reference/design-system/10-layout.css
 */

import { memo, useCallback, useMemo } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { GameBoard } from './GameBoard';
import { Panel, WinModal, GameOverModal } from '../ui';
import { FloorShop } from '../shop';
import { getFloorConfig } from '@/engine/difficulty';
import type { GameMessage } from '../hud';

/**
 * Props for GameContainer component.
 */
export interface GameContainerProps {
  /** Current game message to display (unused in new design, kept for compatibility) */
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
const selectShopItems = (state: ReturnType<typeof useGameStore.getState>) =>
  state.run.shopItems;
const selectPurchasedIds = (state: ReturnType<typeof useGameStore.getState>) =>
  state.run.purchasedIds;
const selectShowShop = (state: ReturnType<typeof useGameStore.getState>) =>
  state.run.showShop;
const selectGenerateShop = (state: ReturnType<typeof useGameStore.getState>) =>
  state.generateShop;
const selectPurchaseItem = (state: ReturnType<typeof useGameStore.getState>) =>
  state.purchaseItem;
const selectRerollShop = (state: ReturnType<typeof useGameStore.getState>) =>
  state.rerollShop;
const selectSetShowShop = (state: ReturnType<typeof useGameStore.getState>) =>
  state.setShowShop;

/**
 * Container that composes Panel, GameBoard, and modal overlays.
 * Handles game state transitions via modals.
 */
export const GameContainer = memo(function GameContainer({
  message: _message,
}: GameContainerProps) {
  void _message; // Message now displayed in DM Panel instead of HUD

  // Read state from store
  const run = useGameStore(selectRun);
  const gameOver = useGameStore(selectGameOver);
  const playerGold = useGameStore(selectPlayerGold);
  const monsterCount = useGameStore(selectMonsterCount);
  const shopItems = useGameStore(selectShopItems);
  const purchasedIds = useGameStore(selectPurchasedIds);
  const showShop = useGameStore(selectShowShop);

  // Get actions
  const startNewRun = useGameStore(selectStartNewRun);
  const startLevel = useGameStore(selectStartLevel);
  const generateShop = useGameStore(selectGenerateShop);
  const purchaseItem = useGameStore(selectPurchaseItem);
  const rerollShop = useGameStore(selectRerollShop);
  const setShowShop = useGameStore(selectSetShowShop);

  // Calculate monsters avoided (total monsters - monsters hit this level)
  const monstersAvoided = monsterCount - run.damageTakenThisLevel;

  // Get floor bonus for current level
  const floorBonus = useMemo(() => getFloorConfig(run.level).goldBonus, [run.level]);

  // Handlers
  const handleEnterShop = useCallback(() => {
    generateShop();
    setShowShop(true);
  }, [generateShop, setShowShop]);

  const handlePurchase = useCallback(
    (itemId: string) => {
      purchaseItem(itemId);
    },
    [purchaseItem]
  );

  const handleReroll = useCallback(() => {
    rerollShop();
  }, [rerollShop]);

  const handleShopContinue = useCallback(() => {
    setShowShop(false);
    startLevel(run.level + 1);
  }, [setShowShop, startLevel, run.level]);

  const handleRetry = useCallback(() => {
    startNewRun();
    startLevel(1);
  }, [startNewRun, startLevel]);

  // Show win modal when phase is 'shopping' and shop not yet open
  const showWinModal = run.phase === 'shopping' && !showShop;

  // Show game over modal when game over flag is set
  const showGameOverModal = gameOver;

  return (
    <>
      {/* Game Board wrapped in Panel */}
      <Panel>
        <GameBoard />
      </Panel>

      {/* Win Modal - Level Complete */}
      {showWinModal && (
        <WinModal
          tilesRevealed={run.revealedCount}
          goldCollected={run.revealedCount} // 1 gold per tile revealed
          monstersAvoided={monstersAvoided}
          floorBonus={floorBonus}
          onEnterShop={handleEnterShop}
        />
      )}

      {/* Floor Shop Modal */}
      {showShop && run.phase === 'shopping' && (
        <FloorShop
          items={shopItems}
          gold={playerGold}
          purchasedIds={purchasedIds}
          onPurchase={handlePurchase}
          onReroll={handleReroll}
          onContinue={handleShopContinue}
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
