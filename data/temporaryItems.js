const temporaryItems = {
    common: [
        { id: 'c1', name: 'Minor Shield Patch', description: 'Instantly regain 1 shield.', cost: 30, apply: () => { if(state.shields < playerStats.maxShields) state.shields++; } },
        { id: 'c2', name: 'Small Gold Cache', description: 'Instantly gain 25 gold.', cost: 0, apply: () => state.gold += 25 },
        { id: 'c3', name: 'Steady Hand', description: 'The next mine you hit will not consume a shield.', cost: 40, apply: () => state.nextLevelBuffs.steadyHand = true },
        { id: 'c4', name: 'Basic Goggles', description: 'Reveals 1 random safe tile at the start of the next level.', cost: 20, apply: () => state.nextLevelBuffs.revealTiles = (state.nextLevelBuffs.revealTiles || 0) + 1 },
        { id: 'c5', name: 'Scrap Metal', description: 'Gain 1 gold for every 10 tiles revealed on the next level.', cost: 15, apply: () => state.nextLevelBuffs.scrapMetal = true },
    ],
    uncommon: [
        { id: 'u1', name: 'Shield Plating', description: 'Gain +1 temporary shield for the next level.', cost: 60, apply: () => state.nextLevelBuffs.temporaryShields = (state.nextLevelBuffs.temporaryShields || 0) + 1 },
        { id: 'u2', name: 'Gold Magnet', description: 'Double all gold earned from tiles on the next level.', cost: 50, apply: () => state.nextLevelBuffs.goldMagnet = true },
        { id: 'u3', name: 'Bomb Squad', description: 'Automatically flags 2 random mines at the start of the next level.', cost: 75, apply: () => state.nextLevelBuffs.bombSquad = (state.nextLevelBuffs.bombSquad || 0) + 2 },
        { id: 'u4', name: 'Advanced Goggles', description: 'Reveals 3 random safe tiles at the start of the next level.', cost: 50, apply: () => state.nextLevelBuffs.revealTiles = (state.nextLevelBuffs.revealTiles || 0) + 3 },
        { id: 'u5', name: 'Shield Battery', description: 'If you complete the next level without taking damage, gain 1 shield.', cost: 80, apply: () => state.nextLevelBuffs.shieldBattery = true },
    ],
    rare: [
        { id: 'r1', name: 'Full Shield Repair', description: 'Restore all missing shields.', cost: 150, apply: () => state.shields = playerStats.maxShields },
        { id: 'r2', name: 'Forcefield', description: 'Become immune to mine damage for the next 10 clicks.', cost: 120, apply: () => state.nextLevelBuffs.forcefield = (state.nextLevelBuffs.forcefield || 0) + 10 },
        { id: 'r3', name: 'Master Goggles', description: "Reveals all '0' tiles at the start of the next level.", cost: 100, apply: () => state.nextLevelBuffs.masterGoggles = true },
        { id: 'r4', name: 'Elite Bomb Squad', description: 'Automatically flags 25% of all mines at the next level.', cost: 200, apply: () => state.nextLevelBuffs.eliteBombSquad = true },
    ],
    legendary: [
        { id: 'l1', name: 'Extra Life', description: 'The next time you would lose your last shield, it is restored to full instead.', cost: 400, apply: () => state.activeBuffs.extraLife = true },
        { id: 'l2', name: 'Mine Neutralizer', description: 'Removes 10% of the mines from the next level.', cost: 300, apply: () => state.nextLevelBuffs.mineNeutralizer = true },
        { id: 'l3', name: 'Golden Goose', description: 'Permanently gain 1 gold every 5 seconds for the rest of the run.', cost: 350, apply: () => state.activeBuffs.goldenGoose = true },
    ]
};
