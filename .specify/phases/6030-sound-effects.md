---
phase: "6030"
name: sound-effects
status: not_started
created: 2026-01-14
---

# 6030 - Sound Effects

**Goal**: Add 8-bit sound effects to all game actions.

## Scope

- Tile reveal sounds
- Damage sounds
- Loot pickup sounds
- Monster reveal sounds
- Win/lose fanfares
- UI sounds

## Deliverables

| File | Description |
|------|-------------|
| `public/audio/sfx/` | Sound effect files |
| `src/audio/sfx.ts` | SFX definitions |
| Updated components | Sound triggers |

## Verification Gate

- [ ] Click sound on reveal
- [ ] Damage sound on hit
- [ ] Coin sound on gold
- [ ] Monster growl on reveal
- [ ] Victory fanfare on win
- [ ] Defeat sound on death

## Estimated Complexity

**Low** - Trigger sounds at events.

## Sound Effects List

| Sound | Trigger | Style |
|-------|---------|-------|
| click | Tile reveal | Soft 8-bit click |
| reveal | Number reveal | Ascending blip |
| damage | Take damage | 8-bit hit |
| gold | Collect gold | Coin jingle |
| monster | Monster reveal | Low growl |
| victory | Floor clear | Short fanfare |
| defeat | Death | Sad descending |
| shop | Purchase | Cash register |

## Notes

- Source or create 8-bit sounds
- Keep sounds short (<500ms)
- Variation for common sounds
