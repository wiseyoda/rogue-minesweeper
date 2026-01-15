import { useState } from 'react';
import type { Grid, CellPosition, GridConfig, Cell } from '@/types';
import {
  initializeGrid,
  revealCell,
  toggleFlag,
  getSafeCellCount,
  getRevealedSafeCellCount,
} from '@/engine';

/**
 * Game state for the POC.
 */
type GameState = 'idle' | 'playing' | 'won' | 'lost';

/**
 * Default grid configuration for POC.
 */
const GRID_CONFIG: GridConfig = {
  rows: 8,
  cols: 8,
  monsterCount: 10,
};

/**
 * Get display text for a cell based on its state.
 */
function getCellDisplay(cell: Cell, gameState: GameState): string {
  // Show all monsters when game is lost
  if (gameState === 'lost' && cell.isMonster && !cell.isRevealed) {
    return 'M';
  }

  // Unrevealed states
  if (!cell.isRevealed) {
    if (cell.isFlagged) return 'F';
    if (cell.isQuestion) return '?';
    return '';
  }

  // Revealed states
  if (cell.isMonster) return 'M';
  if (cell.adjacentMonsters === 0) return '';
  return cell.adjacentMonsters.toString();
}

/**
 * Get background color class for a cell.
 */
function getCellBackground(cell: Cell, gameState: GameState): string {
  // Show monsters with red background when game is lost
  if (gameState === 'lost' && cell.isMonster) {
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
 * Get text color class for a number.
 */
function getNumberColor(count: number): string {
  switch (count) {
    case 1:
      return 'text-blue-600';
    case 2:
      return 'text-green-600';
    case 3:
      return 'text-red-600';
    case 4:
      return 'text-purple-600';
    case 5:
      return 'text-amber-600';
    case 6:
      return 'text-cyan-600';
    case 7:
      return 'text-gray-800';
    case 8:
      return 'text-gray-600';
    default:
      return 'text-dungeon-shadow';
  }
}

/**
 * Get text color for cell display.
 */
function getCellTextColor(cell: Cell, gameState: GameState): string {
  // Monster shown
  if ((cell.isRevealed && cell.isMonster) || (gameState === 'lost' && cell.isMonster)) {
    return 'text-white';
  }

  // Flag
  if (cell.isFlagged) {
    return 'text-dungeon-gold';
  }

  // Question
  if (cell.isQuestion) {
    return 'text-dungeon-amber';
  }

  // Number
  if (cell.isRevealed && cell.adjacentMonsters > 0) {
    return getNumberColor(cell.adjacentMonsters);
  }

  return 'text-dungeon-shadow';
}

/**
 * Get game status display text.
 */
function getStatusText(gameState: GameState): string {
  switch (gameState) {
    case 'idle':
      return 'Click any cell to start';
    case 'playing':
      return 'Playing';
    case 'won':
      return 'You Win!';
    case 'lost':
      return 'Game Over - Hit Monster!';
  }
}

/**
 * Get status text color.
 */
function getStatusColor(gameState: GameState): string {
  switch (gameState) {
    case 'idle':
      return 'text-dungeon-stone';
    case 'playing':
      return 'text-dungeon-amber';
    case 'won':
      return 'text-green-600';
    case 'lost':
      return 'text-dungeon-blood';
  }
}

function App() {
  const [grid, setGrid] = useState<Grid | null>(null);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [isFirstClick, setIsFirstClick] = useState(true);

  /**
   * Handle left-click to reveal a cell.
   */
  function handleLeftClick(row: number, col: number): void {
    // Don't allow clicks on finished games
    if (gameState === 'won' || gameState === 'lost') return;

    const position: CellPosition = { row, col };

    // First click: initialize grid with first-click safety
    if (isFirstClick) {
      const newGrid = initializeGrid(GRID_CONFIG, position);
      const result = revealCell(newGrid, position);
      setGrid(result.grid);
      setIsFirstClick(false);
      setGameState(result.isWon ? 'won' : 'playing');
      return;
    }

    if (!grid) return;

    // Check if cell is flagged or already revealed
    const cell = grid[row]?.[col];
    if (!cell || cell.isRevealed || cell.isFlagged) return;

    const result = revealCell(grid, position);
    setGrid(result.grid);

    if (result.hitMonster) {
      setGameState('lost');
    } else if (result.isWon) {
      setGameState('won');
    }
  }

  /**
   * Handle right-click to toggle flag.
   */
  function handleRightClick(e: React.MouseEvent, row: number, col: number): void {
    e.preventDefault();

    // Don't allow flags on finished games
    if (gameState === 'won' || gameState === 'lost') return;

    // Can't flag before first click
    if (!grid) return;

    const position: CellPosition = { row, col };
    const result = toggleFlag(grid, position);
    setGrid(result.grid);
  }

  /**
   * Reset the game to initial state.
   */
  function handleReset(): void {
    setGrid(null);
    setGameState('idle');
    setIsFirstClick(true);
  }

  // Calculate progress
  const safeCells = grid ? getSafeCellCount(grid) : GRID_CONFIG.rows * GRID_CONFIG.cols - GRID_CONFIG.monsterCount;
  const revealedSafeCells = grid ? getRevealedSafeCellCount(grid) : 0;

  // Create empty grid for initial display
  const displayGrid: Cell[][] = grid ?? Array.from({ length: GRID_CONFIG.rows }, () =>
    Array.from({ length: GRID_CONFIG.cols }, () => ({
      isMonster: false,
      isRevealed: false,
      isFlagged: false,
      isQuestion: false,
      isExit: false,
      adjacentMonsters: 0,
    }))
  );

  return (
    <div className="min-h-screen bg-dungeon-parchment flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-cinzel text-dungeon-blood tracking-widest mb-2">
        DUNGEON DELVER
      </h1>
      <p className="text-dungeon-stone text-sm mb-6">Core Logic POC</p>

      {/* Game Status */}
      <div className="mb-4 text-center">
        <p className={`text-xl font-bold ${getStatusColor(gameState)}`}>
          {getStatusText(gameState)}
        </p>
        <p className="text-dungeon-stone text-sm mt-1">
          Progress: {revealedSafeCells} / {safeCells} cells revealed
        </p>
      </div>

      {/* Grid */}
      <div
        className="grid gap-1 p-2 bg-dungeon-shadow rounded"
        style={{ gridTemplateColumns: `repeat(${GRID_CONFIG.cols}, minmax(0, 1fr))` }}
      >
        {displayGrid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`
                w-10 h-10 flex items-center justify-center
                font-bold text-lg rounded
                border border-dungeon-shadow/30
                cursor-pointer select-none
                transition-colors
                ${getCellBackground(cell, gameState)}
                ${getCellTextColor(cell, gameState)}
              `}
              onClick={() => handleLeftClick(rowIndex, colIndex)}
              onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
            >
              {getCellDisplay(cell, gameState)}
            </button>
          ))
        )}
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="mt-6 px-6 py-2 bg-dungeon-stone text-dungeon-parchment font-cinzel rounded hover:bg-dungeon-stone/80 transition-colors"
      >
        New Game
      </button>

      {/* Instructions */}
      <div className="mt-6 text-dungeon-stone text-sm text-center max-w-md">
        <p><strong>Left-click</strong>: Reveal cell</p>
        <p><strong>Right-click</strong>: Flag cell (F → ? → none)</p>
        <p className="mt-2 text-xs">Reveal all safe cells without hitting a monster to win!</p>
      </div>
    </div>
  );
}

export default App;
