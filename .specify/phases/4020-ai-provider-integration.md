---
phase: '4020'
name: ai-provider-integration
status: not_started
created: 2026-01-14
---

# 4020 - AI Provider Integration

**Goal**: Integrate Vercel AI SDK with multiple providers.

## Scope

- Install Vercel AI SDK
- Configure Gemini provider (primary)
- Configure Claude provider (fallback)
- Response parsing
- Error handling and fallbacks
- Rate limiting

## Deliverables

| File                  | Description                |
| --------------------- | -------------------------- |
| `src/ai/providers.ts` | Provider configuration     |
| `src/ai/generate.ts`  | Generation wrapper         |
| `src/ai/parser.ts`    | Response parsing           |
| `src/ai/fallback.ts`  | Pre-written fallback lines |
| `.env.example`        | API key configuration      |

## Verification Gate

- [ ] Can call Gemini API
- [ ] Can call Claude API
- [ ] Responses parse correctly
- [ ] Fallback to pre-written lines on failure
- [ ] Rate limiting prevents spam

## Estimated Complexity

**Medium** - External API integration.

## Response Format

```typescript
interface DungeonMasterResponse {
  dialogue: string;
  mood: 'amused' | 'bored' | 'impressed' | 'vengeful' | 'curious';
  difficultyAdjustment?: number; // -1 to +1
  hintType?: 'rune_synergy' | 'monster_warning' | 'safe_path';
  hintContent?: string;
}
```

## Notes

- Use JSON mode for reliable parsing
- Temperature ~0.7 for personality with consistency
- Max 1 API call per 30 seconds
- Cache responses when possible
