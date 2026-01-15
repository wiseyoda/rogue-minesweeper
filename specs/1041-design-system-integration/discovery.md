# Discovery: Phase 1041 - Design System Integration

## Current State Analysis

### Existing Architecture

**Theme System** (`src/index.css`):
- Uses Tailwind v4 with `@theme` block for CSS custom properties
- Light parchment theme: `--color-dungeon-parchment: #fef3c7`
- Current fonts: Cinzel (headings), Merriweather (body)
- Dungeon color palette: stone, amber, blood, gold, shadow

**Layout Structure** (`src/App.tsx`):
- Top-level `min-h-screen` container with centered flex layout
- HUD positioned horizontally at top of game board
- GameContainer wraps HUD + GameBoard + Modals
- Simple vertical stack: Title → HUD → Board → Reset Button → Instructions

**Component Structure**:
- `src/components/game/` - Tile, GameBoard, NumberDisplay, icons
- `src/components/hud/` - HUD, HealthBar, GoldCounter, ShieldDisplay, LevelIndicator, MonsterCounter, BuffBar, MessageArea
- `src/components/ui/` - GameOverModal, WinModal, GameContainer

**Tile Component** (`src/components/game/Tile.tsx`):
- Uses Tailwind utility classes: `rounded`, `border`, `bg-dungeon-*`
- 32px minimum size (`min-w-[32px] min-h-[32px]`)
- Aspect-square with centered flex layout
- NO 3D bevel effect - flat styling with hover transitions

### Target State (from mockup)

**Theme**:
- Dark void background (`#05050a`)
- Stone scale: 950/900/850/800/700/600/500/400/300/200
- Semantic colors: bone, blood, gold, mystic, venom, ice
- Expanded color palette with void/shadow/dark/base/bright/glow variants

**Typography**:
- Single font: Press Start 2P (pixel art style)
- Size scale: 22px (title), 12px (base), 10px, 7px, 6px, 5px

**Layout**:
- Two-column grid: Game board (1fr) + Sidebar (280px)
- Sidebar with 3 panels: DM Panel, Vitals Panel, Runes Panel
- Bottom action buttons area

**Tiles**:
- 40px square, no rounded corners
- 3D bevel effect with border-color sides (light top-left, dark bottom-right)
- Inset shadows and raised appearance
- Multiple states: hidden, revealed, flagged, question, hit

**Atmosphere**:
- Brick pattern background (SVG data URI)
- Vignette (radial gradient edge darkening)
- Mystic aura (breathing purple glow)
- Particle field (floating dust)
- Scanlines (subtle CRT effect)

**Panel Design**:
- Gradient backgrounds with stone colors
- 3D box shadows
- Animated corner accents (expand on hover)

### Gap Analysis

| Area | Current | Target | Complexity |
|------|---------|--------|------------|
| Theme | Light parchment | Dark void | Medium |
| Font | Cinzel + Merriweather | Press Start 2P only | Low |
| Layout | Top HUD | Sidebar panels | High |
| Tiles | Flat, rounded | 3D bevel, square | Medium |
| Atmosphere | None | 5 layers | Medium |
| Animations | Minimal | Many keyframes | Medium |
| Icons | Emoji/text | SVG components | Medium |

### Codebase Integration Points

1. **CSS Variables**: Replace `@theme` block in `index.css` with new token system
2. **Tailwind**: May need custom utilities for 3D effects, or switch to pure CSS
3. **Component Props**: Minimal changes - mostly styling updates
4. **Store**: No changes needed - design layer only
5. **Tests**: May need snapshot updates

### Existing Patterns to Preserve

- Zustand store with granular selectors
- Memo/useCallback optimization pattern
- Component composition (Tile → NumberDisplay, FlagIcon, etc.)
- Accessibility (aria-labels on tiles)

## Clarifications Resolved

1. **CSS Approach**: **Hybrid** - Use CSS custom properties for tokens/animations + Tailwind for layout utilities. Matches existing architecture while enabling mockup's complex effects.

2. **Sidebar Scope**: **Visual Only** - Implement visual appearance + animations (eye movement, breathing glow). Static placeholder text. Full DM messaging logic deferred to future phase.

3. **Mockup Reference**: Split into logical reference files at `.specify/reference/design-system/` for easier agent access:
   - `01-tokens.css` - All CSS custom properties
   - `02-foundation.css` - Reset, font, body
   - `03-atmosphere.css` - Background layers
   - `04-tiles.css` - 3D bevel tiles
   - `05-panels.css` - Reusable panel component
   - `06-dm-panel.css` - Animated eye panel
   - `07-vitals-panel.css` - Health, gold, shields
   - `08-runes-panel.css` - Buff slots
   - `09-buttons.css` - Primary/secondary buttons
   - `10-layout.css` - Two-column grid
   - `11-icons.md` - SVG definitions
   - `12-effects.css` - Floating text, animations
