import { useEffect, useMemo } from 'react';
import { useGameStore } from '@/stores';
import { GameContainer } from '@/components/game';
import { Sidebar } from '@/components/sidebar';
import { GameTitle, Button } from '@/components/ui';
import {
  BrickPattern,
  Vignette,
  MysticAura,
  ParticleField,
  Scanlines,
} from '@/components/atmosphere';
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
    <>
      {/* Atmosphere layers */}
      <BrickPattern />
      <Vignette />
      <MysticAura />
      <ParticleField />
      <Scanlines />

      {/* Main content */}
      <div
        className="relative min-h-screen flex flex-col items-center p-8"
        style={{ zIndex: 10 }}
      >
        {/* Title */}
        <div className="mb-8">
          <GameTitle title="DUNGEON DELVER" subtitle="Roguelike Minesweeper" />
        </div>

        {/* Two-column layout */}
        <div
          className="flex gap-8 items-start"
          style={{
            flexDirection: 'row',
          }}
        >
          {/* Game Container - Board and Modals */}
          <main>
            <GameContainer message={message} />
          </main>

          {/* Sidebar - DM Panel, Vitals, Runes */}
          <Sidebar />
        </div>

        {/* Footer controls */}
        <div className="mt-8 flex gap-4">
          <Button variant="secondary" onClick={handleReset}>
            New Game
          </Button>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 860px) {
          .flex.gap-8 {
            flex-direction: column !important;
            align-items: center;
          }
        }
      `}</style>
    </>
  );
}

export default App;
