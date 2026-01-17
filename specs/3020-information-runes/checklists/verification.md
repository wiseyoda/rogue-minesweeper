# Phase 3020: Verification Checklist

## Functional Verification

### Cell Highlight System
- [ ] V-001: HighlightType includes 'prophecy' and 'omniscience' values
- [ ] V-002: Cell interface has optional highlightType property
- [ ] V-003: Tile renders green overlay when highlightType='prophecy'
- [ ] V-004: Tile renders red tint when highlightType='omniscience'

### Danger Sense Rune
- [ ] V-005: Rune exists with id='danger-sense', rarity='common', cost=30
- [ ] V-006: Extended danger numbers show when rune equipped
- [ ] V-007: Extended numbers have distinct visual style

### Prophecy Rune
- [ ] V-008: Rune exists with id='prophecy', rarity='rare', cost=80
- [ ] V-009: Safest tile highlighted at floor start
- [ ] V-010: Highlight updates after revealing a tile
- [ ] V-011: Previous highlight clears when new one set

### Omniscience Rune
- [ ] V-012: Rune exists with id='omniscience', rarity='legendary', cost=150
- [ ] V-013: All monster cells marked at floor start
- [ ] V-014: Marks are subtle (tint, not full reveal)
- [ ] V-015: Marks clear when cell revealed or flagged

## Integration Verification

- [ ] V-016: All three runes appear in shop rotation
- [ ] V-017: Runes have appropriate icons and descriptions
- [ ] V-018: TypeScript compiles without errors
- [ ] V-019: No console errors during gameplay
- [ ] V-020: Performance acceptable (no lag with highlights)

## Gameplay Verification

- [ ] V-021: Danger Sense meaningfully affects decision making
- [ ] V-022: Prophecy highlight is accurate (tile is actually safe or safest)
- [ ] V-023: Omniscience shows correct monster positions
- [ ] V-024: Runes can be purchased, equipped, and replaced
