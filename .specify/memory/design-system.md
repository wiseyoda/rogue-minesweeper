# Design System - Dungeon Delver

> Visual and audio design guidelines for consistent retro aesthetic.

**Last Updated**: 2026-01-14
**Status**: ACTIVE

---

## Visual Style

### Aesthetic: Pixel Art
Classic 8-bit/16-bit retro feel with hand-crafted sprites.

**Inspirations**:
- Classic roguelikes (Pixel Dungeon, Shattered Pixel Dungeon)
- Early Zelda games
- D&D monster manual aesthetic

### Tile Size
- **Base tile**: 32x32 pixels (scalable)
- **Sprite scale**: 2x or 4x depending on viewport
- **Crisp pixels**: `image-rendering: pixelated`

### Color Palette
TBD - Define a limited retro palette:
- Dungeon floor tones (grays, browns)
- Monster colors (reds, greens for danger)
- Loot/gold highlights (yellows, golds)
- UI accents (blues, purples for magic)

---

## Typography

### Font Stack
- **Primary**: Pixel font (e.g., Press Start 2P, Silkscreen)
- **Numbers**: Monospace pixel font for damage numbers, gold
- **Fallback**: System monospace

### Text Sizes
- **Title**: Large, decorative
- **UI Labels**: Medium, readable
- **Tooltips**: Small, detailed

---

## Audio Design

### Music: Chiptune
- Catchy loops for gameplay
- Distinct themes per floor type/biome
- Menu music (calmer)
- Victory/death stingers

### Sound Effects: 8-bit
| Action | Sound Character |
|--------|-----------------|
| Tile reveal | Quick chirp |
| Monster hit | Crunch/impact |
| Loot pickup | Rising chime |
| Level up | Triumphant fanfare |
| Death | Descending tones |
| Shop purchase | Cash register bling |

### Audio Controls
- Master volume
- Music volume (separate)
- SFX volume (separate)
- Mute toggle

---

## Animation Guidelines

### Tile Interactions
- **Reveal**: Quick fade/slide in (100-150ms)
- **Flag toggle**: Instant with subtle bounce
- **Monster reveal**: Shake + danger indicator

### Feedback
- **Damage taken**: Screen shake (subtle)
- **Level up**: Flash + particle burst
- **Loot**: Float up with sparkle

### Timing
- Keep animations snappy (< 200ms for core actions)
- Don't block gameplay with long animations
- Allow animation canceling for speed runners

---

## UI Components

### Buttons
- Pixel art borders
- Hover: Slight scale or color shift
- Active: Pressed/inset appearance

### Panels/Modals
- Stone/parchment texture
- Consistent border treatment
- Drop shadow for depth

### HUD Elements
- HP bar: Heart-based or classic bar
- Gold counter: Coin icon + number
- Floor indicator: Dungeon depth display
- Power-up indicators: Icon row

---

## Theming

### Current Theme: D&D Dungeon
- Monsters instead of mines
- Dungeon floors instead of levels
- Gold instead of generic score
- Fantasy terminology throughout

### Future Themes (Potential)
- Different dungeon biomes (cave, crypt, forest)
- Seasonal themes
- Alternative art packs
