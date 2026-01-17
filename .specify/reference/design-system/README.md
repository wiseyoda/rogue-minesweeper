# Design System Reference

Split from `ui-mockup-definitive.html` for easier agent access.

## Files

| File | Purpose |
|------|---------|
| `01-tokens.css` | CSS custom properties (colors, timing, scale) |
| `02-foundation.css` | Reset, font loading, body styles |
| `03-atmosphere.css` | Fixed background layers (brick, vignette, particles, scanlines) |
| `04-tiles.css` | Game tiles with 3D bevel effect |
| `05-panels.css` | Reusable panel component with corner accents |
| `06-dm-panel.css` | Dungeon Master panel with animated eye |
| `07-vitals-panel.css` | Health bar (segmented), gold, shields |
| `08-runes-panel.css` | Active runes/buffs display |
| `09-buttons.css` | Primary (gold) and secondary buttons |
| `10-layout.css` | Two-column grid layout, header, footer |
| `11-icons.md` | SVG icon definitions |
| `12-effects.css` | Floating text, shake, pulse animations |

## Implementation Order

1. **Tokens first** - Import/create tokens.css
2. **Foundation** - Apply reset and body styles
3. **Atmosphere** - Add fixed background layers
4. **Layout** - Set up two-column grid structure
5. **Panels** - Create reusable Panel component
6. **Tiles** - Update Tile component styling
7. **Sidebar** - Build DM, Vitals, Runes panels
8. **Buttons** - Update button styling
9. **Effects** - Add floating text and animations

## Key Principles (from mockup docs)

1. **Pure Pixel Art** - Single font (Press Start 2P), square tiles, NO border-radius
2. **Self-Contained** - All textures inline (data URIs), no external dependencies
3. **Living Atmosphere** - Particles, breathing effects, watching eye
4. **Mystic Purple (#7030b0)** - Brand signature color
5. **Tactile Feedback** - 3-state buttons (normal, hover, pressed), 3D bevels

## What NOT to Do

- No rounded corners on tiles
- No multiple fonts
- No external texture URLs
- No generic icons
- No glassmorphism
- No Tailwind CDN

## Original Source

Full mockup: `../.specify/reference/ui-mockup-definitive.html`

Open in browser for visual reference.
