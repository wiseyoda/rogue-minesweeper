/**
 * HighScores - Display player's best performances and statistics.
 * @module components/ui/HighScores
 */

import { memo } from 'react';
import { useMetaStore } from '@/stores/metaStore';
import { Panel } from './Panel';
import { FortuneIcon } from '../icons';
import { Skull } from '../icons';

/**
 * Format large numbers with commas.
 */
function formatNumber(value: number): string {
  return value.toLocaleString();
}

interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  highlight?: boolean;
}

function StatRow({ icon, label, value, highlight = false }: StatRowProps) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: '8px 0',
        borderBottom: '1px solid var(--stone-700)',
      }}
    >
      <div className="flex items-center gap-2">
        <span style={{ opacity: highlight ? 1 : 0.7 }}>{icon}</span>
        <span
          style={{
            fontSize: '11px',
            color: 'var(--bone)',
          }}
        >
          {label}
        </span>
      </div>
      <span
        style={{
          fontSize: '12px',
          fontWeight: 'bold',
          color: highlight ? 'var(--gold)' : 'var(--bone)',
          textShadow: highlight ? '0 0 8px var(--gold-dark)' : 'none',
        }}
      >
        {typeof value === 'number' ? formatNumber(value) : value}
      </span>
    </div>
  );
}

/**
 * Trophy icon for "best" stats.
 */
function TrophyIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      {/* Cup body */}
      <rect x="6" y="3" width="12" height="10" fill="var(--gold)" />
      {/* Cup handles */}
      <rect x="2" y="5" width="4" height="6" fill="var(--gold-dark)" />
      <rect x="18" y="5" width="4" height="6" fill="var(--gold-dark)" />
      {/* Cup base stem */}
      <rect x="10" y="13" width="4" height="4" fill="var(--gold-dark)" />
      {/* Cup base */}
      <rect x="7" y="17" width="10" height="3" fill="var(--gold)" />
      {/* Shine */}
      <rect x="8" y="5" width="2" height="4" fill="var(--gold-bright)" opacity="0.6" />
    </svg>
  );
}

/**
 * Scroll icon for total runs.
 */
function ScrollIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <rect x="5" y="4" width="14" height="16" fill="var(--bone)" />
      <rect x="4" y="2" width="16" height="4" rx="2" fill="var(--bone-dark)" />
      <rect x="4" y="18" width="16" height="4" rx="2" fill="var(--bone-dark)" />
      {/* Text lines */}
      <rect x="7" y="8" width="10" height="1" fill="var(--stone-500)" />
      <rect x="7" y="11" width="8" height="1" fill="var(--stone-500)" />
      <rect x="7" y="14" width="10" height="1" fill="var(--stone-500)" />
    </svg>
  );
}

/**
 * Coin stack icon for total gold.
 */
function CoinStackIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <ellipse cx="12" cy="18" rx="8" ry="2.5" fill="var(--gold-dark)" />
      <ellipse cx="12" cy="17" rx="8" ry="2.5" fill="var(--gold)" />
      <ellipse cx="12" cy="13" rx="7" ry="2" fill="var(--gold-dark)" />
      <ellipse cx="12" cy="12" rx="7" ry="2" fill="var(--gold)" />
      <ellipse cx="12" cy="8" rx="6" ry="1.5" fill="var(--gold-dark)" />
      <ellipse cx="12" cy="7" rx="6" ry="1.5" fill="var(--gold-bright)" />
    </svg>
  );
}

export interface HighScoresProps {
  /** Optional callback when close button is clicked */
  onClose?: () => void;
}

/**
 * Display player's high scores and statistics.
 */
export const HighScores = memo(function HighScores({ onClose }: HighScoresProps) {
  const stats = useMetaStore((s) => s.stats);

  return (
    <Panel className="w-64">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2
          style={{
            fontSize: '14px',
            color: 'var(--gold)',
            textShadow: '0 0 8px var(--gold-dark)',
          }}
        >
          HALL OF FAME
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--stone-700)',
              border: '1px solid var(--stone-600)',
              color: 'var(--bone)',
              fontSize: '12px',
              cursor: 'pointer',
            }}
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={{ marginTop: '8px' }}>
        <StatRow
          icon={<TrophyIcon size={16} />}
          label="Best Floor"
          value={stats.highestLevelOverall}
          highlight
        />
        <StatRow
          icon={<FortuneIcon size={16} />}
          label="Best Run Gold"
          value={stats.maxGoldRun}
          highlight
        />
        <StatRow
          icon={<ScrollIcon size={16} />}
          label="Total Runs"
          value={stats.totalRuns}
        />
        <StatRow
          icon={<CoinStackIcon size={16} />}
          label="Lifetime Gold"
          value={stats.totalGoldEarned}
        />
        {stats.totalDeaths !== undefined && stats.totalDeaths > 0 && (
          <StatRow
            icon={<Skull size={16} />}
            label="Deaths"
            value={stats.totalDeaths}
          />
        )}
      </div>
    </Panel>
  );
});
