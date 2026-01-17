/**
 * RunStats - Display current run stats with personal best comparison.
 * @module components/ui/RunStats
 */

import { memo } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useMetaStore } from '@/stores/metaStore';
import { Panel } from './Panel';

/**
 * Comparison indicator arrow.
 */
function ComparisonArrow({ type }: { type: 'up' | 'down' | 'equal' }) {
  if (type === 'up') {
    return (
      <span
        style={{
          color: 'var(--venom)',
          fontSize: '10px',
          marginLeft: '4px',
        }}
        title="New personal best!"
      >
        ▲
      </span>
    );
  }
  if (type === 'down') {
    return (
      <span
        style={{
          color: 'var(--stone-500)',
          fontSize: '10px',
          marginLeft: '4px',
        }}
      >
        ▼
      </span>
    );
  }
  return (
    <span
      style={{
        color: 'var(--gold)',
        fontSize: '10px',
        marginLeft: '4px',
      }}
      title="Tied with personal best"
    >
      ★
    </span>
  );
}

interface StatCompareProps {
  label: string;
  current: number;
  best: number;
}

function StatCompare({ label, current, best }: StatCompareProps) {
  const comparison = current > best ? 'up' : current === best ? 'equal' : 'down';
  const isNewBest = current > best;

  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: '4px 0',
      }}
    >
      <span
        style={{
          fontSize: '10px',
          color: 'var(--stone-400)',
        }}
      >
        {label}
      </span>
      <div className="flex items-center">
        <span
          style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: isNewBest ? 'var(--venom)' : 'var(--bone)',
          }}
        >
          {current.toLocaleString()}
        </span>
        <ComparisonArrow type={comparison} />
      </div>
    </div>
  );
}

/**
 * Compact run stats for sidebar.
 * Shows current level and gold with comparison to personal best.
 */
export const RunStats = memo(function RunStats() {
  const level = useGameStore((s) => s.run.level);
  const gold = useGameStore((s) => s.player.gold);
  const bestLevel = useMetaStore((s) => s.stats.highestLevelOverall);
  const bestGold = useMetaStore((s) => s.stats.maxGoldRun);

  return (
    <Panel>
      <div
        style={{
          fontSize: '10px',
          color: 'var(--gold)',
          marginBottom: '4px',
          textAlign: 'center',
        }}
      >
        RUN PROGRESS
      </div>
      <StatCompare label="Floor" current={level} best={bestLevel} />
      <StatCompare label="Gold" current={gold} best={bestGold} />
      <div
        style={{
          fontSize: '8px',
          color: 'var(--stone-500)',
          textAlign: 'center',
          marginTop: '4px',
        }}
      >
        Best: Floor {bestLevel} • {bestGold.toLocaleString()}g
      </div>
    </Panel>
  );
});
