/**
 * Heart Icon - Health indicator
 *
 * SVG icon (16x16 viewBox)
 * Source: .specify/reference/design-system/11-icons.md
 */

interface HeartProps {
  className?: string;
  size?: number;
}

export function Heart({ className = '', size = 16 }: HeartProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M8 14 L2 8 Q0 6 0 4 Q0 1 3 1 Q5 1 6 3 L8 5 L10 3 Q11 1 13 1 Q16 1 16 4 Q16 6 14 8 Z"
        fill="var(--blood)"
      />
      {/* Highlight */}
      <path
        d="M4 3 Q3 3 3 4 Q3 5 4 5 Q5 5 5 4 Q5 3 4 3"
        fill="var(--blood-bright)"
        opacity="0.6"
      />
    </svg>
  );
}
