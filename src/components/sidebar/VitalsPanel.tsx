/**
 * VitalsPanel - Health, gold, shields, and floor display
 *
 * Source: .specify/reference/design-system/07-vitals-panel.css
 */

import { Panel } from '../ui/Panel';
import { SegmentedBar } from '../ui/SegmentedBar';
import { ResourceCard } from '../ui/ResourceCard';
import { Coin, Shield, Heart } from '../icons';

interface VitalsPanelProps {
  health: number;
  maxHealth: number;
  gold: number;
  shields: number;
  floor: number;
}

export function VitalsPanel({
  health,
  maxHealth,
  gold,
  shields,
  floor,
}: VitalsPanelProps) {
  const isCritical = health / maxHealth < 0.25;

  return (
    <Panel>
      {/* Health section */}
      <div style={{ marginBottom: '16px' }}>
        <div className="flex items-center gap-2 mb-2">
          <Heart size={12} />
          <span
            style={{
              fontSize: '6px',
              color: 'var(--stone-300)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            Health
          </span>
        </div>
        <SegmentedBar
          current={health}
          max={maxHealth}
          variant="health"
          critical={isCritical}
        />
      </div>

      {/* Resources grid */}
      <div className="grid grid-cols-3 gap-2">
        <ResourceCard
          icon={<Coin size={16} />}
          value={gold}
          label="Gold"
          variant="gold"
        />
        <ResourceCard
          icon={<Shield size={16} />}
          value={shields}
          label="Shield"
          variant="shield"
        />
        <ResourceCard
          icon={
            <span
              style={{
                fontSize: '11px',
                color: 'var(--mystic-bright)',
                textShadow: '0 0 8px var(--mystic)',
              }}
            >
              {floor}
            </span>
          }
          value=""
          label="Floor"
          variant="default"
        />
      </div>
    </Panel>
  );
}
