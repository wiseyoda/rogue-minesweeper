/**
 * Provider-call cooldown helpers.
 * @module ai/rateLimit
 */

export interface ProviderCooldownState {
  cooldownMs: number;
  lastProviderCallAt: number | null;
}

/**
 * Initialize cooldown state.
 */
export function createProviderCooldownState(cooldownMs: number): ProviderCooldownState {
  return {
    cooldownMs,
    lastProviderCallAt: null,
  };
}

/**
 * Returns remaining cooldown in milliseconds.
 */
export function getProviderCooldownRemainingMs(
  state: ProviderCooldownState,
  now: number = Date.now()
): number {
  if (state.lastProviderCallAt === null) {
    return 0;
  }

  const elapsed = now - state.lastProviderCallAt;
  if (elapsed >= state.cooldownMs) {
    return 0;
  }

  return state.cooldownMs - elapsed;
}

/**
 * Checks whether provider calls are allowed at the provided timestamp.
 */
export function canCallProvider(state: ProviderCooldownState, now: number = Date.now()): boolean {
  return getProviderCooldownRemainingMs(state, now) === 0;
}

/**
 * Records a successful provider call timestamp.
 */
export function markProviderCall(
  state: ProviderCooldownState,
  now: number = Date.now()
): ProviderCooldownState {
  return {
    cooldownMs: state.cooldownMs,
    lastProviderCallAt: now,
  };
}
