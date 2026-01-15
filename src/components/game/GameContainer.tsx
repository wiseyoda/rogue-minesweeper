/**
 * GameContainer component - wraps game board with panel and modals.
 * @module components/game/GameContainer
 *
 * Design System: .specify/reference/design-system/10-layout.css
 */

import { memo, useCallback, useMemo } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useMetaStore } from '../../stores/metaStore';
import { GameBoard } from './GameBoard';
import { Panel, WinModal, GameOverModal, UpgradeShopModal } from '../ui';
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
const selectSetPhase = (state: ReturnType<typeof useGameStore.getState>) =>
  state.setPhase;
const selectRunPhase = (state: ReturnType<typeof useGameStore.getState>) =>
  state.run.phase;

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
  const runPhase = useGameStore(selectRunPhase);

  // Get actions
  const startNewRun = useGameStore(selectStartNewRun);
  const startLevel = useGameStore(selectStartLevel);
  const generateShop = useGameStore(selectGenerateShop);
  const purchaseItem = useGameStore(selectPurchaseItem);
  const rerollShop = useGameStore(selectRerollShop);
  const setShowShop = useGameStore(selectSetShowShop);
  const setPhase = useGameStore(selectSetPhase);

  // Meta store actions
  const addMetaGold = useMetaStore((state) => state.addMetaGold);
  const recordRunEnd = useMetaStore((state) => state.recordRunEnd);

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

  // Handler for GameOverModal Continue - transitions to upgrade shop
  const handleGameOverContinue = useCallback(() => {
    // Record run stats and transfer gold to meta gold
    recordRunEnd(run.level, playerGold);
    addMetaGold(playerGold);
    // Transition to upgrade shop phase
    setPhase('upgradeShop');
  }, [recordRunEnd, addMetaGold, setPhase, run.level, playerGold]);

  // Handler for UpgradeShopModal Continue - starts new run
  const handleUpgradeShopContinue = useCallback(() => {
    startNewRun();
    startLevel(1);
  }, [startNewRun, startLevel]);

  // Show win modal when phase is 'shopping' and shop not yet open
  const showWinModal = run.phase === 'shopping' && !showShop;

  // Show game over modal when game over flag is set and not in upgrade shop
  const showGameOverModal = gameOver && runPhase === 'gameOver';

  // Show upgrade shop modal when in upgradeShop phase
  const showUpgradeShopModal = runPhase === 'upgradeShop';

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
          onContinue={handleGameOverContinue}
        />
      )}

      {/* Upgrade Shop Modal */}
      {showUpgradeShopModal && (
        <UpgradeShopModal onContinue={handleUpgradeShopContinue} />
      )}
    </>
  );
});
