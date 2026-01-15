---
phase: '4030'
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

| File                                              | Description   |
| ------------------------------------------------- | ------------- |
| `src/components/dungeon-master/DialogueBox.tsx`   | Main dialogue |
| `src/components/dungeon-master/MoodIndicator.tsx` | Mood display  |
| `src/components/dungeon-master/Portrait.tsx`      | DM avatar     |
| `src/components/dungeon-master/index.ts`          | Exports       |
| `src/styles/dungeon-master.css`                   | DM styling    |

## Verification Gate

- [ ] Dialogue box appears
- [ ] Text animates in
- [ ] Mood indicator updates
- [ ] Portrait shows
- [ ] Can dismiss dialogue

## Estimated Complexity

**Low** - UI components with animation.

## Layout

**See `.specify/reference/ui-mockup-definitive.html` for definitive visual design.**

The mockup shows a DM Panel in the sidebar with:
- **Animated watching eye** (not static portrait) - 6s movement cycle
- **Status indicator** (e.g., "WATCHING", "AMUSED") - not mood text
- **Dialogue appears in panel** - not a popup box

```
┌─────────────────────────────────┐
│     ┌──────────────────┐        │
│     │    (o)  EYE      │        │
│     └──────────────────┘        │
│       ● WATCHING                │
│                                 │
│  "Oh, you again..."            │
└─────────────────────────────────┘
```

## Notes

- **Eye animates** - subtle movement, not static portrait
- Keep dialogue short (1-2 sentences)
- Typewriter effect for personality
- Don't block gameplay
- Use mockup colors: mystic purple for active states
- Use timing tokens (`--tick`, `--beat`, etc.) from mockup
