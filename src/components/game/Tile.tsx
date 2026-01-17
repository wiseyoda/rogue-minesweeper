/**
 * Tile component - individual cell in the game grid.
 * @module components/game/Tile
 *
 * Design System: .specify/reference/design-system/04-tiles.css
 */

import { memo, useCallback, useState } from 'react';
import type { Cell, HighlightType } from '@/types';
import { NumberDisplay } from './NumberDisplay';
import { FlagIcon } from './FlagIcon';
import { MonsterIcon } from './MonsterIcon';
import { QuestionMark } from './QuestionMark';

/**
 * Get highlight overlay styles for rune effects.
 * Returns additional box-shadow for glow effects on unrevealed tiles.
 */
function getHighlightOverlay(highlightType: HighlightType | undefined): string | undefined {
  if (!highlightType) return undefined;

  switch (highlightType) {
    case 'prophecy':
      // Green glow for safest tile
      return '0 0 12px var(--emerald, #10b981), inset 0 0 8px rgba(16, 185, 129, 0.3)';
    case 'omniscience':
      // Red tint for monster locations
      return '0 0 8px var(--blood-dark), inset 0 0 6px rgba(220, 38, 38, 0.25)';
    default:
      return undefined;
  }
}

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
  /** Extended danger count from Danger Sense rune (monsters 2 squares away) */
  extendedDangerCount?: number;
}

/**
 * Get the content to display inside the tile based on cell state.
 */
function getTileContent(
  cell: Cell,
  gameOver: boolean,
  extendedDangerCount?: number
): React.ReactNode {
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
  if (cell.adjacentMonsters > 0 || (extendedDangerCount && extendedDangerCount > 0)) {
    return (
      <div className="flex flex-col items-center justify-center leading-none">
        <NumberDisplay count={cell.adjacentMonsters} />
        {extendedDangerCount && extendedDangerCount > 0 && (
          <span
            className="select-none"
            style={{
              fontSize: '8px',
              fontFamily: "'Press Start 2P', monospace",
              color: 'var(--mystic)',
              textShadow: '0 0 4px var(--mystic-dark)',
              marginTop: '-2px',
            }}
            title={`${extendedDangerCount} monsters 2 squares away`}
          >
            +{extendedDangerCount}
          </span>
        )}
      </div>
    );
  }
  return null;
}

/**
 * Get inline styles for tile based on state.
 */
function getTileStyles(
  cell: Cell,
  gameOver: boolean,
  isHovered: boolean,
  isPressed: boolean,
  highlightType?: HighlightType
): React.CSSProperties {
  const baseStyles: React.CSSProperties = {
    width: 'var(--tile)',
    height: 'var(--tile)',
    borderWidth: 0,
    borderStyle: 'none',
    transition: 'transform var(--beat), box-shadow var(--beat)',
  };

  // Monster hit state
  if (cell.isRevealed && cell.isMonster) {
    return {
      ...baseStyles,
      background: 'linear-gradient(180deg, var(--blood-bright) 0%, var(--blood) 50%, var(--blood-dark) 100%)',
      boxShadow: 'inset 0 0 8px var(--blood-void), 0 0 15px var(--blood), 0 0 30px var(--blood-dark)',
      animation: 'hit-shake 0.4s ease-out, hit-glow 0.8s ease-in-out',
    };
  }

  // Game over monster reveal (unflagged)
  if (gameOver && cell.isMonster && !cell.isRevealed) {
    return {
      ...baseStyles,
      background: 'linear-gradient(180deg, var(--blood) 0%, var(--blood-dark) 100%)',
      boxShadow: 'inset 0 0 4px var(--blood-void)',
    };
  }

  // Flagged state
  if (cell.isFlagged) {
    return {
      ...baseStyles,
      background: 'linear-gradient(180deg, var(--stone-700) 0%, var(--stone-800) 50%, var(--stone-850) 100%)',
      borderStyle: 'solid',
      borderWidth: '3px',
      borderColor: 'var(--gold)',
      boxShadow: '0 0 8px var(--gold-dark), inset 0 1px 0 var(--stone-600)',
      animation: 'flag-planted 0.3s ease-out',
    };
  }

  // Question state
  if (cell.isQuestion) {
    return {
      ...baseStyles,
      background: 'linear-gradient(180deg, var(--stone-700) 0%, var(--stone-800) 50%, var(--stone-850) 100%)',
      borderStyle: 'solid',
      borderWidth: '3px',
      borderColor: 'var(--mystic)',
      boxShadow: '0 0 6px var(--mystic-dark), inset 0 1px 0 var(--stone-600)',
    };
  }

  // Revealed safe state
  if (cell.isRevealed) {
    return {
      ...baseStyles,
      background: 'var(--stone-900)',
      boxShadow: 'inset 0 2px 4px var(--void), inset 0 0 8px var(--stone-950)',
    };
  }

  // Hidden state with hover/press effects
  if (isPressed) {
    return {
      ...baseStyles,
      background: 'linear-gradient(180deg, var(--stone-800) 0%, var(--stone-700) 50%, var(--stone-600) 100%)',
      borderStyle: 'solid',
      borderWidth: '3px',
      borderTopColor: 'var(--stone-900)',
      borderLeftColor: 'var(--stone-900)',
      borderBottomColor: 'var(--stone-500)',
      borderRightColor: 'var(--stone-500)',
      transform: 'translateY(3px)',
      boxShadow: 'inset 0 1px 0 var(--stone-950)',
    };
  }

  if (isHovered) {
    return {
      ...baseStyles,
      background: 'linear-gradient(180deg, var(--stone-600) 0%, var(--stone-700) 50%, var(--stone-800) 100%)',
      borderStyle: 'solid',
      borderWidth: '3px',
      borderTopColor: 'var(--stone-400)',
      borderLeftColor: 'var(--stone-400)',
      borderBottomColor: 'var(--stone-900)',
      borderRightColor: 'var(--stone-900)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4), 0 0 12px var(--mystic-dark)',
    };
  }

  // Default hidden state with 3D bevel
  const highlightOverlay = getHighlightOverlay(highlightType);
  const defaultBoxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';

  return {
    ...baseStyles,
    background: 'linear-gradient(180deg, var(--stone-600) 0%, var(--stone-700) 50%, var(--stone-800) 100%)',
    borderStyle: 'solid',
    borderWidth: '3px',
    borderTopColor: 'var(--stone-400)',
    borderLeftColor: 'var(--stone-400)',
    borderBottomColor: 'var(--stone-900)',
    borderRightColor: 'var(--stone-900)',
    boxShadow: highlightOverlay ? `${defaultBoxShadow}, ${highlightOverlay}` : defaultBoxShadow,
  };
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
  extendedDangerCount,
}: TileProps) {
  void _onLongPress; // Suppress unused warning - parent handles long press
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

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

  const content = getTileContent(cell, gameOver, extendedDangerCount);
  const canInteract = !cell.isRevealed && !disabled;
  // Only apply highlights to unrevealed, unflagged tiles
  const effectiveHighlight = !cell.isRevealed && !cell.isFlagged ? cell.highlightType : undefined;

  return (
    <button
      type="button"
      className="flex items-center justify-center select-none"
      style={getTileStyles(cell, gameOver, isHovered, isPressed, effectiveHighlight)}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onMouseEnter={() => canInteract && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => canInteract && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
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
