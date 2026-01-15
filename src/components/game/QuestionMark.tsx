/**
 * QuestionMark component - displays a question mark for uncertain tiles.
 * @module components/game/QuestionMark
 */

import { memo } from 'react';

/**
 * Displays a question mark icon in dungeon-amber color.
 */
export const QuestionMark = memo(function QuestionMark() {
  return (
    <span className="text-dungeon-amber font-bold text-lg select-none">?</span>
  );
});
