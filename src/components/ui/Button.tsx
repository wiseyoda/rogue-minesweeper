/**
 * Button - Primary and secondary button styles
 *
 * 3D bevel effect with hover/active states.
 * Source: .specify/reference/design-system/09-buttons.css
 */

import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  children,
  className = '',
  style,
  ...props
}: ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <button
      className={`relative overflow-hidden transition-all duration-100 ${className}`}
      style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '8px',
        padding: '10px 16px',
        border: 'none',
        cursor: 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        background: isPrimary
          ? 'linear-gradient(180deg, var(--gold-bright) 0%, var(--gold) 50%, var(--gold-dark) 100%)'
          : 'linear-gradient(180deg, var(--stone-700) 0%, var(--stone-800) 100%)',
        color: isPrimary ? 'var(--void)' : 'var(--bone)',
        boxShadow: isPrimary
          ? '0 4px 0 var(--gold-shadow), 0 6px 12px rgba(0, 0, 0, 0.4), inset 0 1px 0 var(--gold-glow)'
          : '0 3px 0 var(--stone-950), 0 4px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 var(--stone-600)',
        ...style,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-2px)';
        if (isPrimary) {
          el.style.boxShadow =
            '0 6px 0 var(--gold-shadow), 0 8px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 var(--gold-glow), 0 0 20px var(--gold)';
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(0)';
        if (isPrimary) {
          el.style.boxShadow =
            '0 4px 0 var(--gold-shadow), 0 6px 12px rgba(0, 0, 0, 0.4), inset 0 1px 0 var(--gold-glow)';
        }
      }}
      onMouseDown={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(2px)';
        el.style.boxShadow = isPrimary
          ? '0 2px 0 var(--gold-shadow), 0 3px 6px rgba(0, 0, 0, 0.4), inset 0 1px 0 var(--gold-glow)'
          : '0 1px 0 var(--stone-950), 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 var(--stone-600)';
      }}
      onMouseUp={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-2px)';
        if (isPrimary) {
          el.style.boxShadow =
            '0 6px 0 var(--gold-shadow), 0 8px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 var(--gold-glow), 0 0 20px var(--gold)';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}
