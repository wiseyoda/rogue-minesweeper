/**
 * Sidebar - Main sidebar container
 *
 * Composes DMPanel, VitalsPanel, RunesPanel, and ActionButton.
 */

import { useGameStore } from '@/stores/gameStore';
import { DMPanel } from './DMPanel';
import { VitalsPanel } from './VitalsPanel';
import { RunesPanel } from './RunesPanel';
import { ActionButton } from './ActionButton';

export function Sidebar() {
  const lives = useGameStore((state) => state.player.lives);
  const maxLives = useGameStore((state) => state.player.maxLives);
  const gold = useGameStore((state) => state.player.gold);
  const shields = useGameStore((state) => state.player.shields);
  const level = useGameStore((state) => state.run.level);
  const activeBuffs = useGameStore((state) => state.player.activeBuffs);
  const startNewRun = useGameStore((state) => state.startNewRun);
  const phase = useGameStore((state) => state.run.phase);

  const handleNewGame = () => {
    startNewRun();
  };

  return (
    <aside
      className="flex flex-col gap-4"
      style={{ width: '280px' }}
    >
      <DMPanel />
      <VitalsPanel
        health={lives}
        maxHealth={maxLives}
        gold={gold}
        shields={shields}
        floor={level}
      />
      <RunesPanel buffs={activeBuffs} />
      {phase === 'gameOver' && (
        <ActionButton onClick={handleNewGame}>
          New Game
        </ActionButton>
      )}
    </aside>
  );
}
