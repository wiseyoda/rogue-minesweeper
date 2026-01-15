/**
 * ResourceCard - Display for gold, shields, etc.
 *
 * Card with icon, value, and label.
 * Source: .specify/reference/design-system/07-vitals-panel.css
 */

import { ReactNode } from 'react';

interface ResourceCardProps {
  icon: ReactNode;
  value: number | string;
  label: string;
  variant?: 'gold' | 'shield' | 'default';
}

export function ResourceCard({
  icon,
  value,
  label,
  variant = 'default',
}: ResourceCardProps) {
  const borderColor =
    variant === 'gold'
      ? 'var(--gold-dark)'
      : variant === 'shield'
        ? 'var(--ice-dark)'
        : 'var(--stone-600)';

  const hoverBorderColor =
    variant === 'gold'
      ? 'var(--gold)'
      : variant === 'shield'
        ? 'var(--ice)'
        : 'var(--stone-500)';

  return (
    <div
      className="flex flex-col items-center transition-all duration-200"
      style={{
        background: 'var(--stone-850)',
        border: `2px solid ${borderColor}`,
        padding: '8px',
        minWidth: '60px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = hoverBorderColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = borderColor;
      }}
    >
      <div className="mb-1" style={{ fontSize: '16px' }}>
        {icon}
      </div>
      <div
        style={{
          fontSize: '10px',
          color:
            variant === 'gold'
              ? 'var(--gold-bright)'
              : variant === 'shield'
                ? 'var(--ice-bright)'
                : 'var(--bone-light)',
          textShadow:
            variant === 'gold'
              ? '0 0 8px var(--gold)'
              : variant === 'shield'
                ? '0 0 8px var(--ice)'
                : 'none',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: '6px',
          color: 'var(--stone-400)',
          marginTop: '4px',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
    </div>
  );
}
