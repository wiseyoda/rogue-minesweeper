# Phase 2050: Progression POC - Requirements Checklist

## User Story Requirements

### US-1: Stats Dashboard
- [ ] REQ-1.1: HighScores component displays best level reached
- [ ] REQ-1.2: HighScores component displays max gold in single run
- [ ] REQ-1.3: HighScores component displays total runs completed
- [ ] REQ-1.4: Stats persist in localStorage across sessions

### US-2: Run Stats Display
- [ ] REQ-2.1: RunStats component displays current level
- [ ] REQ-2.2: RunStats component displays current gold
- [ ] REQ-2.3: RunStats component shows comparison to personal best

### US-3: Reveal Scroll Item
- [ ] REQ-3.1: Reveal Scroll defined in shopItems.ts
- [ ] REQ-3.2: Reveal Scroll has rare rarity
- [ ] REQ-3.3: Reveal Scroll costs 150 gold (expensive)
- [ ] REQ-3.4: Reveal Scroll uses solver logic to reveal tiles
- [ ] REQ-3.5: Reveal Scroll only reveals logically deducible tiles

### US-4: Complete Game Loop
- [ ] REQ-4.1: Game flow works: Run → Floor → Shop → Continue
- [ ] REQ-4.2: Death leads to Game Over modal
- [ ] REQ-4.3: Game Over leads to Meta Shop
- [ ] REQ-4.4: Meta Shop purchases persist
- [ ] REQ-4.5: New run applies permanent upgrades
- [ ] REQ-4.6: High scores update after each run

## Functional Requirements

### Stats System
- [ ] FR-1.1: metaStore tracks highestLevelOverall
- [ ] FR-1.2: metaStore tracks maxGoldRun
- [ ] FR-1.3: metaStore tracks totalRuns
- [ ] FR-1.4: metaStore tracks totalGoldEarned (new)
- [ ] FR-1.5: Stats update at end of each run

### UI Components
- [ ] FR-2.1: HighScores.tsx created with Panel wrapper
- [ ] FR-2.2: RunStats.tsx created for sidebar
- [ ] FR-2.3: Stats accessible from game UI
- [ ] FR-2.4: Components use design system colors

### Shop Integration
- [ ] FR-3.1: Reveal Scroll appears in floor shop
- [ ] FR-3.2: Reveal Scroll purchase validation works
- [ ] FR-3.3: Reveal Scroll effect triggers on use

### Solver Integration
- [ ] FR-4.1: Reveal Scroll connects to solver.ts
- [ ] FR-4.2: Solver reveals only safe tiles
- [ ] FR-4.3: Scroll consumed after use

## Non-Functional Requirements

- [ ] NFR-1: All stats persist via localStorage
- [ ] NFR-2: No performance degradation from stats
- [ ] NFR-3: UI consistent with existing design system
- [ ] NFR-4: Responsive layout maintained

## Constitution Compliance

- [ ] CONST-1: Resource Tension - Gold choices meaningful (Reveal Scroll expensive)
- [ ] CONST-2: Information Is Power - Reveal Scroll provides information advantage
- [ ] CONST-3: Passive Mastery - No active ability buttons added
- [ ] CONST-4: Move Fast - Produces playable build

## Verification Gate Checklist

Per phase file, user must verify:
- [ ] VG-1: Start new run works
- [ ] VG-2: Clear 5+ floors successfully
- [ ] VG-3: Floor shop functions between floors
- [ ] VG-4: Can buy items, see effects
- [ ] VG-5: Death triggers game over correctly
- [ ] VG-6: Meta shop appears with gold
- [ ] VG-7: Can buy permanent upgrades
- [ ] VG-8: New run starts successfully
- [ ] VG-9: Upgrades apply at run start
- [ ] VG-10: Can reach floor 10+ with upgrades
- [ ] VG-11: High scores persist across sessions
