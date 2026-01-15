# Project Backlog

> Items deferred from completed phases that need future attention.

**Last Updated**: 2026-01-15

---

## Implementation Gaps

### BL-001: First Click Safety Logic Not Implemented

**Source**: Phase 2030 (meta-progression)
**Priority**: High
**Target**: Phase 2031 (hotfix) or Phase 2040

**Recommendation**: Create hotfix phase 2031 to implement this before USER GATE at 2050.

The `firstClickSafety` upgrade is defined in `PlayerStats` and purchasable in the upgrade shop, but the actual game logic to make it work is not implemented.

**Current State**:
- `PlayerStats.firstClickSafety: boolean` exists in `src/types/player.ts`
- Upgrade definition exists in `src/data/permanentUpgrades.ts`
- `applyAllUpgrades` sets the flag correctly

**Missing**:
- Game logic in `src/stores/gameStore.ts` or `src/engine/` to check `firstClickSafety` and flag the monster instead of taking damage on first monster reveal

**Implementation Notes**:
- Check `playerStats.firstClickSafety` in `revealCell` when a monster is hit
- If true and `run.isFirstClick` (or track first monster hit separately), flag the cell instead of calling `takeDamage`
- Only applies to first monster hit per run, not first click overall

---

## Visual Polish

### BL-002: UpgradeShopModal Visual Polish

**Source**: Phase 2030 (meta-progression)
**Priority**: Low
**Target**: Phase 6010 (visual-juice)

The UpgradeShopModal has functional styling but could benefit from:
- Purchase animation/feedback
- Gold counter animation when spending
- Upgrade card glow effect on purchase
- Maxed upgrade visual treatment enhancement

---

## Phase Scope Notes

### Phase 2040 (meta-shop) Overlap

Phase 2040's scope significantly overlaps with Phase 2030 (meta-progression). The following 2040 deliverables are already complete:

- [x] Meta shop UI modal → `UpgradeShopModal.tsx`
- [x] Display available upgrades
- [x] Show current levels and costs
- [x] Purchase flow
- [x] Appears after death
- [x] New Run button → "Continue" button

**Remaining 2040 scope** (optional polish):
- [ ] "Show all monsters → 2s delay" animation before shop
- [ ] Run stats display in meta shop
- [ ] High score comparison display

**Recommendation**: Phase 2040 can be simplified to polish-only or merged with 2031 hotfix.

---

## Notes

Items are added here when:
1. Discovered during phase verification
2. Explicitly deferred from a phase's scope
3. Identified as gaps in completed work

Items should be resolved by:
1. Including in a future phase's scope
2. Creating a hotfix phase (e.g., 2031)
3. Marking as "Won't Fix" with rationale
