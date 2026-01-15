/**
 * QuestionMark component - displays a question mark for uncertain tiles.
 * @module components/game/QuestionMark
 *
 * Design System: .specify/reference/design-system/04-tiles.css
 */

import { memo } from 'react';

/**
 * Displays an animated wobbling question mark with mystic glow.
 */
export const QuestionMark = memo(function QuestionMark() {
  return (
    <span
      className="select-none"
      style={{
        fontSize: '14px',
        fontFamily: "'Press Start 2P', monospace",
        color: 'var(--mystic-bright)',
        textShadow: '0 0 8px var(--mystic), 0 0 16px var(--mystic-dark)',
        animation: 'question-wobble 1s ease-in-out infinite',
      }}
    >
      ?
    </span>
  );
});
