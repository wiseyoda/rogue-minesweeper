/**
 * SegmentedBar - Health/Shield display
 *
 * Segmented bar with individual fill segments.
 * Source: .specify/reference/design-system/07-vitals-panel.css
 */

interface SegmentedBarProps {
  current: number;
  max: number;
  variant?: 'health' | 'shield';
  critical?: boolean;
}

export function SegmentedBar({
  current,
  max,
  variant = 'health',
  critical = false,
}: SegmentedBarProps) {
  const segments = Array.from({ length: max }, (_, i) => i < current);
  const isHealth = variant === 'health';

  return (
    <div
      className="flex"
      style={{
        gap: '2px',
        animation: critical && isHealth ? 'health-critical 0.4s ease-in-out infinite' : undefined,
      }}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`${variant}: ${current} of ${max}`}
    >
      {segments.map((filled, i) => (
        <div
          key={i}
          style={{
            width: '16px',
            height: '10px',
            background: filled
              ? isHealth
                ? 'linear-gradient(180deg, var(--blood-bright) 0%, var(--blood) 50%, var(--blood-dark) 100%)'
                : 'linear-gradient(180deg, var(--ice-bright) 0%, var(--ice) 50%, var(--ice-dark) 100%)'
              : 'var(--stone-850)',
            boxShadow: filled
              ? isHealth
                ? 'inset 0 1px 0 var(--blood-glow), inset 0 -1px 0 var(--blood-shadow)'
                : 'inset 0 1px 0 var(--ice-bright), inset 0 -1px 0 var(--ice-dark)'
              : 'inset 0 1px 0 var(--stone-800)',
          }}
        />
      ))}
    </div>
  );
}
