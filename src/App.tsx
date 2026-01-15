import { useEffect, useMemo } from 'react';
import { useGameStore } from '@/stores';
import { GameBoard } from '@/components/game';
import { HUD } from '@/components/hud';
import type { GameMessage } from '@/components/hud';

/**
 * Get game message based on current state.
 */
function getGameMessage(
  phase: string,
  gameOver: boolean,
  isFirstClick: boolean
): GameMessage | null {
  if (gameOver) {
    return { text: 'Game Over - Hit Monster!', type: 'danger' };
  }
  if (phase === 'shopping') {
    return { text: 'Level Complete!', type: 'success' };
  }
  if (isFirstClick) {
    return { text: 'Click any cell to start', type: 'info' };
  }
  return null;
}

function App() {
  // Read state from store
  const run = useGameStore((state) => state.run);
  const gameOver = useGameStore((state) => state.gameOver);

  // Get actions
  const startNewRun = useGameStore((state) => state.startNewRun);
  const startLevel = useGameStore((state) => state.startLevel);

  // Initialize game on mount
  useEffect(() => {
    // If no game in progress, start level 1
    if (run.phase === 'playing' && run.isFirstClick) {
      startLevel(1);
    }
  }, [run.phase, run.isFirstClick, startLevel]);

  /**
   * Reset the game to initial state.
   */
  function handleReset(): void {
    startNewRun();
    startLevel(1);
  }

  // Memoize message to prevent unnecessary re-renders
  const message = useMemo(
    () => getGameMessage(run.phase, gameOver, run.isFirstClick),
    [run.phase, gameOver, run.isFirstClick]
  );

  return (
    <div className="min-h-screen bg-dungeon-parchment flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-cinzel text-dungeon-blood tracking-widest mb-2">
        DUNGEON DELVER
      </h1>
      <p className="text-dungeon-stone text-sm mb-6">Core Logic POC</p>

      {/* HUD - Heads Up Display */}
      <div className="mb-4 w-full max-w-md">
        <HUD message={message} />
      </div>

      {/* Game Board */}
      <GameBoard />

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="mt-6 px-6 py-2 bg-dungeon-stone text-dungeon-parchment font-cinzel rounded hover:bg-dungeon-stone/80 transition-colors"
      >
        New Game
      </button>

      {/* Instructions */}
      <div className="mt-6 text-dungeon-stone text-sm text-center max-w-md">
        <p>
          <strong>Left-click</strong>: Reveal cell
        </p>
        <p>
          <strong>Right-click</strong>: Flag cell (F → ? → none)
        </p>
        <p>
          <strong>Long press</strong> (touch): Flag cell
        </p>
        <p className="mt-2 text-xs">
          Reveal all safe cells without hitting a monster to win!
        </p>
      </div>
    </div>
  );
}

export default App;
