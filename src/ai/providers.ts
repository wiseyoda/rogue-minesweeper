/**
 * AI provider configuration and model wiring.
 * @module ai/providers
 */

import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { LanguageModel } from 'ai';

export type DungeonAIProviderName = 'gemini' | 'claude';

const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';
const DEFAULT_CLAUDE_MODEL = 'claude-3-5-haiku-latest';
const DEFAULT_PROVIDER_TIMEOUT_MS = 6_000;
const DEFAULT_COOLDOWN_MS = 30_000;

/**
 * Runtime AI config sourced from Vite environment variables.
 */
export interface DungeonAIConfig {
  geminiApiKey?: string;
  claudeApiKey?: string;
  geminiModel: string;
  claudeModel: string;
  providerTimeoutMs: number;
  cooldownMs: number;
}

/**
 * Provider model handles keyed by provider name.
 */
export interface DungeonAIProviders {
  gemini?: LanguageModel;
  claude?: LanguageModel;
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function readEnv(env: Record<string, unknown>, key: string): string | undefined {
  const value = env[key];
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Resolve AI config values from `import.meta.env`.
 */
export function getDungeonAIConfig(env: Record<string, unknown> = import.meta.env): DungeonAIConfig {
  return {
    geminiApiKey: readEnv(env, 'VITE_GEMINI_API_KEY'),
    claudeApiKey: readEnv(env, 'VITE_CLAUDE_API_KEY'),
    geminiModel: readEnv(env, 'VITE_GEMINI_MODEL') ?? DEFAULT_GEMINI_MODEL,
    claudeModel: readEnv(env, 'VITE_CLAUDE_MODEL') ?? DEFAULT_CLAUDE_MODEL,
    providerTimeoutMs: parsePositiveInt(readEnv(env, 'VITE_AI_PROVIDER_TIMEOUT_MS'), DEFAULT_PROVIDER_TIMEOUT_MS),
    cooldownMs: parsePositiveInt(readEnv(env, 'VITE_AI_COOLDOWN_MS'), DEFAULT_COOLDOWN_MS),
  };
}

/**
 * Create provider model handles for configured providers.
 */
export function createDungeonAIProviders(config: DungeonAIConfig = getDungeonAIConfig()): DungeonAIProviders {
  const providers: DungeonAIProviders = {};

  if (config.geminiApiKey) {
    const googleProvider = createGoogleGenerativeAI({
      apiKey: config.geminiApiKey,
    });
    providers.gemini = googleProvider(config.geminiModel);
  }

  if (config.claudeApiKey) {
    const anthropicProvider = createAnthropic({
      apiKey: config.claudeApiKey,
    });
    providers.claude = anthropicProvider(config.claudeModel);
  }

  return providers;
}
