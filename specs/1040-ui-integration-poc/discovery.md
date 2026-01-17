# Discovery: UI Integration POC

**Phase**: 1040
**Created**: 2026-01-15

---

## Codebase Examination

### Existing Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `App.tsx` | `src/App.tsx` | Current main container (will be refactored) |
| `GameBoard` | `src/components/game/GameBoard.tsx` | Grid of tiles |
| `Tile` | `src/components/game/Tile.tsx` | Individual cell with reveal/flag |
| `HUD` | `src/components/hud/HUD.tsx` | Stats display (HP, gold, level, etc.) |
| `MessageArea` | `src/components/hud/MessageArea.tsx` | Game messages |

### Current App.tsx Structure

The current `App.tsx` already has:
- HUD integration
- GameBoard rendering
- New Game button (reset)
- Game message generation based on state
- Instructions section

Key observations:
1. Game loop partially exists (playing → shopping/gameOver)
2. `phase === 'shopping'` means "Level Complete" but no exit tile
3. No modals for game over or win states
4. No gold rewarded for safe tile reveals

### Store Actions Available

From `gameStore.ts`:
- `startNewRun()` - Reset all state for new run
- `startLevel(level)` - Initialize level state
- `revealCell(row, col)` - Reveal with auto-win detection
- `toggleFlag(row, col)` - Flag/question/none cycle
- `takeDamage(amount)` - Shields first, then lives
- `addGold(amount)` - Add gold (not connected to gameplay yet)
- `setPhase(phase)` - Manual phase change

### Game Phases

```typescript
type GamePhase =
  | 'playing'    // Active gameplay
  | 'shopping'   // Level complete (inter-floor)
  | 'gameOver'   // Player died
  | 'upgradeShop'; // End-of-run (not used yet)
```

---

## Integration Points

### Missing Functionality

1. **Gold from safe tiles** - Engine reveals tiles but no gold is awarded
2. **Exit tile** - When all safe tiles revealed, should show exit
3. **Game Over Modal** - Show score, option to restart
4. **Win Modal** - Show level complete, option to continue (or "Next Level" placeholder)
5. **Pages structure** - No proper page/route organization

### Page Structure Decision

The phase file specifies:
- `src/pages/GamePage.tsx` - Main game page
- `src/components/game/GameContainer.tsx` - Game + HUD layout

But currently there's no `pages/` directory. Need to decide:
- Option A: Create pages structure for future routing
- Option B: Keep current single-page structure, use `GameContainer`

### Modal Approach

For GameOverModal and WinModal, options:
- Option A: Overlay modals with semi-transparent backdrop
- Option B: Full-screen state replacement
- Option C: React portals with escape handling

---

## Constitution Alignment

| Principle | Relevance | Notes |
|-----------|-----------|-------|
| I. Information Is Power | Low | UI integration phase |
| II. Dungeon Is Alive | Medium | Messages could add personality |
| IV. Resource Tension | High | Gold from tiles matters |
| VI. Juice Is Holistic | High | Modals need good feel |
| VII. Move Fast | High | Keep it simple, iterate |

---

## User Decisions (from DISCOVER)

### Gold Reward System
- **1 gold per revealed safe tile** (basic reward)
- **Future**: Full loot library with rarity, 0-2 loot items per dungeon
- **Note**: Add "loot-system" phase to ROADMAP.md between existing phases (e.g., 2025)

### Win Behavior
- **Show Win Modal** with stats summary
- "Level Complete!" with tiles revealed, gold collected, etc.
- "Continue" button (placeholder for future shop)

### Game Over Modal
- **Stats summary**: level reached, gold collected, tiles revealed, monsters flagged, damage taken
- "Try Again" button
- Future: Dungeon Master taunts (Phase 4)

### Deferred to Future Phases
- Full loot library system → add phase 2025 to ROADMAP
- Exit tile mechanic → Phase 2010 (floor-progression)
- Shop integration → Phase 2020 (floor-shop)

---

## Dependencies

This phase depends on:
- ✅ Phase 1010: Zustand stores (complete)
- ✅ Phase 1020: GameBoard UI (complete)
- ✅ Phase 1030: HUD components (complete)

Future phases will build on:
- Phase 2010: Floor progression (exit tile → next level)
- Phase 2020: Floor shop (shopping phase implementation)
