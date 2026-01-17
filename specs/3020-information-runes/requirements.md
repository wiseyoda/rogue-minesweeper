# Phase 3020: Requirements Checklist

## Functional Requirements

### Cell Highlight System (P0)
- [ ] CHK001: Cell interface includes `highlightType?: HighlightType` property
- [ ] CHK002: HighlightType union includes 'prophecy' | 'omniscience' | null
- [ ] CHK003: Tile component renders green overlay for prophecy highlight
- [ ] CHK004: Tile component renders red tint for omniscience highlight
- [ ] CHK005: Highlights visible but don't obscure cell content

### Danger Sense Rune (P1)
- [ ] CHK006: Rune definition exists with id='danger-sense', rarity='common', cost=30
- [ ] CHK007: Passive effect extends danger number calculation to 2-range
- [ ] CHK008: Extended numbers visually distinguishable from normal numbers
- [ ] CHK009: Effect only active when rune is equipped

### Prophecy Rune (P1)
- [ ] CHK010: Rune definition exists with id='prophecy', rarity='rare', cost=80
- [ ] CHK011: Safest tile highlighted at floor start
- [ ] CHK012: Highlight updates after each tile reveal
- [ ] CHK013: Algorithm considers adjacent revealed numbers
- [ ] CHK014: Provably safe tiles prioritized (constraint solving)
- [ ] CHK015: Only one tile highlighted at a time

### Omniscience Rune (P1)
- [ ] CHK016: Rune definition exists with id='omniscience', rarity='legendary', cost=150
- [ ] CHK017: All monster locations marked at floor start
- [ ] CHK018: Visual indicator is subtle (tint, not full reveal)
- [ ] CHK019: Cells are NOT revealed (still hidden, just marked)
- [ ] CHK020: Indicator clears when cell is revealed or flagged

## Non-Functional Requirements

- [ ] CHK021: No noticeable performance impact with all highlights active
- [ ] CHK022: TypeScript compiles without errors
- [ ] CHK023: Runes appear in shop rotation per rarity weights

## Integration Requirements

- [ ] CHK024: New runes integrate with existing rune framework
- [ ] CHK025: Shop correctly prices and displays new runes
- [ ] CHK026: Rune panel shows equipped information runes with effects
