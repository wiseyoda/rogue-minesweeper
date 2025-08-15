import { permanentUpgrades } from './data/permanentUpgrades.js';
import { temporaryItems } from './data/temporaryItems.js';

let state = {};
const playerStats = {
    maxShields: 3,
    startingGold: 0,
    firstClickSafety: false,
};

// --- DOM ELEMENTS ---
const gridElement = document.getElementById('game-grid');
const levelEl = document.getElementById('level');
const shieldsEl = document.getElementById('shields');
const minesLeftEl = document.getElementById('mines-left');
const goldEl = document.getElementById('gold');
const messageAreaEl = document.getElementById('message-area');
const inventoryContainerEl = document.getElementById('inventory-container');
const highScoresContainerEl = document.getElementById('high-scores-container');

const upgradeShopEl = document.getElementById('upgrade-shop');
const upgradesContainerEl = document.getElementById('upgrades-container');
const shopGoldEl = document.getElementById('shop-gold');
const highestLevelEl = document.getElementById('highest-level');
const startNewRunBtn = document.getElementById('start-new-run');

const interLevelShopEl = document.getElementById('inter-level-shop');
const itemShopContainerEl = document.getElementById('item-shop-container');
const itemShopGoldEl = document.getElementById('item-shop-gold');
const continueBtn = document.getElementById('continue-to-next-level');

// --- GAME STATE ---
let selectedShopItem = null;

// Permanent upgrades and temporary items are loaded via separate scripts

// --- PERSISTENT GAME STATS ---
 const gameStats = {
    highestLevelOverall: 1,
    maxGoldRun: 0,
};




// --- CORE GAME LOGIC ---

function initNewRun() {
    state = {
        level: 1, shields: playerStats.maxShields, gold: playerStats.startingGold,
        temporaryShields: 0, gameOver: false, grid: [], rows: 0, cols: 0, mineCount: 0,
        revealedCount: 0, flagsPlaced: 0, activeBuffs: {}, nextLevelBuffs: {},
        damageTakenThisLevel: false, isFirstClick: true,
    };
    if (state.goldInterval) clearInterval(state.goldInterval);
    startLevel();
    updateUI();
    renderInventory();
    renderHighScores();
    upgradeShopEl.classList.add('modal-inactive');
}

function startLevel() {
    interLevelShopEl.classList.remove('modal-active');
    interLevelShopEl.classList.add('modal-inactive');

    state.revealedCount = 0; state.flagsPlaced = 0; state.gameOver = false;
    state.damageTakenThisLevel = false; state.isFirstClick = true;
    state.temporaryShields = 0; // Reset temp shields

    // Carry over run-long buffs and apply next-level buffs
    const runLongBuffs = {
        extraLife: state.activeBuffs.extraLife,
        goldenGoose: state.activeBuffs.goldenGoose
    };
    state.activeBuffs = { ...state.nextLevelBuffs, ...runLongBuffs };
    state.nextLevelBuffs = {};

    // Apply temporary shields from buffs
    if (state.activeBuffs.temporaryShields) {
        state.temporaryShields = state.activeBuffs.temporaryShields;
        delete state.activeBuffs.temporaryShields;
    }

    state.rows = Math.min(8 + state.level, 20);
    state.cols = Math.min(8 + state.level, 30);
    state.mineCount = Math.min(5 + Math.floor(state.level * 2.5), Math.floor(state.rows * state.cols * 0.3));

    if (state.activeBuffs.mineNeutralizer) {
        state.mineCount = Math.floor(state.mineCount * 0.9);
        delete state.activeBuffs.mineNeutralizer;
    }

    messageAreaEl.textContent = `Level ${state.level}: Find the exit!`;

    createGrid();
    applyStartOfLevelBuffs();
    renderGrid();
    updateUI();
}

function applyStartOfLevelBuffs() {
    if (state.activeBuffs.revealTiles) {
        let toReveal = state.activeBuffs.revealTiles;
        for (let i = 0; i < 1000 && toReveal > 0; i++) {
            const r = Math.floor(Math.random() * state.rows);
            const c = Math.floor(Math.random() * state.cols);
            if (!state.grid[r][c].isMine && !state.grid[r][c].isRevealed) {
                revealCell(r, c, true); toReveal--;
            }
        }
        delete state.activeBuffs.revealTiles;
    }
    if (state.activeBuffs.masterGoggles) {
        for (let r = 0; r < state.rows; r++) {
            for (let c = 0; c < state.cols; c++) {
                if (state.grid[r][c].adjacentMines === 0 && !state.grid[r][c].isMine) revealCell(r, c);
            }
        }
        delete state.activeBuffs.masterGoggles;
    }
    if (state.activeBuffs.bombSquad) {
        let toFlag = state.activeBuffs.bombSquad;
        for (let i = 0; i < 1000 && toFlag > 0; i++) {
            const r = Math.floor(Math.random() * state.rows);
            const c = Math.floor(Math.random() * state.cols);
            if (state.grid[r][c].isMine && !state.grid[r][c].isFlagged) {
                state.grid[r][c].isFlagged = true; state.flagsPlaced++; toFlag--;
            }
        }
        delete state.activeBuffs.bombSquad;
    }
     if (state.activeBuffs.eliteBombSquad) {
        let minesToFlag = Math.floor(state.mineCount * 0.25);
        for (let r = 0; r < state.rows && minesToFlag > 0; r++) {
            for (let c = 0; c < state.cols && minesToFlag > 0; c++) {
                if (state.grid[r][c].isMine && !state.grid[r][c].isFlagged) {
                    state.grid[r][c].isFlagged = true; state.flagsPlaced++; minesToFlag--;
                }
            }
        }
        delete state.activeBuffs.eliteBombSquad;
    }
}

function createGrid() {
    state.grid = Array(state.rows)
        .fill(null)
        .map(() =>
            Array(state.cols)
                .fill(null)
                .map(() => ({
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    isQuestion: false,
                    isExit: false,
                    adjacentMines: 0,
                }))
        );
    let minesToPlace = state.mineCount;
    while (minesToPlace > 0) {
        const r = Math.floor(Math.random() * state.rows);
        const c = Math.floor(Math.random() * state.cols);
        if (!state.grid[r][c].isMine) { state.grid[r][c].isMine = true; minesToPlace--; }
    }
    for (let r = 0; r < state.rows; r++) {
        for (let c = 0; c < state.cols; c++) {
            if (state.grid[r][c].isMine) continue;
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = r + dr; const nc = c + dc;
                    if (nr >= 0 && nr < state.rows && nc >= 0 && nc < state.cols && state.grid[nr][nc].isMine) count++;
                }
            }
            state.grid[r][c].adjacentMines = count;
        }
    }
}

function renderGrid() {
    gridElement.innerHTML = '';
    gridElement.style.gridTemplateColumns = `repeat(${state.cols}, auto)`;
    for (let r = 0; r < state.rows; r++) {
        for (let c = 0; c < state.cols; c++) {
            const cellData = state.grid[r][c];
            const cellEl = document.createElement('div');
            cellEl.className = 'cell';
            cellEl.dataset.row = r; cellEl.dataset.col = c;
            if (cellData.isFlagged) { cellEl.classList.add('flagged'); cellEl.textContent = '⚑'; }
            else if (cellData.isQuestion) { cellEl.classList.add('question'); cellEl.textContent = '?'; }
            else if (cellData.isRevealed) {
                cellEl.classList.add('revealed');
                if (cellData.isMine) { cellEl.classList.add('mine'); cellEl.textContent = '✸'; }
                else if (cellData.isExit) { cellEl.classList.add('exit'); cellEl.textContent = '▼'; }
                else if (cellData.adjacentMines > 0) {
                    cellEl.textContent = cellData.adjacentMines;
                    cellEl.classList.add(`text-c-${cellData.adjacentMines}`);
                }
            }
            gridElement.appendChild(cellEl);
        }
    }
}

function updateUI() {
    levelEl.textContent = state.level;
    shieldsEl.innerHTML = '❤️'.repeat(state.shields) + '💙'.repeat(state.temporaryShields);
    minesLeftEl.textContent = state.mineCount - state.flagsPlaced;
    goldEl.textContent = state.gold;
}

function renderInventory() {
    inventoryContainerEl.innerHTML = '';
    const title = document.createElement('h3');
    title.className = 'text-lg font-orbitron text-center text-gray-400 mb-2';
    title.textContent = 'PERMANENT UPGRADES';
    inventoryContainerEl.appendChild(title);
    const itemsWrapper = document.createElement('div');
    itemsWrapper.className = 'flex flex-wrap justify-center gap-2 p-2 bg-gray-900 rounded-lg border border-gray-700 min-h-[40px] items-center';
    let hasUpgrades = false;
    for (const key in permanentUpgrades) {
        const upgrade = permanentUpgrades[key];
        if ((upgrade.level && upgrade.level > 0) || (upgrade.unlocked)) {
            hasUpgrades = true;
            const itemEl = document.createElement('div');
            itemEl.className = 'bg-gray-700 border border-green-500 rounded-md py-1 px-3 text-xs md:text-sm shadow-md';
            let text = `<span class="font-bold text-green-300">${upgrade.name}</span>`;
            if(upgrade.level) text += `: Lvl ${upgrade.level}`;
            itemEl.innerHTML = text;
            itemsWrapper.appendChild(itemEl);
        }
    }
    if (!hasUpgrades) { itemsWrapper.innerHTML = `<p class="text-gray-500 italic text-sm">No permanent upgrades active.</p>`; }
    inventoryContainerEl.appendChild(itemsWrapper);
}

function renderHighScores() {
    highScoresContainerEl.innerHTML = `
        <h3 class="text-lg font-orbitron text-center text-gray-400 mb-2">RUN BESTS</h3>
        <div class="flex justify-center gap-4 p-2 bg-gray-900 rounded-lg border border-gray-700">
            <p>Highest Level: <span class="font-bold text-white">${gameStats.highestLevelOverall}</span></p>
            <p>Max Gold: <span class="font-bold text-yellow-400">${gameStats.maxGoldRun}</span></p>
        </div>
    `;
}

// --- EVENT HANDLERS ---
gridElement.addEventListener('click', handleLeftClick);
gridElement.addEventListener('contextmenu', handleRightClick);
startNewRunBtn.addEventListener('click', initNewRun);
continueBtn.addEventListener('click', startLevel);

function handleLeftClick(e) {
    e.preventDefault();
    if (state.gameOver || interLevelShopEl.classList.contains('modal-active')) return;
    const cellEl = e.target.closest('.cell');
    if (!cellEl) return;
    const row = parseInt(cellEl.dataset.row);
    const col = parseInt(cellEl.dataset.col);
    const cellData = state.grid[row][col];

    if (state.isFirstClick) {
        state.isFirstClick = false;
        if (playerStats.firstClickSafety && cellData.isMine) {
            messageAreaEl.textContent = "Mine Deflector activated!";
            cellData.isFlagged = true; state.flagsPlaced++;
            updateUI(); renderGrid(); return;
        }
    }

    if (cellData.isExit) { goToNextLevel(); return; }
    if (cellData.isRevealed || cellData.isFlagged) return;

    if (state.activeBuffs.forcefield > 0) {
        state.activeBuffs.forcefield--;
        if (cellData.isMine) {
            messageAreaEl.textContent = "Forcefield absorbed the blast!";
            cellData.isFlagged = true; state.flagsPlaced++;
            updateUI(); renderGrid(); checkWinCondition(); return;
        }
    }
    revealCell(row, col);
    renderGrid();
    checkWinCondition();
}

function handleRightClick(e) {
    e.preventDefault();
    if (state.gameOver || interLevelShopEl.classList.contains('modal-active')) return;
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
    renderGrid();
    updateUI();
}

function revealCell(row, col, silent = false) {
    const cellData = state.grid[row][col];
    if (cellData.isRevealed || cellData.isFlagged) return;
    if (cellData.isQuestion) cellData.isQuestion = false;
    cellData.isRevealed = true;
    state.revealedCount++;

    if (cellData.isMine) { handleMineHit(); }
    else {
        let goldGained = 1;
        if (state.activeBuffs.goldMagnet) goldGained *= 2;
        if (state.activeBuffs.scrapMetal && state.revealedCount % 10 === 0) goldGained++;
        state.gold += goldGained;
        if (cellData.adjacentMines === 0 && !silent) floodFill(row, col);
    }
    updateUI();
}

function floodFill(row, col) {
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = row + dr; const nc = col + dc;
            if (nr >= 0 && nr < state.rows && nc >= 0 && nc < state.cols) {
                if (!state.grid[nr][nc].isRevealed && !state.grid[nr][nc].isFlagged) revealCell(nr, nc);
            }
        }
    }
}

function handleMineHit() {
    if (state.activeBuffs.steadyHand) {
        delete state.activeBuffs.steadyHand;
        messageAreaEl.textContent = "Steady Hand saved you!"; return;
    }

    state.damageTakenThisLevel = true;
    if (state.temporaryShields > 0) {
        state.temporaryShields--;
    } else {
        state.shields--;
    }

    if (state.shields < 0) {
        if (state.activeBuffs.extraLife) {
            delete state.activeBuffs.extraLife;
            state.shields = playerStats.maxShields;
            messageAreaEl.textContent = "Extra Life activated!";
        } else {
            state.shields = 0; endRun();
        }
    } else if (state.shields + state.temporaryShields > 0) {
        messageAreaEl.textContent = `Shields hit! ${state.shields + state.temporaryShields} remaining.`;
    }
    updateUI();
}

function checkWinCondition() {
    const safeCells = state.rows * state.cols - state.mineCount;
    if (state.revealedCount >= safeCells) {
        messageAreaEl.textContent = "All clear! The exit is revealed.";
        if (state.activeBuffs.shieldBattery && !state.damageTakenThisLevel) {
            if(state.shields < playerStats.maxShields) state.shields++;
            delete state.activeBuffs.shieldBattery;
        }
        placeExit();
        renderGrid();
    }
}

function placeExit() {
    for(let r = state.rows - 1; r >= 0; r--) {
        for(let c = state.cols - 1; c >= 0; c--) {
            if(state.grid[r][c].isRevealed && !state.grid[r][c].isMine && state.grid[r][c].adjacentMines === 0) {
                state.grid[r][c].isExit = true; return;
            }
        }
    }
    for(let r = 0; r < state.rows; r++) {
        for(let c = 0; c < state.cols; c++) {
            if(state.grid[r][c].isRevealed && !state.grid[r][c].isMine) {
                state.grid[r][c].isExit = true; return;
            }
        }
    }
}

function goToNextLevel() {
    state.level++;
    state.gold += state.level * 10;
    updateUI();
    showInterLevelShop();
}

function endRun() {
    state.gameOver = true;
    if (state.goldInterval) clearInterval(state.goldInterval);

    // Update high scores
    if (state.level > gameStats.highestLevelOverall) gameStats.highestLevelOverall = state.level;
    if (state.gold > gameStats.maxGoldRun) gameStats.maxGoldRun = state.gold;
    renderHighScores();

    messageAreaEl.textContent = "Run over! Shields depleted.";
    for (let r = 0; r < state.rows; r++) {
        for (let c = 0; c < state.cols; c++) {
            if (state.grid[r][c].isMine) state.grid[r][c].isRevealed = true;
        }
    }
    renderGrid();

    setTimeout(showPermanentUpgradeShop, 2000);
}

// --- SHOP LOGIC ---

function showPermanentUpgradeShop() {
    shopGoldEl.textContent = state.gold;
    highestLevelEl.textContent = state.level;
    populatePermanentUpgrades();
    upgradeShopEl.classList.remove('modal-inactive');
    upgradeShopEl.classList.add('modal-active');
}

function populatePermanentUpgrades() {
    upgradesContainerEl.innerHTML = '';
    for (const key in permanentUpgrades) {
        const upgrade = permanentUpgrades[key];
        const upgradeEl = document.createElement('div');
        upgradeEl.className = 'bg-gray-700 p-4 rounded-lg flex flex-col justify-between border border-gray-600';
        let buttonHTML = '';

        if (upgrade.level !== undefined) { // Leveled upgrade
            const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costIncrease, upgrade.level));
            const canAfford = state.gold >= cost;
            const isMaxLevel = upgrade.level >= upgrade.maxLevel;
            if (isMaxLevel) {
                buttonHTML = `<button disabled class="mt-2 w-full bg-gray-500 text-gray-300 font-bold py-2 px-4 rounded cursor-not-allowed">MAX LEVEL</button>`;
            } else {
                buttonHTML = `<button data-upgrade-key="${key}" ${!canAfford ? 'disabled' : ''} class="buy-upgrade-btn mt-2 w-full ${canAfford ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 cursor-not-allowed'} text-gray-900 font-bold py-2 px-4 rounded transition-colors">BUY (${cost} G)</button>`;
            }
            upgradeEl.innerHTML = `<div><h3 class="text-xl font-bold text-green-300">${upgrade.name}</h3><p class="text-gray-400 text-sm">${upgrade.description}</p><p class="text-md mt-2">Level: <span class="font-bold text-white">${upgrade.level} / ${upgrade.maxLevel}</span></p></div>${buttonHTML}`;
        } else { // One-time purchase upgrade
            const canAfford = state.gold >= upgrade.baseCost;
            if (upgrade.unlocked) {
                 buttonHTML = `<button disabled class="mt-2 w-full bg-green-700 text-gray-300 font-bold py-2 px-4 rounded cursor-not-allowed">PURCHASED</button>`;
            } else {
                buttonHTML = `<button data-upgrade-key="${key}" ${!canAfford ? 'disabled' : ''} class="buy-upgrade-btn mt-2 w-full ${canAfford ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 cursor-not-allowed'} text-gray-900 font-bold py-2 px-4 rounded transition-colors">BUY (${upgrade.baseCost} G)</button>`;
            }
            upgradeEl.innerHTML = `<div><h3 class="text-xl font-bold text-green-300">${upgrade.name}</h3><p class="text-gray-400 text-sm">${upgrade.description}</p></div>${buttonHTML}`;
        }
        upgradesContainerEl.appendChild(upgradeEl);
    }
    document.querySelectorAll('.buy-upgrade-btn').forEach(btn => btn.addEventListener('click', handleBuyPermanentUpgrade));
}

function handleBuyPermanentUpgrade(e) {
    const key = e.target.dataset.upgradeKey;
    const upgrade = permanentUpgrades[key];
    const cost = upgrade.level !== undefined ? Math.floor(upgrade.baseCost * Math.pow(upgrade.costIncrease, upgrade.level)) : upgrade.baseCost;

    if (state.gold >= cost) {
        if (upgrade.level !== undefined && upgrade.level < upgrade.maxLevel) {
            state.gold -= cost; upgrade.level++; upgrade.apply(playerStats);
        } else if (upgrade.unlocked !== undefined && !upgrade.unlocked) {
            state.gold -= cost; upgrade.unlocked = true; upgrade.apply(playerStats);
        }
        shopGoldEl.textContent = state.gold;
        populatePermanentUpgrades();
        renderInventory();
    }
}

function showInterLevelShop() {
    selectedShopItem = null;
    itemShopGoldEl.textContent = state.gold;
    populateItemShop();
    interLevelShopEl.classList.remove('modal-inactive');
    interLevelShopEl.classList.add('modal-active');
}

function populateItemShop() {
    itemShopContainerEl.innerHTML = '';
    const items = getShopItems(3);
    items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = `shop-item bg-gray-700 p-4 rounded-lg flex flex-col justify-between border-2 ${item.rarityClass}`;
        itemEl.dataset.itemId = item.id;
        itemEl.dataset.itemRarity = item.rarity;

        itemEl.innerHTML = `
            <div>
                <h3 class="text-xl font-bold text-cyan-300">${item.name}</h3>
                <p class="text-gray-400 text-sm">${item.description}</p>
            </div>
            <button class="buy-item-btn mt-4 w-full bg-cyan-500 text-gray-900 font-bold py-2 px-4 rounded transition-colors">
                BUY (${item.cost} G)
            </button>`;
        itemShopContainerEl.appendChild(itemEl);
        itemEl.addEventListener('click', () => handleItemSelect(item, itemEl));
    });
}

function handleItemSelect(item, itemEl) {
    const currentlySelected = document.querySelector('.shop-item.selected');
    if (currentlySelected) {
        currentlySelected.classList.remove('selected');
        currentlySelected.querySelector('.buy-item-btn').textContent = `BUY (${currentlySelected.dataset.itemCost} G)`;
    }

    if (selectedShopItem && selectedShopItem.id === item.id) {
        selectedShopItem = null; return;
    }

    selectedShopItem = item;
    itemEl.classList.add('selected');
    const button = itemEl.querySelector('.buy-item-btn');
    itemEl.dataset.itemCost = item.cost;

    const canAfford = state.gold >= item.cost;
    if(canAfford) {
        button.textContent = 'PURCHASE';
        button.onclick = handleBuyItem;
        button.disabled = false;
        button.classList.remove('bg-gray-500', 'cursor-not-allowed', 'bg-cyan-500', 'hover:bg-cyan-600');
        button.classList.add('bg-green-500', 'hover:bg-green-600');
    } else {
        button.textContent = `BUY (${item.cost} G)`;
        button.disabled = true;
        button.classList.add('bg-gray-500', 'cursor-not-allowed');
        button.classList.remove('bg-cyan-500', 'hover:bg-cyan-600', 'bg-green-500', 'hover:bg-green-600');
    }
}

function handleBuyItem() {
    if (!selectedShopItem) return;
    const item = selectedShopItem;
    if (state.gold >= item.cost) {
        state.gold -= item.cost;
        item.apply(state, playerStats);
        if (item.id === 'l3' && !state.goldInterval) { // Golden Goose
            state.goldInterval = setInterval(() => { state.gold++; updateUI(); }, 5000);
        }
        updateUI();
        itemShopGoldEl.textContent = state.gold;

        document.querySelectorAll('.shop-item').forEach(el => {
            el.classList.remove('selected');
            el.style.cursor = 'default';
            el.onclick = null;
            const btn = el.querySelector('.buy-item-btn');
            btn.disabled = true;
            btn.classList.add('bg-gray-500', 'cursor-not-allowed');
            if(el.dataset.itemId === item.id){
               btn.textContent = 'PURCHASED';
               btn.classList.remove('bg-green-500', 'hover:bg-green-600');
            } else {
               btn.textContent = `BUY (${el.dataset.itemCost} G)`;
               btn.classList.remove('bg-cyan-500', 'hover:bg-cyan-600');
            }
        });
    }
}

function getShopItems(count) {
    const weightedRarities = [
        ...Array(60).fill('common'), ...Array(25).fill('uncommon'),
        ...Array(10).fill('rare'), ...Array(5).fill('legendary')
    ];
    const selectedItems = new Set();
    let attempts = 0;
    while (selectedItems.size < count && attempts < 100) {
        const rarity = weightedRarities[Math.floor(Math.random() * weightedRarities.length)];
        const pool = temporaryItems[rarity];
        if (pool.length > 0) {
            const item = { ...pool[Math.floor(Math.random() * pool.length)] };
            item.rarity = rarity;
            item.rarityClass = `rarity-${rarity}`;
            if(![...selectedItems].some(s => s.id === item.id)) {
                 selectedItems.add(item);
            }
        }
        attempts++;
    }
    return Array.from(selectedItems);
}

// --- INITIALIZATION ---
initNewRun();
