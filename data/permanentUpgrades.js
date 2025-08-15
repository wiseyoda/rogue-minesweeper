const permanentUpgrades = {
    maxShields: { name: 'Reinforced Hull', description: 'Increase max shields by 1.', baseCost: 50, costIncrease: 2, level: 0, maxLevel: 10, apply: () => playerStats.maxShields++ },
    startingGold: { name: 'Gold Scanner', description: 'Start each run with extra gold.', baseCost: 100, costIncrease: 1.8, level: 0, maxLevel: 5, apply: () => playerStats.startingGold += 25 },
    firstClickSafety: { name: 'Mine Deflector', description: 'Your first click on a mine each level will flag it instead.', baseCost: 750, unlocked: false, apply: () => playerStats.firstClickSafety = true }
};
