/**
 * Sidebar - Main sidebar container
 *
 * Composes DMPanel, VitalsPanel, RunesPanel, and ActionButton.
 */

import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { DMPanel } from './DMPanel';
import { VitalsPanel } from './VitalsPanel';
import { RunesPanel } from './RunesPanel';
import { ActionButton } from './ActionButton';
import { Panel, RunStats, HighScores } from '../ui';
import { PeekScrollIcon, RobotIcon, FortuneIcon } from '../icons';

export function Sidebar() {
  const [showHighScores, setShowHighScores] = useState(false);
  const lives = useGameStore((state) => state.player.lives);
  const maxLives = useGameStore((state) => state.player.maxLives);
  const gold = useGameStore((state) => state.player.gold);
  const shields = useGameStore((state) => state.player.shields);
  const peekScrolls = useGameStore((state) => state.player.peekScrolls);
  const level = useGameStore((state) => state.run.level);
  const activeBuffs = useGameStore((state) => state.player.activeBuffs);
  const startNewRun = useGameStore((state) => state.startNewRun);
  const startLevel = useGameStore((state) => state.startLevel);
  const usePeekScroll = useGameStore((state) => state.usePeekScroll);
  const autoSolveStep = useGameStore((state) => state.autoSolveStep);
  const phase = useGameStore((state) => state.run.phase);

  const handleNewGame = () => {
    startNewRun();
    startLevel(1);
  };

  const handleAutoSolve = () => {
    const result = autoSolveStep();
    if (result.stuck) {
      console.log('[AutoSolver] Stuck - no certain moves found. Click a cell first to reveal numbers!');
    } else {
      console.log(`[AutoSolver] Revealed: ${result.revealed}, Flagged: ${result.flagged}`);
    }
  };

  const canUsePeekScroll = phase === 'playing' && peekScrolls > 0;

  return (
    <aside
      className="flex flex-col"
      style={{ width: '280px', gap: '12px' }}
    >
      <DMPanel />
      <VitalsPanel
        health={lives}
        maxHealth={maxLives}
        gold={gold}
        shields={shields}
        floor={level}
      />
      <RunStats />
      <RunesPanel buffs={activeBuffs} />
      {peekScrolls > 0 && (
        <Panel>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PeekScrollIcon size={20} />
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--bone)',
                }}
              >
                Peek Scrolls: {peekScrolls}
              </span>
            </div>
            <button
              onClick={usePeekScroll}
              disabled={!canUsePeekScroll}
              className="px-3 py-1 text-xs font-medium transition-colors rounded"
              style={{
                backgroundColor: canUsePeekScroll ? 'var(--mystic)' : 'var(--stone-700)',
                color: canUsePeekScroll ? 'var(--bone)' : 'var(--stone-500)',
                cursor: canUsePeekScroll ? 'pointer' : 'not-allowed',
              }}
            >
              Use
            </button>
          </div>
        </Panel>
      )}

      {/* Spacer to push actions to bottom */}
      <div style={{ flexGrow: 1 }} />

      {/* High Scores Overlay */}
      {showHighScores && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 300, background: 'rgba(5, 5, 10, 0.9)' }}
          onClick={() => setShowHighScores(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <HighScores onClose={() => setShowHighScores(false)} />
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {/* Dev: Auto-solve button */}
        <button
          onClick={handleAutoSolve}
          disabled={phase !== 'playing'}
          title="Auto-solve (dev tool)"
          style={{
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: phase === 'playing'
              ? 'linear-gradient(180deg, var(--stone-700) 0%, var(--stone-800) 100%)'
              : 'var(--stone-900)',
            border: '2px solid var(--stone-600)',
            cursor: phase === 'playing' ? 'pointer' : 'not-allowed',
            opacity: phase === 'playing' ? 1 : 0.5,
            boxShadow: 'inset 1px 1px 0 var(--stone-500), 0 3px 0 var(--void)',
          }}
        >
          <RobotIcon size={24} />
        </button>
        {/* High Scores button */}
        <button
          onClick={() => setShowHighScores(true)}
          title="High Scores"
          style={{
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(180deg, var(--stone-700) 0%, var(--stone-800) 100%)',
            border: '2px solid var(--gold-dark)',
            cursor: 'pointer',
            boxShadow: 'inset 1px 1px 0 var(--stone-500), 0 3px 0 var(--void)',
          }}
        >
          <FortuneIcon size={24} />
        </button>
        <div style={{ flex: 1 }}>
          <ActionButton onClick={handleNewGame}>
            New Game
          </ActionButton>
        </div>
      </div>
    </aside>
  );
}
