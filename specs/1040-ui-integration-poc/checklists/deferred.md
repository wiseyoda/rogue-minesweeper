# Deferred Items: UI Integration POC

**Phase**: 1040
**Created**: 2026-01-15

---

## Summary

| Item | Source | Reason | Target Phase |
|------|--------|--------|--------------|
| Full loot library system | spec.md:Non-Goals | Out of scope for POC, user requested future phase | Phase 2025 |
| Exit tile requiring click | spec.md:Non-Goals | Not part of POC scope | Phase 2010 |
| Shop integration | spec.md:Non-Goals | Requires shop system first | Phase 2020 |
| Multi-floor progression | spec.md:Non-Goals | Requires level system | Phase 2010 |
| Dungeon Master taunts | spec.md:Non-Goals | AI integration phase | Phase 4 |

---

## Detailed Rationale

### Full Loot Library System (Phase 2025)

**Description**: Randomized loot drops with rarity system. Each dungeon could have 0-2 loot items that get revealed and automatically collected.

**Reason Deferred**: User explicitly requested this be added to ROADMAP but not implemented in POC. Current implementation uses simple 1-gold-per-tile.

**Prerequisites for Future**:
- Basic game loop working
- Inventory or collection system
- Loot definition types

### Exit Tile (Phase 2010)

**Description**: Player must click on exit tile to advance to next level instead of automatic modal.

**Reason Deferred**: POC uses direct modal approach for simplicity.

### Shop Integration (Phase 2020)

**Description**: After level complete, player visits shop before next level.

**Reason Deferred**: Shop system not yet implemented. Current implementation skips directly to next level.

### Multi-floor Progression (Phase 2010)

**Description**: Full floor-to-floor progression with increasing difficulty.

**Reason Deferred**: POC focuses on single floor experience. Level counter increments but difficulty scaling minimal.

### Dungeon Master Taunts (Phase 4)

**Description**: AI-generated commentary during gameplay.

**Reason Deferred**: AI integration is a later development phase.

---

## Notes

These items were explicitly marked as Non-Goals for Phase 1040 per the spec. The user approved deferring the full loot library to a future phase (assigned 2025) during DISCOVER phase clarification.
