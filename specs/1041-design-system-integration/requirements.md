# Requirements Checklist: Phase 1041 - Design System Integration

## Functional Requirements

### FR1: Design Tokens
- [ ] Create `src/styles/tokens.css` with all CSS custom properties
- [ ] Include void/stone color scale
- [ ] Include semantic colors (bone, blood, gold, mystic, venom, ice)
- [ ] Include number colors (--num-1 through --num-8)
- [ ] Include timing tokens (tick, beat, breath, pulse, wave)
- [ ] Include scale tokens (tile, gap, unit)

### FR2: Foundation & Typography
- [ ] Load Press Start 2P from Google Fonts
- [ ] Apply pixel rendering mode to html
- [ ] Set body background to --void
- [ ] Set body font to Press Start 2P
- [ ] Remove all Cinzel/Merriweather references
- [ ] Apply custom scrollbar styling

### FR3: Atmosphere Layers
- [ ] Create BrickPattern component (z-index 0, 40% opacity)
- [ ] Create Vignette component (z-index 1, radial gradient)
- [ ] Create MysticAura component (z-index 1, breathing animation)
- [ ] Create ParticleField component (z-index 2, 8 particles)
- [ ] Create Scanlines component (z-index 100, subtle)
- [ ] All layers fixed position, pointer-events none

### FR4: Layout Structure
- [ ] Update App.tsx to use two-column grid
- [ ] Game board column: 1fr (flexible)
- [ ] Sidebar column: 280px (fixed)
- [ ] Responsive: single column below 860px
- [ ] Title with diamond accents and pulse animation

### FR5: Panel Component
- [ ] Create reusable Panel component
- [ ] Gradient background (stone-800 to stone-850)
- [ ] 3px border with stone-600
- [ ] Inset shadow styling
- [ ] Four corner accent elements
- [ ] Corners expand on hover (8px to 12px)

### FR6: Tile Component Updates
- [ ] Change tile size to 40px
- [ ] Remove all border-radius
- [ ] Implement 3D bevel (border-color sides)
- [ ] Hidden state: stone gradient with inset shadows
- [ ] Hover state: lift 2px, mystic glow
- [ ] Active state: press 3px, inverted bevel
- [ ] Revealed state: dark with inset shadow
- [ ] Flagged state: gold border with glow
- [ ] Question state: mystic border with wobble
- [ ] Hit state: blood gradient with shake animation

### FR7: Number Display Updates
- [ ] Use --num-N tokens for colors
- [ ] Add text-shadow glow effect
- [ ] Match font size (12px)

### FR8: DM Panel
- [ ] Mystic purple border and gradient background
- [ ] Header with title and "WATCHING" status
- [ ] Status dot with blink animation
- [ ] Eye container (48x48)
- [ ] Animated eye (radial gradient, 6s look animation)
- [ ] Pupil and highlight elements
- [ ] Placeholder message text (italic)

### FR9: Vitals Panel
- [ ] Health section with label and value
- [ ] Segmented health bar (20 segments)
- [ ] Filled segments: blood gradient
- [ ] Empty segments: stone-850
- [ ] Critical state animation (< 25% health)
- [ ] Resource grid (2 columns)
- [ ] Gold card with coin icon
- [ ] Shield card with shield icon
- [ ] Hover effects on cards

### FR10: Runes Panel
- [ ] Header with diamond accent
- [ ] Rune card layout (icon + info)
- [ ] Active rune styling (mystic glow)
- [ ] Inactive rune styling
- [ ] Empty slot with dashed border
- [ ] Hover effects

### FR11: Button Components
- [ ] Primary button: gold gradient, 3D shadow
- [ ] Primary hover: lift with glow
- [ ] Primary active: press down
- [ ] Shine sweep effect
- [ ] Secondary button: stone gray
- [ ] Footer button styling

### FR12: Icon Components
- [ ] Flag icon (gold pole and banner)
- [ ] Skull/monster icon
- [ ] Coin icon (gold with $)
- [ ] Shield icon (ice colors)
- [ ] Heart icon (blood color)
- [ ] Rune icons (seer's stone, ward crystal)

### FR13: Animation System
- [ ] Float text animation (1.5s float-away)
- [ ] Hit shake animation (0.4s)
- [ ] Glow pulse animation
- [ ] Fade in/out animations
- [ ] Pop in/out animations

## Non-Functional Requirements

### NFR1: Performance
- [ ] Atmosphere uses CSS animations only
- [ ] No JavaScript timers for animations
- [ ] Particles use nth-child animation-delay

### NFR2: Accessibility
- [ ] Maintain aria-labels on tiles
- [ ] Support prefers-reduced-motion
- [ ] Text contrast meets WCAG AA

### NFR3: Code Quality
- [ ] TypeScript types for all components
- [ ] Props interfaces follow naming convention
- [ ] Components use memo where appropriate
- [ ] No inline styles - use CSS classes

## Constraints (Must Not Violate)

### C1: Typography
- [ ] ONLY Press Start 2P font used
- [ ] No other font families loaded or referenced

### C2: Tiles
- [ ] NO border-radius on tiles
- [ ] Tiles must be square (40px x 40px)

### C3: Dependencies
- [ ] NO external texture URLs
- [ ] All patterns as data URIs
- [ ] Icons as inline SVG components

### C4: Brand
- [ ] Mystic purple (#7030b0) used for:
  - DM panel border
  - Question tile border
  - Active rune states
  - Hover glow on hidden tiles
  - Aura breathing effect
