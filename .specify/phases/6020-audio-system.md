---
phase: "6020"
name: audio-system
status: not_started
created: 2026-01-14
---

# 6020 - Audio System

**Goal**: Set up audio infrastructure with Howler.js.

## Scope

- Howler.js integration
- Audio sprite loading
- Volume controls
- Mute toggle
- Audio context handling

## Deliverables

| File | Description |
|------|-------------|
| `src/audio/audioManager.ts` | Audio manager |
| `src/audio/sounds.ts` | Sound definitions |
| `src/hooks/useAudio.ts` | Audio hook |
| `src/components/ui/VolumeControl.tsx` | Volume slider |
| `src/stores/uiStore.ts` | Updated: audio settings |

## Verification Gate

- [ ] Audio loads without errors
- [ ] Volume control works
- [ ] Mute toggle works
- [ ] Audio persists setting
- [ ] No audio context errors

## Estimated Complexity

**Low** - Standard audio setup.

## Audio Categories

| Category | Volume | Examples |
|----------|--------|----------|
| SFX | 1.0 | Clicks, damage, loot |
| Music | 0.5 | Background loops |
| UI | 0.8 | Button clicks, menus |
| DM | 1.0 | DM voice (if any) |

## Notes

- Install Howler.js
- Prepare for sprite sheets
- Handle mobile audio unlock
