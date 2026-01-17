/**
 * Panel - Container with dungeon styling
 *
 * Gradient background with gold corner accents.
 * Source: .specify/reference/design-system/05-panels.css
 */

import type { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'dm';
}

export function Panel({ children, className = '', variant = 'default' }: PanelProps) {
  const isDM = variant === 'dm';

  return (
    <div
      className={`relative ${className}`}
      style={{
        background: isDM
          ? 'linear-gradient(180deg, var(--mystic-void) 0%, var(--stone-900) 100%)'
          : 'linear-gradient(180deg, var(--stone-800) 0%, var(--stone-850) 100%)',
        border: `3px solid ${isDM ? 'var(--mystic-dark)' : 'var(--stone-600)'}`,
        boxShadow: isDM
          ? 'inset 0 1px 0 var(--mystic-shadow), inset 0 -1px 0 var(--stone-950), 0 4px 12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(112, 48, 176, 0.2)'
          : 'inset 0 1px 0 var(--stone-700), inset 0 -1px 0 var(--stone-950), 0 4px 12px rgba(0, 0, 0, 0.5)',
        padding: '12px',
      }}
    >
      {/* Corner accents */}
      <span
        className="absolute transition-all duration-200"
        style={{
          top: '-3px',
          left: '-3px',
          width: '8px',
          height: '8px',
          borderTop: `2px solid ${isDM ? 'var(--mystic-bright)' : 'var(--gold)'}`,
          borderLeft: `2px solid ${isDM ? 'var(--mystic-bright)' : 'var(--gold)'}`,
        }}
      />
      <span
        className="absolute transition-all duration-200"
        style={{
          top: '-3px',
          right: '-3px',
          width: '8px',
          height: '8px',
          borderTop: `2px solid ${isDM ? 'var(--mystic-bright)' : 'var(--gold)'}`,
          borderRight: `2px solid ${isDM ? 'var(--mystic-bright)' : 'var(--gold)'}`,
        }}
      />
      <span
        className="absolute transition-all duration-200"
        style={{
          bottom: '-3px',
          left: '-3px',
          width: '8px',
          height: '8px',
          borderBottom: `2px solid ${isDM ? 'var(--mystic-bright)' : 'var(--gold)'}`,
          borderLeft: `2px solid ${isDM ? 'var(--mystic-bright)' : 'var(--gold)'}`,
        }}
      />
      <span
        className="absolute transition-all duration-200"
        style={{
          bottom: '-3px',
          right: '-3px',
          width: '8px',
          height: '8px',
          borderBottom: `2px solid ${isDM ? 'var(--mystic-bright)' : 'var(--gold)'}`,
          borderRight: `2px solid ${isDM ? 'var(--mystic-bright)' : 'var(--gold)'}`,
        }}
      />
      {children}
    </div>
  );
}
