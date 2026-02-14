# Implementation Plan: 3060 - Rune System POC

**Branch**: `3060-rune-system-poc`  
**Date**: 2026-02-14  
**Spec**: `specs/3060-rune-system-poc/spec.md`

## Summary

The codebase already contains a mature rune catalog, modifier engine, and synergy system. This phase completes the missing integration point: tile-based rune drops flowing into shop rune offers, plus balance controls and verification for build diversity.

## Technical Context

**Language/Version**: TypeScript 5.x  
**Primary Dependencies**: React 18, Zustand 4, Vitest  
**Storage**: In-memory run state + existing persistence in stores  
**Testing**: Vitest (`src/engine/__tests__`, `src/stores/__tests__`)  
**Target Platform**: Web (Vite app)  
**Project Type**: Single web app  
**Performance Goals**: No noticeable reveal-loop slowdown from drop checks  
**Constraints**: Keep passive-only rune interactions; avoid shop/synergy regressions  
**Scale/Scope**: Milestone 3 POC closure for USER GATE

## Constitution Check

- Principle I (Information Is Power): preserved; drops complement information gameplay rather than replacing it.
- Principle V (Passive Mastery): preserved; no active rune controls added.
- Principle VII (Move Fast, Iterate Often): preserved; scope limited to integration + verification.

No constitution violations identified.

## Project Structure

### Documentation (this feature)

```text
specs/3060-rune-system-poc/
├── discovery.md
├── spec.md
├── requirements.md
├── plan.md
├── tasks.md
└── checklists/
    ├── implementation.md
    └── verification.md
```

### Source Code (planned touch points)

```text
src/
├── data/
│   ├── runes.ts
│   └── __tests__/runes.poc.test.ts
├── engine/
│   ├── runes.ts
│   └── __tests__/runeDrops.test.ts
├── stores/
│   ├── gameStore.ts
│   └── __tests__/gameStore.runeDrops.test.ts
├── components/shop/
│   └── FloorShop.tsx
└── types/
    └── game.ts
```

## Implementation Phases

### Phase 1: Drop Model & Balance Constants

- Define rune-drop constants/caps and helper(s) for controlled tile-drop selection.
- Add/adjust run-state fields needed to track dropped rune offers until shop generation.

### Phase 2: Reveal/Shop Integration

- Roll tile drops from safe reveal paths (`revealCell`, `usePeekScroll`).
- Merge dropped rune offers into shop rune offerings while preserving baseline random offers.
- Preserve existing rune purchase, replacement, and price modifier paths.

### Phase 3: Validation & Tuning

- Add unit tests for drop helper and cap behavior.
- Add store integration tests for drop-to-shop-to-purchase flow.
- Add regression checks for synergy discoverability and build coverage metrics.

## Risk Management

- **Risk**: Drop rates overpower economy.
  - **Mitigation**: hard cap per floor + explicit constants + tests.
- **Risk**: Shop/rune regression due to merged offer lists.
  - **Mitigation**: targeted store tests plus existing shop suite.
- **Risk**: USER GATE fails due weak build differentiation.
  - **Mitigation**: add structured manual verification checklist tied to archetypes.
