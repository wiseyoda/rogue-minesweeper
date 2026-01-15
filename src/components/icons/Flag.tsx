/**
 * Flag Icon - Gold flag for marking tiles
 *
 * SVG icon (16x16 viewBox)
 * Source: .specify/reference/design-system/11-icons.md
 */

interface FlagProps {
  className?: string;
  size?: number;
}

export function Flag({ className = '', size = 16 }: FlagProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Pole */}
      <rect x="3" y="2" width="2" height="12" fill="var(--gold-dark)" />
      {/* Flag */}
      <path d="M5 2 L13 5 L5 8 Z" fill="var(--gold)" />
      {/* Base */}
      <rect x="1" y="13" width="6" height="2" fill="var(--gold-dark)" />
    </svg>
  );
}
