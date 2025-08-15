// Game state and persistent statistics
// -----------------------------------
// This module centralizes player and game state so other modules can
// import and mutate a single source of truth.

export const playerStats = {
    maxLives: 3,
    startingGold: 0,
    firstClickSafety: false,
};

// Runtime state for the current run. `resetState` populates this object.
export const state = {};

export const gameStats = {
    highestLevelOverall: 1,
    maxGoldRun: 0,
};

// Reset the state object to its initial values for a new run.
export function resetState() {
    Object.assign(state, {
        level: 1,
        lives: playerStats.maxLives,
        shields: 0,
        gold: playerStats.startingGold,
        gameOver: false,
        grid: [],
        rows: 0,
        cols: 0,
        mineCount: 0,
        revealedCount: 0,
        flagsPlaced: 0,
        activeBuffs: {},
        nextLevelBuffs: {},
        damageTakenThisLevel: false,
        isFirstClick: true,
        goldInterval: null,
    });
}
