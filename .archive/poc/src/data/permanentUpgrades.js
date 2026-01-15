export const permanentUpgrades = {
  maxLives: {
    name: 'Blessed Armor',
    description: 'Increase max lives by 1.',
    baseCost: 50,
    costIncrease: 2,
    level: 0,
    maxLevel: 10,
    apply(playerStats) {
      playerStats.maxLives++;
    },
  },
  startingGold: {
    name: 'Treasure Map',
    description: 'Start each run with extra gold.',
    baseCost: 100,
    costIncrease: 1.8,
    level: 0,
    maxLevel: 5,
    apply(playerStats) {
      playerStats.startingGold += 25;
    },
  },
  firstClickSafety: {
    name: 'Monster Ward',
    description: 'Your first click on a monster each level will flag it instead.',
    baseCost: 750,
    unlocked: false,
    apply(playerStats) {
      playerStats.firstClickSafety = true;
    },
  },
};
