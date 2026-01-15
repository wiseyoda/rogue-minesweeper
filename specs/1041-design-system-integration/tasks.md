# Tasks: Phase 1041 - Design System Integration

## Task Overview

| Phase | Tasks | Description |
|-------|-------|-------------|
| Setup | T001-T003 | Create foundation files |
| Atmosphere | T004-T010 | Background effect components |
| UI Blocks | T011-T016 | Reusable UI components |
| Icons | T017-T023 | SVG icon components |
| Sidebar | T024-T029 | Sidebar panel components |
| Tiles | T030-T033 | Update tile styling |
| Layout | T034-T038 | App layout restructure |
| Polish | T039-T042 | Testing and cleanup |

---

## Phase A: Setup

### T001 [P1] Create design tokens CSS file

**File**: `src/styles/tokens.css`

Create CSS custom properties file with all design tokens from `.specify/reference/design-system/01-tokens.css`:

- Void/abyss/deep colors
- Stone color scale (950-200)
- Bone color scale
- Blood color scale
- Gold color scale
- Mystic color scale
- Venom and ice colors
- Number colors (--num-1 through --num-8)
- Timing tokens (tick, beat, breath, pulse, wave)
- Scale tokens (tile, gap, unit)

---

### T002 [P1] Create animations CSS file

**File**: `src/styles/animations.css`

Create keyframe animations file with:

- `aura-breathe` - 8s breathing glow
- `particle-float` - 20s upward float
- `eye-look` - 6s eye movement
- `status-blink` - 1.5s blinking dot
- `flag-planted` - 0.3s bounce
- `question-wobble` - 1s wobble
- `hit-shake` - 0.4s shake
- `hit-glow` - 0.8s pulsing glow
- `health-critical` - 0.4s HP pulse
- `float-away` - 1.5s float up and fade
- `title-pulse` - 4s title brightness
- `gem-sparkle` - 2s title gems
- `env-pulse` - 2s environment dot
- `threat-pulse` - 0.8s threat meter
- `dm-glow` - 3s DM corner glow

---

### T003 [P1] Update index.css with new foundation

**File**: `src/index.css`

Changes:
- [x] Import tokens.css
- [x] Import animations.css
- [x] Add Google Fonts import for Press Start 2P
- [x] Remove @theme block (Tailwind custom theme)
- [x] Remove Cinzel and Merriweather font references
- [x] Add pixel rendering mode to html
- [x] Update body styles (background, font, cursor)
- [x] Add custom scrollbar styling
- [x] Add ::selection styling

---

## Phase B: Atmosphere Components

### T004 [P2] Create BrickPattern atmosphere component

**File**: `src/components/atmosphere/BrickPattern.tsx`

Create fixed-position component with:
- SVG data URI brick pattern background
- z-index: 0
- opacity: 0.4
- pointer-events: none

Reference: `.specify/reference/design-system/03-atmosphere.css` `.atmosphere` class

---

### T005 [P2] Create Vignette atmosphere component

**File**: `src/components/atmosphere/Vignette.tsx`

Create fixed-position component with:
- Radial gradient (transparent center, dark edges)
- z-index: 1
- pointer-events: none

Reference: `.specify/reference/design-system/03-atmosphere.css` `.vignette` class

---

### T006 [P2] Create MysticAura atmosphere component

**File**: `src/components/atmosphere/MysticAura.tsx`

Create fixed-position component with:
- Centered radial gradient (mystic purple)
- 600px x 350px size
- z-index: 1
- aura-breathe animation (8s)
- pointer-events: none

Reference: `.specify/reference/design-system/03-atmosphere.css` `.mystic-aura` class

---

### T007 [P2] Create ParticleField atmosphere component

**File**: `src/components/atmosphere/ParticleField.tsx`

Create component with:
- Container at z-index: 2
- 8 particle divs with staggered animation-delay
- particle-float animation (20s)
- Each particle 2px square, bone color
- pointer-events: none

Reference: `.specify/reference/design-system/03-atmosphere.css` `.particle-field` class

---

### T008 [P2] Create Scanlines atmosphere component

**File**: `src/components/atmosphere/Scanlines.tsx`

Create fixed-position component with:
- Repeating linear gradient (subtle lines)
- z-index: 100
- pointer-events: none

Reference: `.specify/reference/design-system/03-atmosphere.css` `.scanlines` class

---

### T009 [P2] Add prefers-reduced-motion support to atmosphere

Update all atmosphere components to check `prefers-reduced-motion`:
- Disable animations when reduced motion preferred
- Keep static backgrounds visible

---

### T010 [P2] Create atmosphere components index

**File**: `src/components/atmosphere/index.ts`

Export all atmosphere components:
- BrickPattern
- Vignette
- MysticAura
- ParticleField
- Scanlines

---

## Phase C: UI Building Blocks

### T011 [P2] Create Panel UI component

**File**: `src/components/ui/Panel.tsx`

Props interface:
```typescript
interface PanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dm';
}
```

Features:
- Gradient background (stone-800 to stone-850)
- 3px border with stone-600
- Inset shadows
- Four corner accent spans (absolute positioned)
- Corners expand on hover (8px to 12px)
- 'dm' variant uses mystic colors

Reference: `.specify/reference/design-system/05-panels.css`

---

### T012 [P2] Create SegmentedBar UI component

**File**: `src/components/ui/SegmentedBar.tsx`

Props interface:
```typescript
interface SegmentedBarProps {
  current: number;
  max: number;
  variant?: 'health' | 'shield';
  critical?: boolean;
}
```

Features:
- Flexbox container with gap
- Individual segment divs
- Filled segments use blood/ice gradient
- Empty segments use stone-850
- Critical animation when critical=true and variant='health'

Reference: `.specify/reference/design-system/07-vitals-panel.css` `.health-bar`

---

### T013 [P2] Create Button UI component

**File**: `src/components/ui/Button.tsx`

Props interface:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}
```

Features:
- Primary: gold gradient, 3D shadow, shine sweep
- Secondary: stone colors, subtle styling
- Hover: lift effect with glow
- Active: press down effect
- Uses Press Start 2P font

Reference: `.specify/reference/design-system/09-buttons.css`

---

### T014 [P2] Create ResourceCard UI component

**File**: `src/components/ui/ResourceCard.tsx`

Props interface:
```typescript
interface ResourceCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  variant?: 'gold' | 'shield';
}
```

Features:
- Stone background with border
- Icon on top
- Large value below
- Small label at bottom
- Hover effect (border color, scale icon)

Reference: `.specify/reference/design-system/07-vitals-panel.css` `.resource-card`

---

### T015 [P2] Update UI components index

**File**: `src/components/ui/index.ts`

Add exports for new components:
- Panel
- SegmentedBar
- Button
- ResourceCard

---

### T016 [P2] Create GameTitle component

**File**: `src/components/ui/GameTitle.tsx`

Features:
- Title text with blood color, 22px
- Diamond accents (::before, ::after)
- title-pulse animation
- gem-sparkle animation on diamonds
- Subtitle with stone-300 color

Reference: `.specify/reference/design-system/10-layout.css` `.title`

---

## Phase D: Icon Components

### T017 [P3] Create Flag icon component

**File**: `src/components/icons/Flag.tsx`

SVG icon (16x16 viewBox):
- Gold pole (rect)
- Gold triangular flag (path)

Reference: `.specify/reference/design-system/11-icons.md`

---

### T018 [P3] Create Skull icon component

**File**: `src/components/icons/Skull.tsx`

SVG icon (16x16 viewBox):
- Bone-light fill
- Head rectangle
- Eye sockets (blood-dark)
- Bone legs

Reference: `.specify/reference/design-system/11-icons.md`

---

### T019 [P3] Create Coin icon component

**File**: `src/components/icons/Coin.tsx`

SVG icon (20x20 viewBox):
- Gold outer circle
- Gold-dark inner circle
- $ text character

Reference: `.specify/reference/design-system/11-icons.md`

---

### T020 [P3] Create Shield icon component

**File**: `src/components/icons/Shield.tsx`

SVG icon (20x20 viewBox):
- Ice-colored shield path
- Ice-dark inner path

Reference: `.specify/reference/design-system/11-icons.md`

---

### T021 [P3] Create Heart icon component

**File**: `src/components/icons/Heart.tsx`

SVG icon (16x16 viewBox):
- Blood-colored heart path

Reference: `.specify/reference/design-system/11-icons.md`

---

### T022 [P3] Create QuestionIcon component

**File**: `src/components/icons/QuestionIcon.tsx`

Styled ? character for question tiles:
- Mystic-bright color
- Text shadow glow
- question-wobble animation

---

### T023 [P3] Create icons index

**File**: `src/components/icons/index.ts`

Export all icon components:
- Flag
- Skull
- Coin
- Shield
- Heart
- QuestionIcon

---

## Phase E: Sidebar Panels

### T024 [P2] [US4] Create DMPanel component

**File**: `src/components/sidebar/DMPanel.tsx`

Features:
- Uses Panel variant='dm'
- Header with "DUNGEON MASTER" title
- Status with "WATCHING" and blinking dot
- Eye container (48x48)
- Animated eye with radial gradient (mystic colors)
- Eye movement animation (6s cycle)
- Placeholder message text (italic)

Reference: `.specify/reference/design-system/06-dm-panel.css`

---

### T025 [P2] [US5] Create VitalsPanel component

**File**: `src/components/sidebar/VitalsPanel.tsx`

Props interface:
```typescript
interface VitalsPanelProps {
  health: number;
  maxHealth: number;
  gold: number;
  shields: number;
  floor: number;
}
```

Features:
- Uses Panel component
- Health section with label and SegmentedBar
- Critical state when health < 25%
- Resource grid with gold, shield, and floor cards
- Uses ResourceCard and icon components
- Floor indicator shows current dungeon level

Reference: `.specify/reference/design-system/07-vitals-panel.css`

---

### T026 [P2] [US6] Create RunesPanel component

**File**: `src/components/sidebar/RunesPanel.tsx`

Props interface:
```typescript
interface RunesPanelProps {
  buffs: ActiveBuff[];
}
```

Features:
- Uses Panel component
- Header with diamond accent
- Rune cards for each buff
- Active state styling (mystic glow)
- Empty slot placeholders (dashed border)
- Hover effects

Reference: `.specify/reference/design-system/08-runes-panel.css`

---

### T027 [P2] Create ActionButton component

**File**: `src/components/sidebar/ActionButton.tsx`

Wrapper using Button with primary variant, full-width styling for sidebar context.

---

### T028 [P2] Create Sidebar container component

**File**: `src/components/sidebar/Sidebar.tsx`

Props: Uses store selectors for health, gold, shields, buffs

Composes:
- DMPanel
- VitalsPanel (with props from store)
- RunesPanel (with buffs from store)
- ActionButton (with context-appropriate label)

---

### T029 [P2] Create sidebar components index

**File**: `src/components/sidebar/index.ts`

Export all sidebar components:
- DMPanel
- VitalsPanel
- RunesPanel
- ActionButton
- Sidebar

---

## Phase F: Tile Updates

### T030 [P1] [US3] Update Tile component styling

**File**: `src/components/game/Tile.tsx`

Changes:
- [x] Change size to 40px (use --tile token)
- [x] Remove ALL border-radius (rounded classes)
- [x] Add CSS classes for 3D bevel effect
- [x] Hidden state: stone gradient, bevel borders
- [x] Hover state: lift 2px, mystic glow shadow
- [x] Active state: press 3px, inverted bevel
- [x] Revealed state: dark background, inset shadow
- [x] Flagged state: gold border, gold glow
- [x] Question state: mystic border, wobble animation
- [x] Hit state: blood gradient, shake animation, glow

Reference: `.specify/reference/design-system/04-tiles.css`

---

### T031 [P1] [US3] Update NumberDisplay component

**File**: `src/components/game/NumberDisplay.tsx`

Changes:
- [x] Use --num-N custom properties for colors
- [x] Add text-shadow glow effect
- [x] Ensure font size is 12px

Reference: `.specify/reference/design-system/04-tiles.css` number colors

---

### T032 [P1] Update FlagIcon to use new Flag component

**File**: `src/components/game/FlagIcon.tsx`

Replace emoji/text with SVG Flag icon component from icons/.

---

### T032a [P1] Update MonsterIcon to use new Skull component

**File**: `src/components/game/MonsterIcon.tsx`

Replace current monster icon with SVG Skull icon component from icons/.

---

### T032b [P1] Update QuestionMark to use new styling

**File**: `src/components/game/QuestionMark.tsx`

Update styling:
- Use mystic-bright color
- Add text-shadow glow
- Add question-wobble animation

---

### T033 [P1] Update GameBoard container styling

**File**: `src/components/game/GameBoard.tsx`

Changes:
- [x] Apply tile-grid styling
- [x] Use --gap token for grid gap
- [x] Add void background
- [x] Add board border and shadows

Reference: `.specify/reference/design-system/04-tiles.css` `.tile-grid`

---

## Phase G: Layout Integration

### T034 [P1] [US2] Update App.tsx layout structure

**File**: `src/App.tsx`

Major restructure:
- [x] Add atmosphere components to root (before game content)
- [x] Replace centered layout with two-column grid
- [x] Left column: game board panel
- [x] Right column: Sidebar
- [x] Update title to use GameTitle component
- [x] Remove old HUD import/usage
- [x] Add responsive breakpoint (< 860px single column)

Reference: `.specify/reference/design-system/10-layout.css` `.game-container`

---

### T035 [P1] [US1] Integrate atmosphere layers

**File**: `src/App.tsx`

Add atmosphere components in order:
1. BrickPattern
2. Vignette
3. MysticAura
4. ParticleField
5. Scanlines

All should render before game content with proper z-index.

---

### T036 [P2] Update GameContainer to use Panel

**File**: `src/components/game/GameContainer.tsx`

Changes:
- [x] Wrap content in Panel component
- [x] Add board-area styling to inner container
- [x] Update modal styling if needed

---

### T037 [P2] Update footer buttons

**File**: `src/App.tsx`

Add footer controls area below game container:
- "NEW GAME" button (secondary)
- "HOW TO PLAY" button (secondary)

Reference: `.specify/reference/design-system/09-buttons.css` `.footer-btn`

---

### T038 [P2] Remove old HUD component usage

Remove HUD from:
- GameContainer.tsx (if referenced)
- Any other imports

Note: Keep HUD files for reference, but don't delete yet.

---

## Phase H: Polish & Testing

### T039 [P3] Add Floor/Header info to game panel

**File**: `src/components/game/GameContainer.tsx` or new component

Add header bar inside game panel with:
- Floor badge with level number
- Floor name (placeholder)
- Environment indicator
- Threat meter (optional, based on monsters remaining)

Reference: `.specify/reference/design-system/10-layout.css` `.header`

---

### T040 [P3] Test responsive layout

Manual testing:
- [x] Verify two-column at >= 860px
- [x] Verify single-column at < 860px
- [x] Verify sidebar stacks below board on mobile

---

### T041 [P3] Update snapshot tests

Update all affected test snapshots:
- [x] Tile.test.tsx
- [x] NumberDisplay.test.tsx
- [x] GameBoard.test.tsx
- [x] GameContainer.test.tsx
- [x] Any HUD tests if still running

---

### T042 [P3] Visual verification against mockup

Final verification:
- [x] Open mockup in browser
- [x] Compare side-by-side
- [x] Check all acceptance criteria from spec.md
- [x] Document any intentional deviations

---

## Dependency Graph

```
T001 (tokens) ──┬──> T003 (index.css) ──> T030-T033 (tiles) ──┐
T002 (anims) ───┘                                              │
                                                               │
T004-T010 (atmosphere) ───────────────────────────────────────┬┴──> T034-T038 (layout)
                                                               │
T011-T016 (ui blocks) ──> T024-T029 (sidebar) ────────────────┘
                                │
T017-T023 (icons) ──────────────┘
```

**Critical Path**: T001 → T003 → T030 → T034 → T035

---

## Estimated Task Count by Priority

| Priority | Count | Description |
|----------|-------|-------------|
| P1 | 10 | Critical path, blocks other work |
| P2 | 26 | Core feature work |
| P3 | 8 | Polish and testing |
| **Total** | **44** | |
