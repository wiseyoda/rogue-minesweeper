// Core game logic and event handlers
// ----------------------------------
// This module drives gameplay: initializing runs, handling cell
// interactions, and coordinating with UI and shops.

import { state, resetState, playerStats, gameStats } from './state.js';
import { dom, renderGrid, updateUI, renderInventory, renderHighScores } from './ui.js';
import { showPermanentUpgradeShop, showInterLevelShop } from './shop.js';

// ----- Initialization -----

export function initNewRun() {
  if (state.goldInterval) clearInterval(state.goldInterval);
  resetState();
  startLevel();
  renderHighScores(gameStats);
  dom.upgradeShopEl.classList.add('modal-inactive');
}

export function startLevel() {
  dom.interLevelShopEl.classList.remove('modal-active');
  dom.interLevelShopEl.classList.add('modal-inactive');

  state.revealedCount = 0;
  state.flagsPlaced = 0;
  state.gameOver = false;
  state.damageTakenThisLevel = false;
  state.isFirstClick = true;
  state.shields = 0;

  const runLongBuffs = {
    extraLife: state.activeBuffs.extraLife,
    goldenGoose: state.activeBuffs.goldenGoose,
  };
  state.activeBuffs = { ...state.nextLevelBuffs, ...runLongBuffs };
  state.nextLevelBuffs = {};

  if (state.activeBuffs.shields) {
    state.shields = state.activeBuffs.shields;
    delete state.activeBuffs.shields;
  }

  state.rows = Math.min(8 + state.level, 20);
  state.cols = Math.min(8 + state.level, 30);
  state.monsterCount = Math.min(
    5 + Math.floor(state.level * 2.5),
    Math.floor(state.rows * state.cols * 0.3),
  );

  if (state.activeBuffs.monsterRepellent) {
    state.monsterCount = Math.floor(state.monsterCount * 0.9);
    delete state.activeBuffs.monsterRepellent;
  }

  dom.messageAreaEl.textContent = `Level ${state.level}: Find the exit!`;

  createGrid();
  applyStartOfLevelBuffs();
  renderGrid(state);
  updateUI(state);
  renderInventory(state);
}

// ----- Grid setup -----

function applyStartOfLevelBuffs() {
  if (state.activeBuffs.revealTiles) {
    let toReveal = state.activeBuffs.revealTiles;
    for (let i = 0; i < 1000 && toReveal > 0; i++) {
      const r = Math.floor(Math.random() * state.rows);
      const c = Math.floor(Math.random() * state.cols);
      if (!state.grid[r][c].isMonster && !state.grid[r][c].isRevealed) {
        revealCell(r, c, true);
        toReveal--;
      }
    }
    delete state.activeBuffs.revealTiles;
  }
  if (state.activeBuffs.masterGoggles) {
    for (let r = 0; r < state.rows; r++) {
      for (let c = 0; c < state.cols; c++) {
        if (state.grid[r][c].adjacentMonsters === 0 && !state.grid[r][c].isMonster) {
          revealCell(r, c);
        }
      }
    }
    delete state.activeBuffs.masterGoggles;
  }
  if (state.activeBuffs.monsterTracker) {
    let toFlag = state.activeBuffs.monsterTracker;
    for (let i = 0; i < 1000 && toFlag > 0; i++) {
      const r = Math.floor(Math.random() * state.rows);
      const c = Math.floor(Math.random() * state.cols);
      if (state.grid[r][c].isMonster && !state.grid[r][c].isFlagged) {
        state.grid[r][c].isFlagged = true;
        state.flagsPlaced++;
        toFlag--;
      }
    }
    delete state.activeBuffs.monsterTracker;
  }
  if (state.activeBuffs.eliteMonsterTracker) {
    let monstersToFlag = Math.floor(state.monsterCount * 0.25);
    for (let r = 0; r < state.rows && monstersToFlag > 0; r++) {
      for (let c = 0; c < state.cols && monstersToFlag > 0; c++) {
        if (state.grid[r][c].isMonster && !state.grid[r][c].isFlagged) {
          state.grid[r][c].isFlagged = true;
          state.flagsPlaced++;
          monstersToFlag--;
        }
      }
    }
    delete state.activeBuffs.eliteMonsterTracker;
  }
}

function createGrid() {
  state.grid = Array(state.rows)
    .fill(null)
    .map(() =>
      Array(state.cols)
        .fill(null)
        .map(() => ({
          isMonster: false,
          isRevealed: false,
          isFlagged: false,
          isQuestion: false,
          isExit: false,
          adjacentMonsters: 0,
        })),
    );
  let monstersToPlace = state.monsterCount;
  while (monstersToPlace > 0) {
    const r = Math.floor(Math.random() * state.rows);
    const c = Math.floor(Math.random() * state.cols);
    if (!state.grid[r][c].isMonster) {
      state.grid[r][c].isMonster = true;
      monstersToPlace--;
    }
  }
  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      if (state.grid[r][c].isMonster) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (
            nr >= 0 &&
            nr < state.rows &&
            nc >= 0 &&
            nc < state.cols &&
            state.grid[nr][nc].isMonster
          ) {
            count++;
          }
        }
      }
      state.grid[r][c].adjacentMonsters = count;
    }
  }
}

// ----- Event handlers -----

export function handleLeftClick(e) {
  e.preventDefault();
  if (state.gameOver || dom.interLevelShopEl.classList.contains('modal-active')) return;
  const cellEl = e.target.closest('.cell');
  if (!cellEl) return;
  const row = parseInt(cellEl.dataset.row);
  const col = parseInt(cellEl.dataset.col);
  const cellData = state.grid[row][col];

  if (state.isFirstClick) {
    state.isFirstClick = false;
    if (playerStats.firstClickSafety && cellData.isMonster) {
      dom.messageAreaEl.textContent = 'Monster Ward activated!';
      cellData.isFlagged = true;
      state.flagsPlaced++;
      updateUI(state);
      renderGrid(state);
      return;
    }
  }

  if (cellData.isExit) {
    goToNextLevel();
    return;
  }
  if (cellData.isRevealed || cellData.isFlagged) return;

  if (state.activeBuffs.forcefield > 0) {
    state.activeBuffs.forcefield--;
    if (cellData.isMonster) {
      dom.messageAreaEl.textContent = 'Forcefield absorbed the attack!';
      cellData.isFlagged = true;
      state.flagsPlaced++;
      updateUI(state);
      renderGrid(state);
      checkWinCondition();
      return;
    }
  }
  revealCell(row, col);
  renderGrid(state);
  checkWinCondition();
  renderInventory(state);
}

export function handleRightClick(e) {
  e.preventDefault();
  if (state.gameOver || dom.interLevelShopEl.classList.contains('modal-active')) return;
  const cellEl = e.target.closest('.cell');
  if (!cellEl) return;
  const row = parseInt(cellEl.dataset.row);
  const col = parseInt(cellEl.dataset.col);
  const cell = state.grid[row][col];
  if (cell.isRevealed) return;
  if (!cell.isFlagged && !cell.isQuestion) {
    cell.isFlagged = true;
    state.flagsPlaced++;
  } else if (cell.isFlagged) {
    cell.isFlagged = false;
    cell.isQuestion = true;
    state.flagsPlaced--;
  } else if (cell.isQuestion) {
    cell.isQuestion = false;
  }
  renderGrid(state);
  updateUI(state);
}

// ----- Cell interaction -----

function revealCell(row, col, silent = false) {
  const cellData = state.grid[row][col];
  if (cellData.isRevealed || cellData.isFlagged) return;
  if (cellData.isQuestion) cellData.isQuestion = false;
  cellData.isRevealed = true;
  state.revealedCount++;

  if (cellData.isMonster) {
    handleMonsterHit();
  } else {
    let goldGained = 1;
    if (state.activeBuffs.goldMagnet) goldGained *= 2;
    if (state.activeBuffs.scrapMetal && state.revealedCount % 10 === 0) goldGained++;
    state.gold += goldGained;
    if (cellData.adjacentMonsters === 0 && !silent) floodFill(row, col);
  }
  updateUI(state);
}

function floodFill(row, col) {
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < state.rows && nc >= 0 && nc < state.cols) {
        if (!state.grid[nr][nc].isRevealed && !state.grid[nr][nc].isFlagged) {
          revealCell(nr, nc);
        }
      }
    }
  }
}

function handleMonsterHit() {
  if (state.activeBuffs.steadyHand) {
    delete state.activeBuffs.steadyHand;
    dom.messageAreaEl.textContent = 'Steady Hand saved you!';
    return;
  }

  state.damageTakenThisLevel = true;
  if (state.shields > 0) {
    state.shields--;
  } else {
    state.lives--;
  }

  if (state.lives <= 0) {
    if (state.activeBuffs.extraLife) {
      delete state.activeBuffs.extraLife;
      state.lives = playerStats.maxLives;
      dom.messageAreaEl.textContent = 'Extra Life activated!';
    } else {
      endRun();
    }
  } else if (state.shields > 0) {
    dom.messageAreaEl.textContent = `Shields hit! ${state.shields} remaining.`;
  } else {
    dom.messageAreaEl.textContent = `Lives remaining: ${state.lives}.`;
  }
  updateUI(state);
  renderInventory(state);
}

function checkWinCondition() {
  const safeCells = state.rows * state.cols - state.monsterCount;
  if (state.revealedCount >= safeCells) {
    dom.messageAreaEl.textContent = 'All clear! The exit is revealed.';
    if (state.activeBuffs.shieldBattery && !state.damageTakenThisLevel) {
      if (state.lives < playerStats.maxLives) state.lives++;
      delete state.activeBuffs.shieldBattery;
    }
    placeExit();
    renderGrid(state);
  }
}

function placeExit() {
  for (let r = state.rows - 1; r >= 0; r--) {
    for (let c = state.cols - 1; c >= 0; c--) {
      if (
        state.grid[r][c].isRevealed &&
        !state.grid[r][c].isMonster &&
        state.grid[r][c].adjacentMonsters === 0
      ) {
        state.grid[r][c].isExit = true;
        return;
      }
    }
  }
  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      if (state.grid[r][c].isRevealed && !state.grid[r][c].isMonster) {
        state.grid[r][c].isExit = true;
        return;
      }
    }
  }
}

function goToNextLevel() {
  state.level++;
  state.gold += state.level * 10;
  state.activeBuffs = {
    extraLife: state.activeBuffs.extraLife,
    goldenGoose: state.activeBuffs.goldenGoose,
  };
  updateUI(state);
  renderInventory(state);
  showInterLevelShop();
}

function endRun() {
  state.gameOver = true;
  if (state.goldInterval) clearInterval(state.goldInterval);
  if (state.level > gameStats.highestLevelOverall) gameStats.highestLevelOverall = state.level;
  if (state.gold > gameStats.maxGoldRun) gameStats.maxGoldRun = state.gold;
  renderHighScores(gameStats);

  dom.messageAreaEl.textContent = 'Run over! Lives depleted.';
  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      if (state.grid[r][c].isMonster) state.grid[r][c].isRevealed = true;
    }
  }
  renderGrid(state);
  setTimeout(showPermanentUpgradeShop, 2000);
}
