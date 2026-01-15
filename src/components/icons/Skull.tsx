/**
 * Skull Icon - Monster/death indicator
 *
 * SVG icon (16x16 viewBox)
 * Source: .specify/reference/design-system/11-icons.md
 */

interface SkullProps {
  className?: string;
  size?: number;
}

export function Skull({ className = '', size = 16 }: SkullProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Head */}
      <rect x="3" y="1" width="10" height="9" rx="2" fill="var(--bone-light)" />
      {/* Left eye */}
      <rect x="4" y="4" width="3" height="3" fill="var(--blood-dark)" />
      {/* Right eye */}
      <rect x="9" y="4" width="3" height="3" fill="var(--blood-dark)" />
      {/* Nose */}
      <rect x="7" y="7" width="2" height="2" fill="var(--stone-700)" />
      {/* Jaw */}
      <rect x="4" y="10" width="8" height="2" fill="var(--bone)" />
      {/* Teeth */}
      <rect x="5" y="10" width="1" height="2" fill="var(--stone-700)" />
      <rect x="7" y="10" width="1" height="2" fill="var(--stone-700)" />
      <rect x="9" y="10" width="1" height="2" fill="var(--stone-700)" />
      {/* Crossed bones */}
      <rect
        x="1"
        y="13"
        width="14"
        height="2"
        fill="var(--bone)"
        transform="rotate(-20 8 14)"
      />
      <rect
        x="1"
        y="13"
        width="14"
        height="2"
        fill="var(--bone)"
        transform="rotate(20 8 14)"
      />
    </svg>
  );
}
