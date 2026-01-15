/**
 * HUD container component - heads-up display for game stats.
 * @module components/hud/HUD
 */

import { memo } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { HealthBar } from './HealthBar';
import { ShieldDisplay } from './ShieldDisplay';
import { GoldCounter } from './GoldCounter';
import { LevelIndicator } from './LevelIndicator';
import { MonsterCounter } from './MonsterCounter';
import { BuffBar } from './BuffBar';
import { MessageArea } from './MessageArea';
import type { GameMessage } from './MessageArea';

/**
 * Props for HUD component.
 */
export interface HUDProps {
  /** Optional message to display in the message area */
  message?: GameMessage | null;
}

// Granular selectors for optimal re-renders
const selectLives = (state: ReturnType<typeof useGameStore.getState>) =>
  state.player.lives;
const selectMaxLives = (state: ReturnType<typeof useGameStore.getState>) =>
  state.player.maxLives;
const selectShields = (state: ReturnType<typeof useGameStore.getState>) =>
  state.player.shields;
const selectGold = (state: ReturnType<typeof useGameStore.getState>) =>
  state.player.gold;
const selectLevel = (state: ReturnType<typeof useGameStore.getState>) =>
  state.run.level;
const selectActiveBuffs = (state: ReturnType<typeof useGameStore.getState>) =>
  state.player.activeBuffs;
const selectMonsterCount = (state: ReturnType<typeof useGameStore.getState>) =>
  state.gridConfig.monsterCount;
const selectFlagsPlaced = (state: ReturnType<typeof useGameStore.getState>) =>
  state.run.flagsPlaced;

/**
 * Main HUD container that displays all player stats and game info.
 * Uses granular selectors to minimize re-renders.
 */
export const HUD = memo(function HUD({ message }: HUDProps) {
  // Use granular selectors for each piece of state
  const lives = useGameStore(selectLives);
  const maxLives = useGameStore(selectMaxLives);
  const shields = useGameStore(selectShields);
  const gold = useGameStore(selectGold);
  const level = useGameStore(selectLevel);
  const activeBuffs = useGameStore(selectActiveBuffs);
  const monsterCount = useGameStore(selectMonsterCount);
  const flagsPlaced = useGameStore(selectFlagsPlaced);

  return (
    <div className="w-full max-w-md mx-auto p-2 bg-dungeon-shadow/30 rounded-lg">
      {/* Top row: Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        {/* Left side: Health and shields */}
        <div className="flex items-center gap-3">
          <HealthBar current={lives} max={maxLives} />
          <ShieldDisplay count={shields} />
        </div>

        {/* Right side: Resources and level */}
        <div className="flex items-center gap-3">
          <GoldCounter amount={gold} />
          <LevelIndicator level={level} />
          <MonsterCounter total={monsterCount} flagged={flagsPlaced} />
        </div>
      </div>

      {/* Middle row: Buffs */}
      <div className="flex justify-center mb-2">
        <BuffBar buffs={activeBuffs} />
      </div>

      {/* Bottom row: Messages */}
      <MessageArea message={message} />
    </div>
  );
});
