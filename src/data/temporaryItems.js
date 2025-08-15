export const temporaryItems = {
    common: [
        {
            id: 'c1',
            name: 'Minor Heart Patch',
            description: 'Instantly regain 1 life.',
            cost: 30,
            apply(state, playerStats) {
                if (state.lives < playerStats.maxLives) state.lives++;
            },
        },
        {
            id: 'c2',
            name: 'Small Gold Cache',
            description: 'Instantly gain 25 gold.',
            cost: 0,
            apply(state) {
                state.gold += 25;
            },
        },
        {
            id: 'c3',
            name: 'Steady Hand',
            description: 'The next monster you hit will not consume a life.',
            cost: 40,
            apply(state) {
                state.nextLevelBuffs.steadyHand = true;
            },
        },
        {
            id: 'c4',
            name: 'Basic Goggles',
            description: 'Reveals 1 random safe tile at the start of the next level.',
            cost: 20,
            apply(state) {
                state.nextLevelBuffs.revealTiles = (state.nextLevelBuffs.revealTiles || 0) + 1;
            },
        },
        {
            id: 'c5',
            name: 'Scrap Metal',
            description: 'Gain 1 gold for every 10 tiles revealed on the next level.',
            cost: 15,
            apply(state) {
                state.nextLevelBuffs.scrapMetal = true;
            },
        },
    ],
    uncommon: [
        {
            id: 'u1',
            name: 'Shield Plating',
            description: 'Gain +1 shield for the next level.',
            cost: 60,
            apply(state) {
                state.nextLevelBuffs.shields = (state.nextLevelBuffs.shields || 0) + 1;
            },
        },
        {
            id: 'u2',
            name: 'Gold Magnet',
            description: 'Double all gold earned from tiles on the next level.',
            cost: 50,
            apply(state) {
                state.nextLevelBuffs.goldMagnet = true;
            },
        },
        {
            id: 'u3',
            name: 'Monster Tracker',
            description: 'Automatically flags 2 random monsters at the start of the next level.',
            cost: 75,
            apply(state) {
                state.nextLevelBuffs.monsterTracker = (state.nextLevelBuffs.monsterTracker || 0) + 2;
            },
        },
        {
            id: 'u4',
            name: 'Advanced Goggles',
            description: 'Reveals 3 random safe tiles at the start of the next level.',
            cost: 50,
            apply(state) {
                state.nextLevelBuffs.revealTiles = (state.nextLevelBuffs.revealTiles || 0) + 3;
            },
        },
        {
            id: 'u5',
            name: 'Shield Battery',
            description: 'If you complete the next level without taking damage, gain 1 life.',
            cost: 80,
            apply(state) {
                state.nextLevelBuffs.shieldBattery = true;
            },
        },
    ],
    rare: [
        {
            id: 'r1',
            name: 'Full Heart Repair',
            description: 'Restore all missing lives.',
            cost: 150,
            apply(state, playerStats) {
                state.lives = playerStats.maxLives;
            },
        },
        {
            id: 'r2',
            name: 'Forcefield',
            description: 'Become immune to monster attacks for the next 10 clicks.',
            cost: 120,
            apply(state) {
                state.nextLevelBuffs.forcefield = (state.nextLevelBuffs.forcefield || 0) + 10;
            },
        },
        {
            id: 'r3',
            name: 'Master Goggles',
            description: "Reveals all '0' tiles at the start of the next level.",
            cost: 100,
            apply(state) {
                state.nextLevelBuffs.masterGoggles = true;
            },
        },
        {
            id: 'r4',
            name: 'Elite Monster Tracker',
            description: 'Automatically flags 25% of all monsters at the next level.',
            cost: 200,
            apply(state) {
                state.nextLevelBuffs.eliteMonsterTracker = true;
            },
        },
    ],
    legendary: [
        {
            id: 'l1',
            name: 'Extra Life',
            description: 'The next time you would lose your last life, it is restored to full instead.',
            cost: 400,
            apply(state) {
                state.activeBuffs.extraLife = true;
            },
        },
        {
            id: 'l2',
            name: 'Monster Repellent',
            description: 'Removes 10% of the monsters from the next level.',
            cost: 300,
            apply(state) {
                state.nextLevelBuffs.monsterRepellent = true;
            },
        },
        {
            id: 'l3',
            name: 'Golden Goose',
            description: 'Permanently gain 1 gold every 5 seconds for the rest of the run.',
            cost: 350,
            apply(state) {
                state.activeBuffs.goldenGoose = true;
            },
        },
    ],
};
