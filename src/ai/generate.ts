/**
 * Dungeon Master response generation orchestration.
 * @module ai/generate
 */

import { generateText } from 'ai';
import type { LanguageModel } from 'ai';
import type { DungeonMasterContext, DungeonMasterGenerationResult } from '@/types';
import { getFallbackDungeonMasterResponse } from './fallback';
import { parseDungeonMasterResponse } from './parser';
import {
  canCallProvider,
  createProviderCooldownState,
  getProviderCooldownRemainingMs,
  markProviderCall,
} from './rateLimit';
import {
  createDungeonAIProviders,
  getDungeonAIConfig,
  type DungeonAIConfig,
  type DungeonAIProviderName,
  type DungeonAIProviders,
} from './providers';

const PROVIDER_SEQUENCE: DungeonAIProviderName[] = ['gemini', 'claude'];
const DEFAULT_TEMPERATURE = 0.7;

interface GenerateTextInput {
  model: LanguageModel;
  system: string;
  prompt: string;
  temperature: number;
  timeout: number;
  maxRetries: number;
}

type GenerateTextFn = (input: GenerateTextInput) => Promise<{ text: string }>;

type ProviderErrors = Partial<Record<DungeonAIProviderName, string>>;

export interface DungeonMasterGenerateOptions {
  systemPrompt?: string;
  prompt?: string;
  temperature?: number;
}

export interface DungeonMasterGenerator {
  generate(
    context: DungeonMasterContext,
    options?: DungeonMasterGenerateOptions
  ): Promise<DungeonMasterGenerationResult>;
  getCooldownRemainingMs(now?: number): number;
  resetCooldown(): void;
}

export interface DungeonMasterGeneratorDependencies {
  config?: DungeonAIConfig;
  providers?: DungeonAIProviders;
  generateTextImpl?: GenerateTextFn;
  now?: () => number;
  random?: () => number;
  invokeProvider?: (args: {
    provider: DungeonAIProviderName;
    system: string;
    prompt: string;
    temperature: number;
    timeoutMs: number;
  }) => Promise<string>;
}

const DEFAULT_SYSTEM_PROMPT =
  'You are the Dungeon Master in a roguelike minesweeper game. ' +
  'Respond ONLY as JSON matching the required schema.';

function serializeError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'unknown_error';
}

function buildPrompt(context: DungeonMasterContext): string {
  return [
    'Return a single JSON object with fields: dialogue, mood, difficultyAdjustment, hintType, hintContent.',
    'Use mood one of: amused, bored, impressed, vengeful, curious.',
    'If hintType is omitted, omit hintContent.',
    `Context: ${JSON.stringify(context)}`,
  ].join('\n');
}

function buildDefaultInvokeProvider(
  providers: DungeonAIProviders,
  generateTextImpl: GenerateTextFn
): NonNullable<DungeonMasterGeneratorDependencies['invokeProvider']> {
  return async ({ provider, system, prompt, temperature, timeoutMs }) => {
    const model = providers[provider];
    if (!model) {
      throw new Error('provider_not_configured');
    }

    const result = await generateTextImpl({
      model,
      system,
      prompt,
      temperature,
      timeout: timeoutMs,
      maxRetries: 0,
    });

    return result.text;
  };
}

/**
 * Create a stateful Dungeon Master generator with provider fallback chain.
 */
export function createDungeonMasterGenerator(
  deps: DungeonMasterGeneratorDependencies = {}
): DungeonMasterGenerator {
  const config = deps.config ?? getDungeonAIConfig();
  const providers = deps.providers ?? createDungeonAIProviders(config);
  const generateTextImpl = deps.generateTextImpl ?? (generateText as unknown as GenerateTextFn);
  const invokeProvider = deps.invokeProvider ?? buildDefaultInvokeProvider(providers, generateTextImpl);
  const now = deps.now ?? (() => Date.now());
  const random = deps.random ?? Math.random;

  let cooldownState = createProviderCooldownState(config.cooldownMs);

  async function generate(
    context: DungeonMasterContext,
    options: DungeonMasterGenerateOptions = {}
  ): Promise<DungeonMasterGenerationResult> {
    const providerErrors: ProviderErrors = {};
    const timestamp = now();

    if (!canCallProvider(cooldownState, timestamp)) {
      return {
        response: getFallbackDungeonMasterResponse(context.requestType, random),
        source: 'fallback',
        providerErrors,
        cooldownActive: true,
      };
    }

    const systemPrompt = options.systemPrompt ?? DEFAULT_SYSTEM_PROMPT;
    const prompt = options.prompt ?? buildPrompt(context);
    const temperature = options.temperature ?? DEFAULT_TEMPERATURE;

    for (const provider of PROVIDER_SEQUENCE) {
      if (!providers[provider] && !deps.invokeProvider) {
        providerErrors[provider] = 'provider_not_configured';
        continue;
      }

      try {
        const text = await invokeProvider({
          provider,
          system: systemPrompt,
          prompt,
          temperature,
          timeoutMs: config.providerTimeoutMs,
        });

        const parsed = parseDungeonMasterResponse(text);
        if (!parsed.ok) {
          providerErrors[provider] = `parse_error: ${parsed.error}`;
          continue;
        }

        cooldownState = markProviderCall(cooldownState, now());
        return {
          response: parsed.value,
          source: provider,
          providerErrors,
          cooldownActive: false,
        };
      } catch (error) {
        providerErrors[provider] = serializeError(error);
      }
    }

    return {
      response: getFallbackDungeonMasterResponse(context.requestType, random),
      source: 'fallback',
      providerErrors,
      cooldownActive: false,
    };
  }

  return {
    generate,
    getCooldownRemainingMs(checkAt?: number): number {
      return getProviderCooldownRemainingMs(cooldownState, checkAt ?? now());
    },
    resetCooldown(): void {
      cooldownState = createProviderCooldownState(config.cooldownMs);
    },
  };
}

/**
 * Default singleton generator for app runtime usage.
 */
export const dungeonMasterGenerator = createDungeonMasterGenerator();
