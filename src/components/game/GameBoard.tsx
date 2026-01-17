/**
 * GameBoard component - main game grid container.
 * @module components/game/GameBoard
 */

import { useCallback, useMemo } from 'react';
import type { Cell } from '@/types';
import { useGameStore } from '@/stores';
import { Tile } from './Tile';
import { useLongPress } from '@/hooks/useLongPress';
import { getPassiveRuneModifiers, getExtendedDangerCount } from '@/engine/runes';

/**
 * Props for GameBoard component.
 */
export interface GameBoardProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Creates an empty cell for placeholder display.
 */
function createPlaceholderCell(): Cell {
  return {
    isMonster: false,
    isRevealed: false,
    isFlagged: false,
    isQuestion: false,
    isExit: false,
    adjacentMonsters: 0,
  };
}

/**
 * Main game board container.
 * Reads grid state from gameStore and renders interactive tiles.
 */
export function GameBoard({ className = '' }: GameBoardProps) {
  // Read state from store
  const grid = useGameStore((state) => state.grid);
  const gridConfig = useGameStore((state) => state.gridConfig);
  const gameOver = useGameStore((state) => state.gameOver);
  const runPhase = useGameStore((state) => state.run.phase);
  const equippedRunes = useGameStore((state) => state.player.equippedRunes);

  // Get actions from store
  const revealCell = useGameStore((state) => state.revealCell);
  const toggleFlag = useGameStore((state) => state.toggleFlag);

  // Check if danger sense is active
  const runeModifiers = useMemo(
    () => getPassiveRuneModifiers(equippedRunes),
    [equippedRunes]
  );
  const dangerSenseActive = runeModifiers.dangerSenseActive;

  // Determine if interactions are disabled
  const isDisabled = gameOver || runPhase === 'gameOver';

  // Create placeholder grid when grid is null
  const displayGrid = useMemo(() => {
    if (grid) return grid;

    // Create placeholder grid based on config
    return Array.from({ length: gridConfig.rows }, () =>
      Array.from({ length: gridConfig.cols }, createPlaceholderCell)
    );
  }, [grid, gridConfig.rows, gridConfig.cols]);

  // Memoized click handler creator
  const createClickHandler = useCallback(
    (row: number, col: number) => () => {
      revealCell(row, col);
    },
    [revealCell]
  );

  // Memoized right-click handler creator
  const createRightClickHandler = useCallback(
    (row: number, col: number) => () => {
      toggleFlag(row, col);
    },
    [toggleFlag]
  );

  return (
    <div
      className={`grid ${className}`}
      style={{
        gap: 'var(--gap)',
        padding: 'var(--unit)',
        background: 'var(--void)',
        border: '3px solid var(--stone-700)',
        boxShadow: 'inset 0 0 20px var(--stone-950), 0 4px 12px rgba(0, 0, 0, 0.5)',
        gridTemplateColumns: `repeat(${gridConfig.cols}, var(--tile))`,
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {displayGrid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          // Calculate extended danger count if danger sense is active
          const extendedCount =
            dangerSenseActive && grid && cell.isRevealed && !cell.isMonster
              ? getExtendedDangerCount(grid, rowIndex, colIndex)
              : undefined;

          return (
            <TileWithLongPress
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              row={rowIndex}
              col={colIndex}
              disabled={isDisabled}
              gameOver={gameOver}
              onReveal={createClickHandler(rowIndex, colIndex)}
              onFlag={createRightClickHandler(rowIndex, colIndex)}
              extendedDangerCount={extendedCount}
            />
          );
        })
      )}
    </div>
  );
}

/**
 * Props for TileWithLongPress wrapper.
 */
interface TileWithLongPressProps {
  cell: Cell;
  row: number;
  col: number;
  disabled: boolean;
  gameOver: boolean;
  onReveal: () => void;
  onFlag: () => void;
  extendedDangerCount?: number;
}

/**
 * Wrapper component that adds long press support to Tile.
 */
function TileWithLongPress({
  cell,
  disabled,
  gameOver,
  onReveal,
  onFlag,
  extendedDangerCount,
}: TileWithLongPressProps) {
  const longPressHandlers = useLongPress({
    onLongPress: onFlag,
    onClick: onReveal,
    delay: 500,
  });

  return (
    <div {...longPressHandlers}>
      <Tile
        cell={cell}
        onClick={onReveal}
        onRightClick={onFlag}
        onLongPress={onFlag}
        disabled={disabled}
        gameOver={gameOver}
        extendedDangerCount={extendedDangerCount}
      />
    </div>
  );
}
