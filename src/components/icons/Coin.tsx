/**
 * Coin Icon - Gold currency indicator
 *
 * SVG icon (20x20 viewBox)
 * Source: .specify/reference/design-system/11-icons.md
 */

interface CoinProps {
  className?: string;
  size?: number;
}

export function Coin({ className = '', size = 20 }: CoinProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Outer ring */}
      <circle cx="10" cy="10" r="9" fill="var(--gold)" />
      {/* Inner ring */}
      <circle cx="10" cy="10" r="7" fill="var(--gold-dark)" />
      {/* Inner highlight */}
      <circle cx="10" cy="10" r="5" fill="var(--gold)" />
      {/* $ symbol */}
      <text
        x="10"
        y="14"
        textAnchor="middle"
        fontSize="10"
        fontWeight="bold"
        fill="var(--gold-shadow)"
        fontFamily="monospace"
      >
        $
      </text>
    </svg>
  );
}
