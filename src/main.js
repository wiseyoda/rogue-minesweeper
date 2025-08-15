// Entry point that wires up UI events and kicks off the first run.
// ----------------------------------------------------------------

import { initNewRun, startLevel, handleLeftClick, handleRightClick } from './game.js';
import { dom } from './ui.js';

// Hook up event handlers
// ----------------------
dom.gridElement.addEventListener('click', handleLeftClick);
dom.gridElement.addEventListener('contextmenu', handleRightClick);
dom.startNewRunBtn.addEventListener('click', initNewRun);
dom.continueBtn.addEventListener('click', startLevel);

// Start the game
// --------------
initNewRun();
