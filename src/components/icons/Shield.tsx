/**
 * Shield Icon - Defense indicator
 *
 * SVG icon (20x20 viewBox)
 * Source: .specify/reference/design-system/11-icons.md
 */

interface ShieldProps {
  className?: string;
  size?: number;
}

export function Shield({ className = '', size = 20 }: ShieldProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Outer shield */}
      <path
        d="M10 1 L18 4 L18 10 Q18 16 10 19 Q2 16 2 10 L2 4 Z"
        fill="var(--ice)"
      />
      {/* Inner shield */}
      <path
        d="M10 3 L16 5.5 L16 10 Q16 14.5 10 17 Q4 14.5 4 10 L4 5.5 Z"
        fill="var(--ice-dark)"
      />
      {/* Highlight */}
      <path
        d="M10 5 L14 7 L14 10 Q14 13 10 15 Q6 13 6 10 L6 7 Z"
        fill="var(--ice)"
        opacity="0.6"
      />
    </svg>
  );
}
