/**
 * Pre-written fallback dialogue for provider failures/cooldown windows.
 * @module ai/fallback
 */

import type { DungeonMasterRequestType, DungeonMasterResponse } from '@/types';

const FALLBACK_RESPONSES: Record<DungeonMasterRequestType, DungeonMasterResponse[]> = {
  taunt: [
    {
      dialogue: 'Luck is only a rumor. Keep digging if you dare.',
      mood: 'amused',
    },
    {
      dialogue: 'You call that caution? I call it hesitation.',
      mood: 'bored',
    },
  ],
  hint: [
    {
      dialogue: 'The corners are kinder than the center right now.',
      mood: 'curious',
      hintType: 'safe_path',
      hintContent: 'Probe outward from already-numbered safe tiles first.',
    },
    {
      dialogue: 'Your runes are whispering. Listen before you click.',
      mood: 'impressed',
      hintType: 'rune_synergy',
      hintContent: 'Pair information runes with defense before risky reveals.',
    },
  ],
  mood_update: [
    {
      dialogue: 'Interesting. You are adapting faster than most.',
      mood: 'impressed',
      difficultyAdjustment: 0,
    },
    {
      dialogue: 'I expected panic, yet you remain composed.',
      mood: 'curious',
      difficultyAdjustment: 0,
    },
  ],
  death: [
    {
      dialogue: 'Another brave hero, another cautionary tale.',
      mood: 'vengeful',
      difficultyAdjustment: -1,
    },
    {
      dialogue: 'Defeat is a lesson. If you can stomach one more.',
      mood: 'amused',
      difficultyAdjustment: -1,
    },
  ],
  victory: [
    {
      dialogue: 'You survived. Do not confuse that with winning.',
      mood: 'bored',
      difficultyAdjustment: 1,
    },
    {
      dialogue: 'Impressive. I will make the next floor less forgiving.',
      mood: 'vengeful',
      difficultyAdjustment: 1,
    },
  ],
};

/**
 * Returns one fallback response for a given request type.
 *
 * `random` is injectable to guarantee deterministic test behavior.
 */
export function getFallbackDungeonMasterResponse(
  requestType: DungeonMasterRequestType,
  random: () => number = Math.random
): DungeonMasterResponse {
  const options = FALLBACK_RESPONSES[requestType];
  const index = Math.floor(Math.max(0, Math.min(0.999999, random())) * options.length);
  const selected = options[index] ?? options[0];

  if (!selected) {
    return {
      dialogue: 'The dungeon is silent... for now.',
      mood: 'bored',
    };
  }

  return {
    ...selected,
  };
}
