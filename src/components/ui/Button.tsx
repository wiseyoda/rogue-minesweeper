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

  const primaryBoxShadow =
    'inset 2px 2px 0 var(--gold-glow), inset -2px -2px 0 var(--gold-shadow), 0 6px 0 var(--void)';
  const primaryHoverBoxShadow =
    'inset 2px 2px 0 var(--gold-glow), inset -2px -2px 0 var(--gold-shadow), 0 8px 0 var(--void), 0 0 20px var(--gold-shadow)';
  const primaryActiveBoxShadow =
    'inset 2px 2px 0 var(--gold-shadow), inset -2px -2px 0 var(--gold-glow), 0 2px 0 var(--void)';

  const secondaryBoxShadow =
    'inset 1px 1px 0 var(--stone-600), inset -1px -1px 0 var(--stone-900), 0 3px 0 var(--void)';

  return (
    <button
      className={`relative overflow-hidden transition-all duration-100 ${className}`}
      style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '8px',
        padding: '12px 16px',
        cursor: 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        background: isPrimary
          ? 'linear-gradient(180deg, var(--gold) 0%, var(--gold-dark) 100%)'
          : 'linear-gradient(180deg, var(--stone-700) 0%, var(--stone-800) 100%)',
        color: isPrimary ? 'var(--void)' : 'var(--bone)',
        border: isPrimary
          ? '3px solid'
          : '2px solid var(--stone-600)',
        borderColor: isPrimary
          ? 'var(--gold-bright) var(--gold-shadow) var(--gold-shadow) var(--gold-bright)'
          : undefined,
        boxShadow: isPrimary ? primaryBoxShadow : secondaryBoxShadow,
        textShadow: isPrimary ? '1px 1px 0 var(--gold-shadow)' : 'none',
        ...style,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-2px)';
        if (isPrimary) {
          el.style.background = 'linear-gradient(180deg, var(--gold-bright) 0%, var(--gold) 100%)';
          el.style.boxShadow = primaryHoverBoxShadow;
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(0)';
        if (isPrimary) {
          el.style.background = 'linear-gradient(180deg, var(--gold) 0%, var(--gold-dark) 100%)';
          el.style.boxShadow = primaryBoxShadow;
        }
      }}
      onMouseDown={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(4px)';
        el.style.boxShadow = isPrimary ? primaryActiveBoxShadow : secondaryBoxShadow;
      }}
      onMouseUp={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-2px)';
        if (isPrimary) {
          el.style.boxShadow = primaryHoverBoxShadow;
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}
