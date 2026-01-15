# Requirements Checklist: HUD Components

**Phase**: 1030
**Created**: 2026-01-15

---

## Functional Requirements

### HUD Container (FR-1)
- [ ] FR-1.1: HUD reads state from useGameStore
- [ ] FR-1.2: HUD displays all child components in consistent layout
- [ ] FR-1.3: HUD layout is responsive (stacks on narrow viewports)

### Health Bar (FR-2)
- [ ] FR-2.1: HealthBar displays current/max lives as filled bar
- [ ] FR-2.2: HealthBar uses dungeon-blood color for filled portion
- [ ] FR-2.3: HealthBar shows numeric value (e.g., "3/5")
- [ ] FR-2.4: HealthBar updates immediately when lives change

### Shield Display (FR-3)
- [ ] FR-3.1: ShieldDisplay shows current shield count
- [ ] FR-3.2: ShieldDisplay uses shield icon
- [ ] FR-3.3: ShieldDisplay hidden when shields = 0

### Gold Counter (FR-4)
- [ ] FR-4.1: GoldCounter displays current gold amount
- [ ] FR-4.2: GoldCounter uses dungeon-gold color
- [ ] FR-4.3: GoldCounter shows gold icon

### Level Indicator (FR-5)
- [ ] FR-5.1: LevelIndicator shows current level number
- [ ] FR-5.2: LevelIndicator format is "Level X" or "L X"
- [ ] FR-5.3: LevelIndicator uses dungeon-amber color

### Monster Counter (FR-6)
- [ ] FR-6.1: MonsterCounter shows remaining unflagged monsters
- [ ] FR-6.2: Remaining calculation is correct (total - flagged)
- [ ] FR-6.3: MonsterCounter uses monster icon

### Buff Bar (FR-7)
- [ ] FR-7.1: BuffBar displays icons for each active buff
- [ ] FR-7.2: Buffs with charges show charge count
- [ ] FR-7.3: BuffBar hidden when no buffs active
- [ ] FR-7.4: BuffBar supports multiple simultaneous buffs

### Message Area (FR-8)
- [ ] FR-8.1: MessageArea displays most recent message
- [ ] FR-8.2: MessageArea persists until next message
- [ ] FR-8.3: MessageArea supports message types (info/warning/success/danger)
- [ ] FR-8.4: Initial state is empty or "Click to start"

---

## Non-Functional Requirements

### Performance (NFR-1)
- [ ] NFR-1.1: Components use React.memo
- [ ] NFR-1.2: State selectors are granular

### Styling (NFR-2)
- [ ] NFR-2.1: Uses Tailwind with dungeon theme colors
- [ ] NFR-2.2: 32px minimum touch targets for interactive elements
- [ ] NFR-2.3: Supports dark dungeon background

### Testing (NFR-3)
- [ ] NFR-3.1: Unit tests for each component
- [ ] NFR-3.2: Integration test for HUD with store

---

## Summary

| Category | Total |
|----------|-------|
| HUD Container | 3 |
| Health Bar | 4 |
| Shield Display | 3 |
| Gold Counter | 3 |
| Level Indicator | 3 |
| Monster Counter | 3 |
| Buff Bar | 4 |
| Message Area | 4 |
| Performance | 2 |
| Styling | 3 |
| Testing | 2 |
| **Total** | **34** |
