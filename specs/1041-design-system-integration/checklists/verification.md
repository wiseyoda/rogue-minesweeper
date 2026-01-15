# Verification Checklist: Phase 1041 - Design System Integration

## Visual Verification (vs Mockup)

Open `.specify/reference/ui-mockup-definitive.html` in browser and compare side-by-side.

### Atmosphere

- [ ] **ATM-01**: Dark void background (#05050a) visible
- [ ] **ATM-02**: Brick pattern visible (subtle, ~40% opacity)
- [ ] **ATM-03**: Vignette darkens screen edges
- [ ] **ATM-04**: Mystic aura breathes from center (8s cycle)
- [ ] **ATM-05**: 8 particles float upward continuously
- [ ] **ATM-06**: Scanlines visible but subtle
- [ ] **ATM-07**: All layers respect prefers-reduced-motion

### Typography

- [ ] **TYP-01**: Press Start 2P font loads and displays
- [ ] **TYP-02**: NO Cinzel or Merriweather visible anywhere
- [ ] **TYP-03**: Title uses blood color (#cc2020)
- [ ] **TYP-04**: Body text uses bone color (#c4b8a0)
- [ ] **TYP-05**: Labels use stone colors

### Layout

- [ ] **LAY-01**: Two-column grid: game board (left), sidebar (right)
- [ ] **LAY-02**: Sidebar width is approximately 280px
- [ ] **LAY-03**: Game board is centered in its column
- [ ] **LAY-04**: At < 860px width, layout becomes single column
- [ ] **LAY-05**: Sidebar stacks below board on mobile

### Tiles

- [ ] **TIL-01**: Tiles are 40px x 40px
- [ ] **TIL-02**: Tiles have NO rounded corners (sharp edges)
- [ ] **TIL-03**: Hidden tiles have 3D bevel effect (light top-left)
- [ ] **TIL-04**: Hidden tiles hover: lift 2px with mystic glow
- [ ] **TIL-05**: Hidden tiles active/click: press down 3px
- [ ] **TIL-06**: Revealed tiles have dark background with inset shadow
- [ ] **TIL-07**: Flagged tiles have gold border with glow
- [ ] **TIL-08**: Question tiles have mystic purple border
- [ ] **TIL-09**: Question mark wobbles
- [ ] **TIL-10**: Monster hit tiles have blood gradient
- [ ] **TIL-11**: Monster hit tiles shake on reveal

### Number Colors

- [ ] **NUM-01**: Number 1 is blue (#4090e0)
- [ ] **NUM-02**: Number 2 is green (#40b040)
- [ ] **NUM-03**: Number 3 is red (#e04040)
- [ ] **NUM-04**: Number 4 is purple (#a040d0)
- [ ] **NUM-05**: Numbers have subtle text-shadow glow

### Panels

- [ ] **PAN-01**: Panels have gradient background (stone colors)
- [ ] **PAN-02**: Panels have gold corner accents
- [ ] **PAN-03**: Corner accents expand on panel hover
- [ ] **PAN-04**: Panels have 3D box shadow effect

### DM Panel

- [ ] **DMP-01**: DM Panel has mystic purple border
- [ ] **DMP-02**: Animated eye visible (radial gradient, purple)
- [ ] **DMP-03**: Eye slowly looks around (6s cycle)
- [ ] **DMP-04**: "WATCHING" status visible with blinking dot
- [ ] **DMP-05**: Placeholder message text visible (italic)

### Vitals Panel

- [ ] **VIT-01**: Health bar is segmented (not continuous gradient)
- [ ] **VIT-02**: Health segments have blood color when filled
- [ ] **VIT-03**: Health bar pulses when critical (< 25%)
- [ ] **VIT-04**: Gold counter displays with coin icon
- [ ] **VIT-05**: Shield counter displays with shield icon
- [ ] **VIT-06**: Floor indicator shows current level
- [ ] **VIT-07**: Resource cards highlight on hover

### Runes Panel

- [ ] **RUN-01**: Panel header has diamond accent
- [ ] **RUN-02**: Active buffs display as rune cards
- [ ] **RUN-03**: Active runes have mystic glow
- [ ] **RUN-04**: Empty slots shown with dashed border
- [ ] **RUN-05**: Cards expand icon on hover

### Buttons

- [ ] **BTN-01**: Primary buttons have gold gradient
- [ ] **BTN-02**: Primary buttons have 3D shadow
- [ ] **BTN-03**: Primary buttons lift on hover
- [ ] **BTN-04**: Primary buttons press down on click
- [ ] **BTN-05**: Shine sweep effect on primary hover
- [ ] **BTN-06**: Secondary buttons have stone styling

### Icons

- [ ] **ICO-01**: Flag icon is gold SVG (not emoji)
- [ ] **ICO-02**: Monster/skull icon is SVG (not emoji)
- [ ] **ICO-03**: Coin icon is gold circle with $
- [ ] **ICO-04**: Shield icon is ice-colored

## Technical Verification

### Performance

- [ ] **PRF-01**: No visible frame drops during gameplay
- [ ] **PRF-02**: Atmosphere animations don't cause lag
- [ ] **PRF-03**: Page load time reasonable (< 3s)

### Accessibility

- [x] **A11Y-01**: All tiles have aria-labels
- [ ] **A11Y-02**: Text contrast meets WCAG AA *(requires visual verification)*
- [ ] **A11Y-03**: Animations pause with prefers-reduced-motion *(deferred - CSS media query support needed)*

### Code Quality

- [x] **COD-01**: TypeScript compiles without errors
- [ ] **COD-02**: No console errors in browser
- [x] **COD-03**: ESLint passes
- [x] **COD-04**: All tests pass (or intentionally updated)

## Functional Verification

### Game Still Works

- [ ] **GAM-01**: Can click to reveal tiles
- [ ] **GAM-02**: Can right-click to flag tiles
- [ ] **GAM-03**: Numbers display correctly on revealed tiles
- [ ] **GAM-04**: Game over triggers on monster hit
- [ ] **GAM-05**: Win condition still works
- [ ] **GAM-06**: Reset button starts new game

## Sign-Off

- [ ] All atmosphere checks pass
- [ ] All tile checks pass
- [ ] All sidebar checks pass
- [ ] All button/icon checks pass
- [ ] All technical checks pass
- [ ] All functional checks pass

**Verified By**: _______________
**Date**: _______________
