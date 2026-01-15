// DOM references and rendering helpers
// ------------------------------------
// All DOM lookups live here so that other modules can simply import the
// elements or helper functions they need.

import { permanentUpgrades } from './data/permanentUpgrades.js';

export const dom = {
  gridElement: document.getElementById('game-grid'),
  levelEl: document.getElementById('level'),
  healthEl: document.getElementById('health'),
  monstersLeftEl: document.getElementById('monsters-left'),
  goldEl: document.getElementById('gold'),
  messageAreaEl: document.getElementById('message-area'),
  inventoryContainerEl: document.getElementById('inventory-container'),
  highScoresContainerEl: document.getElementById('high-scores-container'),
  upgradeShopEl: document.getElementById('upgrade-shop'),
  upgradesContainerEl: document.getElementById('upgrades-container'),
  shopGoldEl: document.getElementById('shop-gold'),
  highestLevelEl: document.getElementById('highest-level'),
  startNewRunBtn: document.getElementById('start-new-run'),
  interLevelShopEl: document.getElementById('inter-level-shop'),
  itemShopContainerEl: document.getElementById('item-shop-container'),
  itemShopGoldEl: document.getElementById('item-shop-gold'),
  continueBtn: document.getElementById('continue-to-next-level'),
};

// Redraw the grid of cells.
export function renderGrid(state) {
  const { gridElement } = dom;
  gridElement.innerHTML = '';
  gridElement.style.gridTemplateColumns = `repeat(${state.cols}, auto)`;
  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      const cellData = state.grid[r][c];
      const cellEl = document.createElement('div');
      cellEl.className = 'cell';
      cellEl.dataset.row = r;
      cellEl.dataset.col = c;
      if (cellData.isFlagged) {
        cellEl.classList.add('flagged');
        cellEl.textContent = '⚔️';
      } else if (cellData.isQuestion) {
        cellEl.classList.add('question');
        cellEl.textContent = '?';
      } else if (cellData.isRevealed) {
        cellEl.classList.add('revealed');
        if (cellData.isMonster) {
          cellEl.classList.add('monster');
          cellEl.textContent = '🐉';
        } else if (cellData.isExit) {
          cellEl.classList.add('exit');
          cellEl.textContent = '🚪';
        } else if (cellData.adjacentMonsters > 0) {
          cellEl.textContent = cellData.adjacentMonsters;
          cellEl.classList.add(`text-c-${cellData.adjacentMonsters}`);
        }
      }
      gridElement.appendChild(cellEl);
    }
  }
}

// Update simple numeric indicators like level and gold.
export function updateUI(state) {
  dom.levelEl.textContent = state.level;
  dom.healthEl.innerHTML = '🛡️'.repeat(state.shields) + '❤️'.repeat(state.lives);
  dom.monstersLeftEl.textContent = state.monsterCount - state.flagsPlaced;
  dom.goldEl.textContent = state.gold;
}

// Render permanent upgrades and temporary buffs.
export function renderInventory(state) {
  const container = dom.inventoryContainerEl;
  container.innerHTML = '';

  const title = document.createElement('h3');
  title.className = 'text-lg font-cinzel text-center text-red-800 mb-2';
  title.textContent = 'PERMANENT UPGRADES';
  container.appendChild(title);

  const itemsWrapper = document.createElement('div');
  itemsWrapper.className =
    'flex flex-wrap justify-center gap-2 p-2 bg-amber-200 rounded-lg border border-amber-400 min-h-[40px] items-center';
  let hasUpgrades = false;
  for (const key in permanentUpgrades) {
    const upgrade = permanentUpgrades[key];
    if ((upgrade.level && upgrade.level > 0) || upgrade.unlocked) {
      hasUpgrades = true;
      const itemEl = document.createElement('div');
      itemEl.className =
        'bg-amber-100 border border-red-700 rounded-md py-1 px-3 text-xs md:text-sm shadow-md';
      let text = `<span class="font-bold text-red-700">${upgrade.name}</span>`;
      if (upgrade.level) text += `: Lvl ${upgrade.level}`;
      itemEl.innerHTML = text;
      itemsWrapper.appendChild(itemEl);
    }
  }
  if (!hasUpgrades) {
    itemsWrapper.innerHTML = `<p class="text-amber-700 italic text-sm">No permanent upgrades active.</p>`;
  }
  container.appendChild(itemsWrapper);

  const tempTitle = document.createElement('h3');
  tempTitle.className = 'text-lg font-cinzel text-center text-red-800 mb-2 mt-4';
  tempTitle.textContent = 'TEMPORARY BUFFS';
  container.appendChild(tempTitle);

  const buffsWrapper = document.createElement('div');
  buffsWrapper.className =
    'flex flex-wrap justify-center gap-2 p-2 bg-amber-200 rounded-lg border border-amber-400 min-h-[40px] items-center';
  let hasBuffs = false;

  const formatBuff = (key, value) => {
    switch (key) {
      case 'steadyHand':
        return 'Steady Hand';
      case 'revealTiles':
        return `Reveal Tiles x${value}`;
      case 'scrapMetal':
        return 'Scrap Metal';
      case 'shields':
        return `+${value} Shield${value > 1 ? 's' : ''}`;
      case 'goldMagnet':
        return 'Gold Magnet';
      case 'monsterTracker':
        return `Monster Tracker x${value}`;
      case 'shieldBattery':
        return 'Shield Battery';
      case 'forcefield':
        return `Forcefield (${value})`;
      case 'masterGoggles':
        return 'Master Goggles';
      case 'eliteMonsterTracker':
        return 'Elite Monster Tracker';
      case 'monsterRepellent':
        return 'Monster Repellent';
      case 'extraLife':
        return 'Extra Life';
      case 'goldenGoose':
        return 'Golden Goose';
      default:
        return key;
    }
  };

  const combinedBuffs = { ...state.activeBuffs, ...state.nextLevelBuffs };
  for (const key in combinedBuffs) {
    const value = combinedBuffs[key];
    if (!value) continue;
    hasBuffs = true;
    const buffEl = document.createElement('div');
    buffEl.className =
      'bg-amber-100 border border-amber-600 rounded-md py-1 px-3 text-xs md:text-sm shadow-md';
    let label = formatBuff(key, value);
    if (key in state.nextLevelBuffs) label += ' (next)';
    buffEl.innerHTML = `<span class="font-bold text-amber-700">${label}</span>`;
    buffsWrapper.appendChild(buffEl);
  }
  if (!hasBuffs) {
    buffsWrapper.innerHTML = `<p class="text-amber-700 italic text-sm">No temporary buffs active.</p>`;
  }
  container.appendChild(buffsWrapper);
}

// Display run bests such as highest level and gold earned.
export function renderHighScores(gameStats) {
  dom.highScoresContainerEl.innerHTML = `
        <h3 class="text-lg font-cinzel text-center text-red-800 mb-2">RUN BESTS</h3>
        <div class="flex justify-center gap-4 p-2 bg-amber-200 rounded-lg border border-amber-400">
            <p>Highest Level: <span class="font-bold text-red-800">${gameStats.highestLevelOverall}</span></p>
            <p>Max Gold: <span class="font-bold text-yellow-700">${gameStats.maxGoldRun}</span></p>
        </div>
    `;
}
