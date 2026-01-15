/**
 * Tile component - individual cell in the game grid.
 * @module components/game/Tile
 */

import { memo, useCallback } from 'react';
import type { Cell } from '@/types';
import { NumberDisplay } from './NumberDisplay';
import { FlagIcon } from './FlagIcon';
import { MonsterIcon } from './MonsterIcon';
import { QuestionMark } from './QuestionMark';

/**
 * Props for Tile component.
 */
export interface TileProps {
  /** Cell data for this tile */
  cell: Cell;
  /** Handler for left click (reveal) */
  onClick: () => void;
  /** Handler for right click (flag toggle) */
  onRightClick: () => void;
  /** Handler for long press on touch devices (flag toggle) */
  onLongPress: () => void;
  /** Whether interactions are disabled (game over) */
  disabled: boolean;
  /** Whether the game is over (affects monster display) */
  gameOver: boolean;
}

/**
 * Get the content to display inside the tile based on cell state.
 */
function getTileContent(cell: Cell, gameOver: boolean): React.ReactNode {
  // Unrevealed states
  if (!cell.isRevealed) {
    if (cell.isFlagged) return <FlagIcon />;
    if (cell.isQuestion) return <QuestionMark />;
    // Show monsters on game over
    if (gameOver && cell.isMonster) return <MonsterIcon />;
    return null;
  }

  // Revealed states
  if (cell.isMonster) return <MonsterIcon />;
  if (cell.adjacentMonsters > 0) {
    return <NumberDisplay count={cell.adjacentMonsters} />;
  }
  return null;
}

/**
 * Get the background color class based on cell state.
 */
function getTileBackground(cell: Cell, gameOver: boolean): string {
  // Show monsters with red background when game is lost
  if (gameOver && cell.isMonster) {
    return 'bg-dungeon-blood';
  }

  // Unrevealed
  if (!cell.isRevealed) {
    return 'bg-dungeon-stone hover:bg-dungeon-stone/80';
  }

  // Revealed monster
  if (cell.isMonster) {
    return 'bg-dungeon-blood';
  }

  // Revealed safe cell
  return 'bg-dungeon-parchment';
}

/**
 * Individual tile in the game grid.
 * Handles display of all cell states and click interactions.
 */
export const Tile = memo(function Tile({
  cell,
  onClick,
  onRightClick,
  // onLongPress is handled by parent wrapper component
  onLongPress: _onLongPress,
  disabled,
  gameOver,
}: TileProps) {
  void _onLongPress; // Suppress unused warning - parent handles long press
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (!disabled) {
        onRightClick();
      }
    },
    [disabled, onRightClick]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      onClick();
    }
  }, [disabled, onClick]);

  // Touch event handlers for long press
  const handleTouchStart = useCallback(() => {
    if (disabled) return;
    // Long press timer is handled by parent via useLongPress hook
  }, [disabled]);

  const backgroundClass = getTileBackground(cell, gameOver);
  const content = getTileContent(cell, gameOver);

  // Remove hover effect for revealed tiles
  const hoverClass =
    !cell.isRevealed && !disabled ? 'cursor-pointer' : 'cursor-default';

  return (
    <button
      type="button"
      className={`
        w-full aspect-square flex items-center justify-center
        rounded border border-dungeon-shadow/30
        transition-colors select-none
        min-w-[32px] min-h-[32px]
        ${backgroundClass}
        ${hoverClass}
      `}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      disabled={disabled && cell.isRevealed}
      aria-label={getAriaLabel(cell, gameOver)}
    >
      {content}
    </button>
  );
});

/**
 * Generate accessible label for the tile.
 */
function getAriaLabel(cell: Cell, gameOver: boolean): string {
  if (!cell.isRevealed) {
    if (cell.isFlagged) return 'Flagged tile';
    if (cell.isQuestion) return 'Uncertain tile';
    if (gameOver && cell.isMonster) return 'Hidden monster';
    return 'Hidden tile';
  }

  if (cell.isMonster) return 'Monster';
  if (cell.adjacentMonsters > 0) {
    return `${cell.adjacentMonsters} adjacent monsters`;
  }
  return 'Safe tile';
}
