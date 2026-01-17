/**
 * Rune effect processing module.
 * Handles triggering and applying rune effects based on game events.
 * @module engine/runes
 */

import type { Grid, RuneModifiers, HighlightType } from '@/types';
import { getRune, countRune } from '@/data/runes';
import { createDefaultRuneModifiers } from '@/types/rune';
import { revealCell } from '@/engine/reveal';

/**
 * Clear all highlights of a specific type from the grid.
 * @param grid The current grid
 * @param highlightType The highlight type to clear (or undefined to clear all)
 * @returns New grid with highlights cleared
 */
export function clearHighlights(grid: Grid, highlightType?: HighlightType): Grid {
  return grid.map((row) =>
    row.map((cell) => {
      if (!cell.highlightType) return cell;
      if (highlightType && cell.highlightType !== highlightType) return cell;
      return { ...cell, highlightType: undefined };
    })
  );
}

/**
 * Apply omniscience highlight to all monster cells.
 * Marks all monster locations with a subtle visual indicator.
 * @param grid The current grid
 * @returns New grid with omniscience highlights applied
 */
export function applyOmniscienceHighlights(grid: Grid): Grid {
  return grid.map((row) =>
    row.map((cell) => {
      if (cell.isMonster && !cell.isRevealed && !cell.isFlagged) {
        return { ...cell, highlightType: 'omniscience' as HighlightType };
      }
      return cell;
    })
  );
}

/**
 * Calculate a safety score for an unrevealed cell.
 * Lower score = safer. Score is based on adjacent revealed numbers.
 * @param grid The current grid
 * @param row Cell row
 * @param col Cell column
 * @returns Safety score (lower is safer), or Infinity if not a valid candidate
 */
function calculateSafetyScore(grid: Grid, row: number, col: number): number {
  const cell = grid[row]?.[col];
  if (!cell || cell.isRevealed || cell.isMonster || cell.isFlagged) {
    return Infinity;
  }

  // Sum of adjacent revealed numbers indicates danger
  let dangerSum = 0;
  let adjacentRevealed = 0;

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const adjCell = grid[row + dr]?.[col + dc];
      if (adjCell?.isRevealed && !adjCell.isMonster) {
        adjacentRevealed++;
        dangerSum += adjCell.adjacentMonsters;
      }
    }
  }

  // Cells with no adjacent revealed tiles are unknown - give medium priority
  if (adjacentRevealed === 0) {
    return 100; // Unknown cells get a neutral score
  }

  // Lower danger sum = safer
  return dangerSum;
}

/**
 * Find the safest unrevealed tile for prophecy highlight.
 * Uses safety scoring algorithm based on adjacent revealed numbers.
 * @param grid The current grid
 * @returns Position of safest tile, or null if none found
 */
export function findSafestTile(grid: Grid): { row: number; col: number } | null {
  let bestPos: { row: number; col: number } | null = null;
  let bestScore = Infinity;

  for (let r = 0; r < grid.length; r++) {
    const row = grid[r];
    if (!row) continue;
    for (let c = 0; c < row.length; c++) {
      const score = calculateSafetyScore(grid, r, c);
      if (score < bestScore) {
        bestScore = score;
        bestPos = { row: r, col: c };
      }
    }
  }

  return bestPos;
}

/** Prophecy rune proc chance (20%) */
const PROPHECY_PROC_CHANCE = 0.2;

/**
 * Apply prophecy highlight to the safest tile.
 * Has a 20% chance to proc on each calculation.
 * @param grid The current grid
 * @returns New grid with prophecy highlight applied (if proc succeeds)
 */
export function applyProphecyHighlight(grid: Grid): Grid {
  // First clear any existing prophecy highlights
  let newGrid = clearHighlights(grid, 'prophecy');

  // 20% chance to activate
  if (Math.random() >= PROPHECY_PROC_CHANCE) {
    return newGrid;
  }

  const safestPos = findSafestTile(newGrid);
  if (!safestPos) return newGrid;

  // Apply highlight to the safest tile
  newGrid = newGrid.map((row, r) =>
    row.map((cell, c) => {
      if (r === safestPos.row && c === safestPos.col) {
        return { ...cell, highlightType: 'prophecy' as HighlightType };
      }
      return cell;
    })
  );

  return newGrid;
}

/**
 * Apply all highlight-based rune effects (prophecy, omniscience).
 * Call this after floor start and after each reveal to update highlights.
 * @param grid The current grid
 * @param equippedRunes Array of equipped rune IDs
 * @returns New grid with all highlights applied
 */
export function applyHighlightRunes(grid: Grid, equippedRunes: string[]): Grid {
  let newGrid = grid;

  // Omniscience: Mark all monster cells
  if (equippedRunes.includes('omniscience')) {
    newGrid = applyOmniscienceHighlights(newGrid);
  }

  // Prophecy: Mark the safest tile
  if (equippedRunes.includes('prophecy')) {
    newGrid = applyProphecyHighlight(newGrid);
  }

  return newGrid;
}

/**
 * Clear highlight from a specific cell (when revealed or flagged).
 * @param grid The current grid
 * @param row Cell row
 * @param col Cell column
 * @returns New grid with highlight cleared from specified cell
 */
export function clearCellHighlight(grid: Grid, row: number, col: number): Grid {
  const cell = grid[row]?.[col];
  if (!cell?.highlightType) return grid;

  return grid.map((gridRow, r) =>
    gridRow.map((c, colIdx) => {
      if (r === row && colIdx === col) {
        return { ...c, highlightType: undefined };
      }
      return c;
    })
  );
}

/**
 * Calculate extended danger count for a cell (2 squares away).
 * Used by Danger Sense rune.
 * @param grid The current grid
 * @param row Cell row
 * @param col Cell column
 * @returns Number of monsters within 2 squares (excluding immediate adjacent)
 */
export function getExtendedDangerCount(grid: Grid, row: number, col: number): number {
  let count = 0;

  // Check cells at distance 2 (not already counted in adjacentMonsters)
  for (let dr = -2; dr <= 2; dr++) {
    for (let dc = -2; dc <= 2; dc++) {
      // Skip cells at distance 0-1 (already in adjacentMonsters)
      if (Math.abs(dr) <= 1 && Math.abs(dc) <= 1) continue;

      const cell = grid[row + dr]?.[col + dc];
      if (cell?.isMonster) {
        count++;
      }
    }
  }

  return count;
}

/**
 * Apply onFloorStart rune effects.
 * Called at the beginning of each floor after grid initialization.
 * @param grid The current grid
 * @param equippedRunes Array of equipped rune IDs
 * @returns Object with updated grid and count of tiles revealed
 */
export function applyOnFloorStartRunes(
  grid: Grid,
  equippedRunes: string[]
): { grid: Grid; tilesRevealed: number } {
  let currentGrid = grid;
  let tilesRevealed = 0;

  // Scout's Eye: Reveal 2 random safe tiles per rune (stackable)
  const scoutEyeCount = countRune(equippedRunes, 'scout-eye');
  if (scoutEyeCount > 0) {
    const tilesToReveal = scoutEyeCount * 2;

    // Find all unrevealed, non-monster tiles
    const safeTiles: Array<{ row: number; col: number }> = [];
    for (let r = 0; r < currentGrid.length; r++) {
      const gridRow = currentGrid[r];
      if (!gridRow) continue;
      for (let c = 0; c < gridRow.length; c++) {
        const cell = gridRow[c];
        if (cell && !cell.isRevealed && !cell.isMonster) {
          safeTiles.push({ row: r, col: c });
        }
      }
    }

    // Shuffle and reveal tiles
    const shuffled = [...safeTiles].sort(() => Math.random() - 0.5);
    const toReveal = shuffled.slice(0, Math.min(tilesToReveal, shuffled.length));

    for (const pos of toReveal) {
      const result = revealCell(currentGrid, pos);
      currentGrid = result.grid;
      tilesRevealed += result.revealedPositions.length;
    }
  }

  // Treasure Sense: Mark high-value tiles (for now, just reveal 1 tile)
  // Note: Full implementation would require a visual marker, not reveal
  // For POC, we'll reveal 1 additional safe tile per treasure-sense rune
  const treasureSenseCount = countRune(equippedRunes, 'treasure-sense');
  if (treasureSenseCount > 0) {
    // Find unrevealed safe tiles
    const safeTiles: Array<{ row: number; col: number }> = [];
    for (let r = 0; r < currentGrid.length; r++) {
      const gridRow = currentGrid[r];
      if (!gridRow) continue;
      for (let c = 0; c < gridRow.length; c++) {
        const cell = gridRow[c];
        if (cell && !cell.isRevealed && !cell.isMonster) {
          safeTiles.push({ row: r, col: c });
        }
      }
    }

    // Reveal 1 tile per rune
    const shuffled = [...safeTiles].sort(() => Math.random() - 0.5);
    const toReveal = shuffled.slice(0, Math.min(treasureSenseCount, shuffled.length));

    for (const pos of toReveal) {
      const result = revealCell(currentGrid, pos);
      currentGrid = result.grid;
      tilesRevealed += result.revealedPositions.length;
    }
  }

  return { grid: currentGrid, tilesRevealed };
}

/**
 * Apply onReveal rune effects.
 * Called after a tile is revealed.
 * @param grid The current grid
 * @param equippedRunes Array of equipped rune IDs
 * @param _revealedPosition Position that was just revealed (unused for now)
 * @returns Object with potentially updated grid and count of bonus tiles revealed
 */
export function applyOnRevealRunes(
  grid: Grid,
  equippedRunes: string[],
  _revealedPosition: { row: number; col: number }
): { grid: Grid; bonusTilesRevealed: number } {
  let currentGrid = grid;
  let bonusTilesRevealed = 0;

  // Oracle's Sight: 10% chance to reveal an adjacent safe tile
  const hasOracleSight = equippedRunes.includes('oracle-sight');
  if (hasOracleSight) {
    const oracleCount = countRune(equippedRunes, 'oracle-sight');
    const chance = 0.1 * oracleCount; // 10% per oracle's sight rune

    if (Math.random() < chance) {
      // Find all unrevealed, non-monster tiles adjacent to revealed position
      // For simplicity in POC, reveal any random unrevealed safe tile
      const safeTiles: Array<{ row: number; col: number }> = [];
      for (let r = 0; r < currentGrid.length; r++) {
        const gridRow = currentGrid[r];
        if (!gridRow) continue;
        for (let c = 0; c < gridRow.length; c++) {
          const cell = gridRow[c];
          if (cell && !cell.isRevealed && !cell.isMonster) {
            safeTiles.push({ row: r, col: c });
          }
        }
      }

      if (safeTiles.length > 0) {
        const randomIndex = Math.floor(Math.random() * safeTiles.length);
        const tilePos = safeTiles[randomIndex];
        if (tilePos) {
          const result = revealCell(currentGrid, tilePos);
          currentGrid = result.grid;
          bonusTilesRevealed += result.revealedPositions.length;
        }
      }
    }
  }

  return { grid: currentGrid, bonusTilesRevealed };
}

/**
 * Result of onDamage rune processing.
 */
export interface OnDamageResult {
  /** Final damage after rune effects */
  finalDamage: number;
  /** Whether damage was fully negated */
  damageNegated: boolean;
  /** Whether second chance was used */
  secondChanceUsed: boolean;
}

/**
 * Apply onDamage rune effects.
 * Called when player would take damage.
 * @param damage Amount of damage to be taken
 * @param equippedRunes Array of equipped rune IDs
 * @param isFirstDamageThisFloor Whether this is the first damage this floor
 * @param secondChanceAvailable Whether second chance has been used this run
 * @param currentLives Player's current lives
 * @returns Processed damage result
 */
export function applyOnDamageRunes(
  damage: number,
  equippedRunes: string[],
  isFirstDamageThisFloor: boolean,
  secondChanceAvailable: boolean,
  currentLives: number
): OnDamageResult {
  let finalDamage = damage;
  let damageNegated = false;
  let secondChanceUsed = false;

  // Stone Skin: First damage each floor is reduced by 1 (stackable)
  if (isFirstDamageThisFloor) {
    const stoneSkinCount = countRune(equippedRunes, 'stone-skin');
    if (stoneSkinCount > 0) {
      finalDamage = Math.max(0, finalDamage - stoneSkinCount);
      if (finalDamage === 0) {
        damageNegated = true;
      }
    }
  }

  // Lucky Charm: 20% chance to negate damage completely (non-stackable)
  if (finalDamage > 0 && equippedRunes.includes('lucky-charm')) {
    if (Math.random() < 0.2) {
      finalDamage = 0;
      damageNegated = true;
    }
  }

  // Second Chance: Survive fatal damage with 1 HP (once per run)
  if (finalDamage >= currentLives && secondChanceAvailable && equippedRunes.includes('second-chance')) {
    // Would die, but second chance saves us
    finalDamage = currentLives - 1; // Reduces to leave 1 HP
    secondChanceUsed = true;
  }

  return { finalDamage, damageNegated, secondChanceUsed };
}

/**
 * Calculate passive rune modifiers for the current equipped runes.
 * @param equippedRunes Array of equipped rune IDs
 * @returns RuneModifiers object with all passive effects
 */
export function getPassiveRuneModifiers(equippedRunes: string[]): RuneModifiers {
  const modifiers = createDefaultRuneModifiers();

  for (const runeId of equippedRunes) {
    const rune = getRune(runeId);
    if (!rune || rune.effect.trigger !== 'passive') continue;

    switch (runeId) {
      case 'midas-touch':
        // +25% gold multiplier (stackable)
        modifiers.goldMultiplier += 0.25;
        break;

      case 'stone-skin':
        // First hit reduction (stackable) - handled in applyOnDamageRunes
        modifiers.firstHitReduction += 1;
        break;

      case 'swift-feet':
        // Auto-flag satisfied numbers (non-stackable)
        modifiers.autoFlag = true;
        break;

      case 'danger-sense':
        // Extended danger vision (non-stackable)
        modifiers.dangerSenseActive = true;
        break;
    }
  }

  return modifiers;
}
