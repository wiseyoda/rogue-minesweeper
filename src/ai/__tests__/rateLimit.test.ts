/**
 * Tests for provider cooldown helpers.
 * @module ai/__tests__/rateLimit
 */

import { describe, expect, it } from 'vitest';
import {
  canCallProvider,
  createProviderCooldownState,
  getProviderCooldownRemainingMs,
  markProviderCall,
} from '../rateLimit';

describe('provider cooldown helpers', () => {
  it('allows provider calls before any successful invocation', () => {
    const state = createProviderCooldownState(30_000);

    expect(canCallProvider(state, 1_000)).toBe(true);
    expect(getProviderCooldownRemainingMs(state, 1_000)).toBe(0);
  });

  it('blocks calls until cooldown window expires', () => {
    const initialState = createProviderCooldownState(30_000);
    const state = markProviderCall(initialState, 10_000);

    expect(canCallProvider(state, 20_000)).toBe(false);
    expect(getProviderCooldownRemainingMs(state, 20_000)).toBe(20_000);
    expect(canCallProvider(state, 40_000)).toBe(true);
    expect(getProviderCooldownRemainingMs(state, 40_000)).toBe(0);
  });
});
