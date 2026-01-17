# UX Patterns - Dungeon Delver

> User experience guidelines and interaction patterns.

**Last Updated**: 2026-01-14
**Status**: ACTIVE

---

## Input Methods

### MVP: Mouse Only
Classic Minesweeper controls:
- **Left click**: Reveal tile
- **Right click**: Flag tile (mark as monster)
- **Click on number**: Chord reveal (if flags match)

### Future: Touch Support (PWA)
- **Tap**: Reveal tile
- **Long press**: Flag tile
- **Double tap**: Chord reveal

### Keyboard Shortcuts (Future)
| Key | Action |
|-----|--------|
| `Space` | Pause/unpause |
| `Escape` | Open menu |
| `R` | Quick restart (after death) |
| `M` | Toggle music |
| `1-9` | Use power-up slot |

---

## Onboarding

### Philosophy: Learn by Playing
No explicit tutorial. Game teaches through design:
- First floor is small (5x5) with few monsters
- Safe starting zone guaranteed
- Tooltips appear on first encounter with new mechanics

### Progressive Disclosure
| Encounter | Explanation |
|-----------|-------------|
| First monster hit | "Ouch! Monsters deal damage. Avoid them!" |
| First power-up | Brief tooltip explaining effect |
| First shop | Quick overview of shop mechanics |
| First death | "Spend gold on permanent upgrades!" |

### Retry Friction
- Death → Results screen → One-click restart
- No unnecessary confirmation dialogs
- "One more run" should be instant

---

## Game Flow

### Run Start
1. Main menu (if no run in progress)
2. Select class (when unlocked)
3. Confirm/modify settings
4. Spawn on floor 1

### Floor Transition
1. Clear current floor (all safe tiles revealed)
2. Celebrate briefly (XP gain, loot tally)
3. Shop appears (optional purchases)
4. "Enter next floor" button
5. Load new floor with increased difficulty

### Death Flow
1. Monster kills player
2. Death animation + sound
3. Results screen (floors cleared, gold earned, stats)
4. "Spend gold" → Permanent upgrade shop
5. "New run" or "Main menu"

### Pause Menu
- Resume
- Settings (audio, controls)
- Abandon run (with confirmation)
- Main menu (loses progress)

---

## Feedback Patterns

### Visual Feedback
| Action | Feedback |
|--------|----------|
| Hover over tile | Subtle highlight |
| Valid reveal | Smooth reveal animation |
| Monster revealed | Screen shake, damage number |
| HP gained | Green flash, float number |
| HP lost | Red flash, screen shake |
| Gold gained | Coin icon floats up |
| Power-up activated | Icon glow + particle effect |

### Audio Feedback
Every meaningful action has a sound. Critical for game feel.

### Haptic Feedback (Future PWA)
- Monster hit: Strong vibration
- Loot pickup: Light tap
- Level up: Pattern vibration

---

## Accessibility Considerations

### Color
- Don't rely solely on color for information
- High contrast mode (future)
- Colorblind-friendly monster indicators

### Motion
- Respect `prefers-reduced-motion`
- Skip non-essential animations when enabled

### Screen Readers
- Semantic HTML where possible
- ARIA labels for interactive elements (future)

---

## Performance Guidelines

### Responsiveness
- Core interactions must feel instant (< 50ms response)
- Never block UI during calculations
- Lazy load non-critical assets

### Loading States
- Show progress for initial load
- Skeleton states for async content
- Never show blank screens
