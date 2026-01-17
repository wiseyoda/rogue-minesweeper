import { useEffect, useMemo } from 'react';
import { useGameStore } from '@/stores';
import { useMetaStore } from '@/stores/metaStore';
import { GameContainer } from '@/components/game';
import { Sidebar } from '@/components/sidebar';
import { GameTitle } from '@/components/ui';
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
  const startLevel = useGameStore((state) => state.startLevel);

  // Initialize game on mount only
  useEffect(() => {
    // Sync upgrade definitions with persisted state (preserves progress, updates text/costs)
    useMetaStore.getState().initializeUpgrades();

    // Start level 1 on initial app load if grid doesn't exist yet
    const { grid } = useGameStore.getState();
    if (!grid && run.phase === 'playing') {
      startLevel(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

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
        className="relative min-h-screen flex flex-col items-center"
        style={{ zIndex: 10, padding: '16px' }}
      >
        {/* Title */}
        <div style={{ marginBottom: '20px' }}>
          <GameTitle title="DUNGEON DELVER" subtitle="Roguelike Minesweeper" />
        </div>

        {/* Two-column layout */}
        <div
          className="two-column-layout flex items-start"
          style={{
            flexDirection: 'row',
            gap: '16px',
          }}
        >
          {/* Game Container - Board and Modals */}
          <main>
            <GameContainer message={message} />
          </main>

          {/* Sidebar - DM Panel, Vitals, Runes */}
          <Sidebar />
        </div>

      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 860px) {
          .two-column-layout {
            flex-direction: column !important;
            align-items: center;
          }
        }
      `}</style>
    </>
  );
}

export default App;
