import { useEffect } from 'react';
import { useGameStore } from '@/stores';
import { GameBoard } from '@/components/game';

/**
 * Get game status display text.
 */
function getStatusText(
  phase: string,
  gameOver: boolean,
  isFirstClick: boolean
): string {
  if (gameOver) return 'Game Over - Hit Monster!';
  if (phase === 'shopping') return 'Level Complete!';
  if (isFirstClick) return 'Click any cell to start';
  return 'Playing';
}

/**
 * Get status text color.
 */
function getStatusColor(phase: string, gameOver: boolean): string {
  if (gameOver) return 'text-dungeon-blood';
  if (phase === 'shopping') return 'text-green-600';
  return 'text-dungeon-amber';
}

function App() {
  // Read state from store
  const run = useGameStore((state) => state.run);
  const gameOver = useGameStore((state) => state.gameOver);
  const gridConfig = useGameStore((state) => state.gridConfig);

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

  // Calculate progress
  const totalSafeCells =
    gridConfig.rows * gridConfig.cols - gridConfig.monsterCount;

  return (
    <div className="min-h-screen bg-dungeon-parchment flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-cinzel text-dungeon-blood tracking-widest mb-2">
        DUNGEON DELVER
      </h1>
      <p className="text-dungeon-stone text-sm mb-6">Core Logic POC</p>

      {/* Game Status */}
      <div className="mb-4 text-center">
        <p
          className={`text-xl font-bold ${getStatusColor(run.phase, gameOver)}`}
        >
          {getStatusText(run.phase, gameOver, run.isFirstClick)}
        </p>
        <p className="text-dungeon-stone text-sm mt-1">
          Progress: {run.revealedCount} / {totalSafeCells} cells revealed
        </p>
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
