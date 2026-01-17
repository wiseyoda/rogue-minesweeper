/**
 * QuestionIcon - Styled ? for question-marked tiles
 *
 * Animated wobbling question mark with mystic glow.
 * Source: .specify/reference/design-system/04-tiles.css
 */

interface QuestionIconProps {
  className?: string;
}

export function QuestionIcon({ className = '' }: QuestionIconProps) {
  return (
    <span
      className={`inline-block ${className}`}
      style={{
        fontSize: '14px',
        color: 'var(--mystic-bright)',
        textShadow: '0 0 8px var(--mystic), 0 0 16px var(--mystic-dark)',
        animation: 'question-wobble 1s ease-in-out infinite',
      }}
      aria-hidden="true"
    >
      ?
    </span>
  );
}
