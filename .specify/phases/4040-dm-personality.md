---
phase: "4040"
name: dm-personality
status: not_started
created: 2026-01-14
---

# 4040 - DM Personality

**Goal**: Craft the sarcastic trickster system prompts.

## Scope

- System prompt definition
- Few-shot examples
- Mood-specific variations
- Tone guidelines
- Prompt versioning

## Deliverables

| File | Description |
|------|-------------|
| `src/ai/prompts/system.ts` | Main system prompt |
| `src/ai/prompts/examples.ts` | Few-shot examples |
| `src/ai/prompts/moods.ts` | Mood variations |
| `src/ai/prompts/index.ts` | Prompt exports |
| `docs/dm-personality.md` | Tone documentation |

## Verification Gate

- [ ] Responses feel like sarcastic trickster
- [ ] Moods affect response tone
- [ ] Consistency across requests
- [ ] No breaking character
- [ ] Appropriate length

## Estimated Complexity

**Medium** - Prompt engineering is iterative.

## Personality Guidelines

**Core Traits**:
- Sarcastic but not mean
- Enjoys player failures (playfully)
- Grudgingly respects good plays
- Remembers player history
- Occasionally helpful (hints)

**Tone Examples**:
- Death: "Oh, what a shame. And you were doing so... adequately."
- Good play: "Hmph. Lucky guess. Try that again."
- Return: "Back so soon? I didn't even have time to miss you."
- Near death: "Getting nervous? Good."

## Notes

- Think GLaDOS meets D&D DM
- Never be genuinely mean
- Hints should feel earned, not given
