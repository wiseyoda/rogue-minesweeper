# Phase 2050: Progression POC - Verification Checklist

## Functional Verification

### Stats System
- [ ] VER-01: HighScores displays best level reached correctly
- [ ] VER-02: HighScores displays best gold run correctly
- [ ] VER-03: HighScores displays total runs correctly
- [ ] VER-04: HighScores displays total gold earned correctly
- [ ] VER-05: Stats update after each run ends
- [ ] VER-06: Stats persist after browser refresh

### Run Stats
- [ ] VER-07: RunStats shows current level during gameplay
- [ ] VER-08: RunStats shows current gold during gameplay
- [ ] VER-09: RunStats shows "new best" indicator when beating personal best
- [ ] VER-10: RunStats updates in real-time as gold increases

### Reveal Scroll
- [ ] VER-11: Reveal Scroll appears in floor shop (rare)
- [ ] VER-12: Reveal Scroll costs 150 gold
- [ ] VER-13: Reveal Scroll can be purchased when player has enough gold
- [ ] VER-14: Reveal Scroll buff applied at next level start
- [ ] VER-15: Reveal Scroll reveals only logically deducible tiles (not entire board)
- [ ] VER-16: Reveal Scroll consumed after use

### Game Loop Integration
- [ ] VER-17: Can start a new run from menu/button
- [ ] VER-18: Floor progression works (complete floor → shop → next floor)
- [ ] VER-19: Shop items can be purchased and effects apply
- [ ] VER-20: Death triggers Game Over modal
- [ ] VER-21: Game Over modal shows run stats
- [ ] VER-22: Continue from Game Over leads to Meta Shop
- [ ] VER-23: Meta Shop displays available permanent upgrades
- [ ] VER-24: Permanent upgrades can be purchased with meta gold
- [ ] VER-25: Starting new run applies permanent upgrades
- [ ] VER-26: High scores update when run ends

## Constitution Compliance

### Principle I: Information Is Power
- [ ] CONST-01: Reveal Scroll provides information advantage (reveals safe tiles)

### Principle IV: Resource Tension
- [ ] CONST-02: Reveal Scroll is expensive (150 gold creates meaningful choice)
- [ ] CONST-03: Gold spending decisions feel impactful

### Principle V: Passive Mastery
- [ ] CONST-04: No new active ability buttons added
- [ ] CONST-05: Reveal Scroll is passive buff applied at level start

### Principle VII: Move Fast, Iterate Often
- [ ] CONST-06: Produces fully playable build
- [ ] CONST-07: All features testable through play

## User Gate Verification

Per phase requirements, user must manually verify:

### Basic Flow
- [ ] UG-01: Start new run
- [ ] UG-02: Clear multiple floors (5+)
- [ ] UG-03: Shop between floors works
- [ ] UG-04: Buy items, see effects

### Death & Meta Progression
- [ ] UG-05: Die at some point
- [ ] UG-06: Meta shop appears with gold
- [ ] UG-07: Buy permanent upgrades
- [ ] UG-08: Start new run
- [ ] UG-09: Upgrades apply at start

### Extended Play
- [ ] UG-10: Can reach floor 10+ with upgrades
- [ ] UG-11: High scores persist across sessions

## Technical Verification

### Type Safety
- [ ] TECH-01: TypeScript compilation passes with no errors
- [ ] TECH-02: No `any` types in new code
- [ ] TECH-03: All new interfaces properly typed

### Code Quality
- [ ] TECH-04: ESLint passes with no errors
- [ ] TECH-05: Prettier formatting applied
- [ ] TECH-06: No console.log statements in production code

### Persistence
- [ ] TECH-07: Stats stored in localStorage correctly
- [ ] TECH-08: Stats survive browser refresh
- [ ] TECH-09: Stats survive browser close and reopen

## Performance
- [ ] PERF-01: No noticeable lag when updating stats
- [ ] PERF-02: Reveal Scroll activation is instantaneous
- [ ] PERF-03: HighScores component renders quickly
