# Phase 2050: Progression POC - Discovery

## Codebase Analysis Summary

### Current State: Core Loop Complete
All major roguelike systems are implemented and functional:
- **Floor progression** - Levels 1→∞ with difficulty scaling
- **Floor shop** - 5 items with reroll system
- **Meta shop** - 5 permanent upgrades with persistence
- **Death handling** - Game over modal with stat recording
- **State persistence** - localStorage via Zustand

### What Exists

| System | Status | Files |
|--------|--------|-------|
| Game loop | Complete | `GameContainer.tsx`, `gameStore.ts` |
| Floor shop | Complete | `FloorShop.tsx`, `shopItems.ts` |
| Meta shop | Complete | `UpgradeShopModal.tsx`, `permanentUpgrades.ts` |
| Death flow | Complete | `GameOverModal.tsx` |
| Stats tracking | Basic | `metaStore.ts` (GameStats interface) |
| Auto-solver | Complete | `solver.ts`, `revealTile` with solver logic |

### Gaps Identified

1. **No stats dashboard** - Stats tracked but not displayed anywhere
2. **Missing Reveal Scroll** - Icon exists (`RevealScrollIcon`) but item not in `SHOP_ITEMS`
3. **No run comparison** - No "beat your personal best" notifications

## User Clarifications

### Q1: Stats Display Priority
**User Choice**: Full stats dashboard
- Create dedicated `HighScores.tsx` and `RunStats.tsx` components
- Show historical data and comparisons
- Integrate into game UI

### Q2: Reveal Scroll Item
**User Clarification**: Add Reveal Scroll that functions like current auto-solve
- Rare rarity, expensive cost
- Reveals tiles that can be logically deduced as safe (not entire board)
- Uses same solver logic as dev auto-solve button

## Scope for Phase 2050

Based on phase file and user input:

### Must Have (Verification Gate)
1. Full game flow integration: Run → Floor → Shop → Repeat → Death → Meta Shop → New Run
2. High score tracking with persistent display
3. Stats display showing run metrics
4. Reveal Scroll shop item (auto-solve functionality)

### Nice to Have
- Run comparison notifications
- Personal best indicators

## Integration Points

### Auto-Solver for Reveal Scroll
Location: `src/engine/solver.ts`
Function: Uses minesweeper solving logic to reveal "safe" tiles
Behavior: Does NOT reveal entire board, only logically deducible tiles

### Stats Storage
Location: `src/stores/metaStore.ts`
Current fields:
```typescript
interface GameStats {
  highestLevelOverall: number;
  maxGoldRun: number;
  totalRuns?: number;
  totalDeaths?: number;
}
```
Needs: Additional historical tracking for dashboard

### UI Components
Existing patterns:
- `Panel` wrapper for consistent styling
- Modal system for overlays
- Design system variables in CSS

## Technical Approach

1. **Reveal Scroll**: Add to `shopItems.ts`, connect to solver logic in `gameStore.ts`
2. **HighScores**: New component showing persistent best runs
3. **RunStats**: Show current run metrics in sidebar or modal
4. **Integration**: Verify all systems work together end-to-end

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/data/shopItems.ts` | Modify | Add Reveal Scroll item |
| `src/components/ui/HighScores.tsx` | Create | Best runs display |
| `src/components/ui/RunStats.tsx` | Create | Current run stats |
| `src/stores/metaStore.ts` | Modify | Enhanced stats tracking |
| `src/pages/GamePage.tsx` | Modify | Integrate stats components |
| `src/components/game/Sidebar.tsx` | Modify | Add stats panel |
