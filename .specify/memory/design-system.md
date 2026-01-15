# Design System - Dungeon Delver

> Visual and audio design guidelines for consistent retro aesthetic.

**Last Updated**: 2026-01-15
**Status**: ACTIVE

---

## ⚠️ SOURCE OF TRUTH

**All visual design decisions are documented in the definitive UI mockup:**

📄 **[`.specify/reference/ui-mockup-definitive.html`](.specify/reference/ui-mockup-definitive.html)**

This HTML file contains:
- Live interactive mockup of the game UI
- Complete color palette with CSS custom properties
- Typography scale (6 sizes)
- Spacing system (4px base unit)
- Timing tokens for animations
- All tile states with live demos
- Button variants
- Icon library with SVG code
- Atmosphere system (brick pattern, vignette, particles, scanlines)
- Design decisions log with rationale
- Implementation notes for React development

**When in doubt, open the mockup in a browser and match it exactly.**

---

## Quick Reference (from Mockup)

### Aesthetic: Pixel Art Commitment

- **Single font**: Press Start 2P (no font mixing)
- **No rounded corners** on tiles or panels
- **Self-contained**: No external texture URLs or CDNs
- **Mystic purple (#7030b0)** as brand signature color

### Tile Size

- **Base tile**: 40px × 40px
- **Gap**: 2px between tiles
- **Base unit**: 4px (all spacing is multiples of 4)
- **Crisp pixels**: `image-rendering: pixelated`

### Color Palette

See mockup for full swatches. Key colors:

| Token | Hex | Usage |
|-------|-----|-------|
| `--void` | #05050a | Deepest background |
| `--stone-800` | #1a1814 | Panel backgrounds |
| `--bone` | #c4b8a0 | Primary text |
| `--blood` | #cc2020 | Damage, danger |
| `--gold` | #d0a020 | Loot, rewards |
| `--mystic` | #7030b0 | Brand, magic, active states |

### Number Colors (1-8)

| Number | Color | Hex |
|--------|-------|-----|
| 1 | Blue | #6090d0 |
| 2 | Green | #50a050 |
| 3 | Red | #cc2020 |
| 4 | Purple | #8040a0 |
| 5 | Maroon | #a04040 |
| 6 | Teal | #40a0a0 |
| 7 | Black | #202020 |
| 8 | Gray | #606060 |

---

## Typography

### Font

- **Only font**: Press Start 2P (Google Fonts)
- **No fallbacks visible** - if font fails to load, wait for it
- **No font mixing** - hierarchy through size/color/spacing only

### Text Sizes (from mockup)

| Name | Size | Usage |
|------|------|-------|
| Title | 12px | Panel headers |
| Large | 10px | Important numbers |
| Medium | 8px | Body text, labels |
| Small | 7px | Secondary info |
| Tiny | 6px | Metadata |
| Micro | 5px | Fine print |

---

## Audio Design

### Music: Chiptune

- Catchy loops for gameplay
- Distinct themes per floor type/biome
- Menu music (calmer)
- Victory/death stingers

### Sound Effects: 8-bit

| Action        | Sound Character     |
| ------------- | ------------------- |
| Tile reveal   | Quick chirp         |
| Monster hit   | Crunch/impact       |
| Loot pickup   | Rising chime        |
| Level up      | Triumphant fanfare  |
| Death         | Descending tones    |
| Shop purchase | Cash register bling |

### Audio Controls

- Master volume
- Music volume (separate)
- SFX volume (separate)
- Mute toggle

---

## Animation Guidelines

**See mockup for timing tokens and live examples.**

### Timing Tokens (from mockup)

| Token | Duration | Usage |
|-------|----------|-------|
| `--tick` | 50ms | Instant feedback |
| `--beat` | 100ms | Quick transitions |
| `--breath` | 200ms | Standard animations |
| `--pulse` | 400ms | Noticeable effects |
| `--wave` | 800ms | Dramatic moments |
| `--ambient` | 3-6s | Background breathing |

### Tile Interactions

- **Reveal**: `--breath` (200ms) fade/slide
- **Flag toggle**: `--beat` (100ms) with subtle bounce
- **Monster reveal**: Screen shake + danger indicator

### Feedback

- **Damage taken**: Screen shake (subtle), red flash
- **Level up**: Flash + particle burst
- **Loot**: Float up with gold sparkle

### Principles

- Keep animations snappy (< 200ms for core actions)
- Don't block gameplay with long animations
- Respect `prefers-reduced-motion`

---

## UI Components

**See mockup for live demos of all components.**

### Buttons

- **Primary**: Gold border, mystic hover glow
- **Secondary**: Stone border, subtle hover
- 3D beveled appearance (top-left light source)
- No rounded corners

### Panels

- Stone texture background (`--stone-800`)
- Gold corner accents that grow on hover
- No drop shadows (flat pixel aesthetic)
- No rounded corners

### HUD Elements

- **HP bar**: Segmented (not continuous), pulses when critical
- **Gold counter**: Coin SVG icon + number
- **Floor indicator**: "FLOOR X" label
- **Rune slots**: Active glow with mystic purple

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
