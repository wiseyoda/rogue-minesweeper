// Shop logic
// ----------
// Handles both the permanent upgrade shop shown at the end of a run and
// the inter-level item shop.

import { permanentUpgrades } from './data/permanentUpgrades.js';
import { temporaryItems } from './data/temporaryItems.js';
import { dom, updateUI, renderInventory } from './ui.js';
import { state, playerStats } from './state.js';

let selectedShopItem = null;

// ----- Permanent upgrade shop -----

export function showPermanentUpgradeShop() {
    dom.shopGoldEl.textContent = state.gold;
    dom.highestLevelEl.textContent = state.level;
    populatePermanentUpgrades();
    dom.upgradeShopEl.classList.remove('modal-inactive');
    dom.upgradeShopEl.classList.add('modal-active');
}

function populatePermanentUpgrades() {
    dom.upgradesContainerEl.innerHTML = '';
    for (const key in permanentUpgrades) {
        const upgrade = permanentUpgrades[key];
        const upgradeEl = document.createElement('div');
        upgradeEl.className = 'bg-gray-700 p-4 rounded-lg flex flex-col justify-between border border-gray-600';
        let buttonHTML = '';

        if (upgrade.level !== undefined) {
            const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costIncrease, upgrade.level));
            const canAfford = state.gold >= cost;
            const isMaxLevel = upgrade.level >= upgrade.maxLevel;
            if (isMaxLevel) {
                buttonHTML = `<button disabled class="mt-2 w-full bg-gray-500 text-gray-300 font-bold py-2 px-4 rounded cursor-not-allowed">MAX LEVEL</button>`;
            } else {
                buttonHTML = `<button data-upgrade-key="${key}" ${!canAfford ? 'disabled' : ''} class="buy-upgrade-btn mt-2 w-full ${canAfford ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 cursor-not-allowed'} text-gray-900 font-bold py-2 px-4 rounded transition-colors">BUY (${cost} G)</button>`;
            }
            upgradeEl.innerHTML = `<div><h3 class="text-xl font-bold text-green-300">${upgrade.name}</h3><p class="text-gray-400 text-sm">${upgrade.description}</p><p class="text-md mt-2">Level: <span class="font-bold text-white">${upgrade.level} / ${upgrade.maxLevel}</span></p></div>${buttonHTML}`;
        } else {
            const canAfford = state.gold >= upgrade.baseCost;
            if (upgrade.unlocked) {
                buttonHTML = `<button disabled class="mt-2 w-full bg-green-700 text-gray-300 font-bold py-2 px-4 rounded cursor-not-allowed">PURCHASED</button>`;
            } else {
                buttonHTML = `<button data-upgrade-key="${key}" ${!canAfford ? 'disabled' : ''} class="buy-upgrade-btn mt-2 w-full ${canAfford ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 cursor-not-allowed'} text-gray-900 font-bold py-2 px-4 rounded transition-colors">BUY (${upgrade.baseCost} G)</button>`;
            }
            upgradeEl.innerHTML = `<div><h3 class="text-xl font-bold text-green-300">${upgrade.name}</h3><p class="text-gray-400 text-sm">${upgrade.description}</p></div>${buttonHTML}`;
        }
        dom.upgradesContainerEl.appendChild(upgradeEl);
    }
    dom.upgradesContainerEl.querySelectorAll('.buy-upgrade-btn').forEach(btn => btn.addEventListener('click', handleBuyPermanentUpgrade));
}

function handleBuyPermanentUpgrade(e) {
    const key = e.target.dataset.upgradeKey;
    const upgrade = permanentUpgrades[key];
    const cost = upgrade.level !== undefined
        ? Math.floor(upgrade.baseCost * Math.pow(upgrade.costIncrease, upgrade.level))
        : upgrade.baseCost;

    if (state.gold >= cost) {
        if (upgrade.level !== undefined && upgrade.level < upgrade.maxLevel) {
            state.gold -= cost;
            upgrade.level++;
            upgrade.apply(playerStats);
        } else if (upgrade.unlocked !== undefined && !upgrade.unlocked) {
            state.gold -= cost;
            upgrade.unlocked = true;
            upgrade.apply(playerStats);
        }
        dom.shopGoldEl.textContent = state.gold;
        populatePermanentUpgrades();
        renderInventory(state);
    }
}

// ----- Inter-level item shop -----

export function showInterLevelShop() {
    selectedShopItem = null;
    dom.itemShopGoldEl.textContent = state.gold;
    populateItemShop();
    dom.interLevelShopEl.classList.remove('modal-inactive');
    dom.interLevelShopEl.classList.add('modal-active');
}

function populateItemShop() {
    dom.itemShopContainerEl.innerHTML = '';
    const items = getShopItems(3);
    items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = `shop-item bg-gray-700 p-4 rounded-lg flex flex-col justify-between border-2 ${item.rarityClass}`;
        itemEl.dataset.itemId = item.id;
        itemEl.dataset.itemRarity = item.rarity;
        // Store cost so it can be referenced later when resetting buttons
        // after a purchase. Without this, non-selected items lose their cost
        // information and display "BUY (undefined G)".
        itemEl.dataset.itemCost = item.cost;

        itemEl.innerHTML = `
            <div>
                <h3 class="text-xl font-bold text-cyan-300">${item.name}</h3>
                <p class="text-gray-400 text-sm">${item.description}</p>
            </div>
            <button class="buy-item-btn mt-4 w-full bg-cyan-500 text-gray-900 font-bold py-2 px-4 rounded transition-colors">
                BUY (${item.cost} G)
            </button>`;
        dom.itemShopContainerEl.appendChild(itemEl);
        itemEl.addEventListener('click', () => handleItemSelect(item, itemEl));
    });
}

function handleItemSelect(item, itemEl) {
    const currentlySelected = dom.itemShopContainerEl.querySelector('.shop-item.selected');
    if (currentlySelected) {
        currentlySelected.classList.remove('selected');
        currentlySelected.querySelector('.buy-item-btn').textContent = `BUY (${currentlySelected.dataset.itemCost} G)`;
    }

    if (selectedShopItem && selectedShopItem.id === item.id) {
        selectedShopItem = null;
        return;
    }

    selectedShopItem = item;
    itemEl.classList.add('selected');
    const button = itemEl.querySelector('.buy-item-btn');
    itemEl.dataset.itemCost = item.cost;

    const canAfford = state.gold >= item.cost;
    if (canAfford) {
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
        if (item.id === 'l3' && !state.goldInterval) {
            state.goldInterval = setInterval(() => { state.gold++; updateUI(state); }, 5000);
        }
        updateUI(state);
        renderInventory(state);
        dom.itemShopGoldEl.textContent = state.gold;

        dom.itemShopContainerEl.querySelectorAll('.shop-item').forEach(el => {
            el.classList.remove('selected');
            el.style.cursor = 'default';
            el.onclick = null;
            const btn = el.querySelector('.buy-item-btn');
            btn.disabled = true;
            btn.classList.add('bg-gray-500', 'cursor-not-allowed');
            if (el.dataset.itemId === item.id) {
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
        ...Array(60).fill('common'),
        ...Array(25).fill('uncommon'),
        ...Array(10).fill('rare'),
        ...Array(5).fill('legendary')
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
            if (![...selectedItems].some(s => s.id === item.id)) {
                selectedItems.add(item);
            }
        }
        attempts++;
    }
    return Array.from(selectedItems);
}
