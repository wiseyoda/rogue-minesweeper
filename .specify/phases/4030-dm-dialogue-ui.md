---
phase: "4030"
name: dm-dialogue-ui
status: not_started
created: 2026-01-14
---

# 4030 - DM Dialogue UI

**Goal**: Build the visual components for DM communication.

## Scope

- Dialogue box component
- Text animation (typewriter effect)
- Mood indicator
- Portrait/avatar display
- Dismiss button

## Deliverables

| File | Description |
|------|-------------|
| `src/components/dungeon-master/DialogueBox.tsx` | Main dialogue |
| `src/components/dungeon-master/MoodIndicator.tsx` | Mood display |
| `src/components/dungeon-master/Portrait.tsx` | DM avatar |
| `src/components/dungeon-master/index.ts` | Exports |
| `src/styles/dungeon-master.css` | DM styling |

## Verification Gate

- [ ] Dialogue box appears
- [ ] Text animates in
- [ ] Mood indicator updates
- [ ] Portrait shows
- [ ] Can dismiss dialogue

## Estimated Complexity

**Low** - UI components with animation.

## Layout

```
┌─────────────────────────────────────┐
│  [Portrait]  "Oh, you again..."     │
│              [Mood: Amused]         │
│                              [x]    │
└─────────────────────────────────────┘
```

## Notes

- Keep dialogue short (1-2 sentences)
- Typewriter effect adds personality
- Don't block gameplay while showing
- Position at bottom of screen
