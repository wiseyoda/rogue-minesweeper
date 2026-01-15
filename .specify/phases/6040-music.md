---
phase: '6040'
name: music
status: not_started
created: 2026-01-14
---

# 6040 - Music

**Goal**: Add chiptune background music.

## Scope

- Background music loops
- Multiple tracks (menu, gameplay, boss, shop)
- Track transitions
- Music mute separate from SFX

## Deliverables

| File                  | Description    |
| --------------------- | -------------- |
| `public/audio/music/` | Music files    |
| `src/audio/music.ts`  | Music manager  |
| Updated scenes        | Music triggers |

## Verification Gate

- [ ] Menu music plays
- [ ] Gameplay music loops
- [ ] Boss music is different
- [ ] Shop music is calm
- [ ] Transitions are smooth
- [ ] Can mute music only

## Estimated Complexity

**Low** - Music playback.

## Track List

| Track   | Scene         | Mood        |
| ------- | ------------- | ----------- |
| title   | Title screen  | Mysterious  |
| explore | Normal floors | Adventurous |
| boss    | Boss floors   | Intense     |
| shop    | Shop screens  | Relaxed     |
| victory | Floor clear   | Triumphant  |
| defeat  | Game over     | Somber      |

## Notes

- Source or license chiptune music
- 60-90 second loops
- Seamless looping essential
