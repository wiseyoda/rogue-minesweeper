# Discovery: 3060 - Rune System POC

**Phase**: `3060-rune-system-poc`
**Created**: 2026-02-14
**Status**: Draft

## Phase Context

**Source**: `.specify/phases/3060-rune-system-poc.md`
**Goal**: Deliver a playable rune milestone with 10+ runes, discoverable synergies, tile-based rune drops, and shop-driven build decisions.

## Codebase Examination

### Related Implementations

| Location | Description | Relevance |
|----------|-------------|-----------|
| `src/data/runes.ts` | Canonical rune catalog (information/defense/economy/utility) | Already contains 18 runes and shop prices |
| `src/data/synergies.ts` | Synergy definitions and required rune combos | Confirms synergy system exists and is active |
| `src/engine/runes.ts` | Rune effect engine (`onReveal`, `onFloorStart`, `onDamage`, modifiers) | Best insertion point for tile-drop helper logic |
| `src/engine/synergies.ts` | Active synergy resolution and modifier composition | Needed for regression checks while adding drop flow |
| `src/stores/gameStore.ts` | Runtime integration for reveal, shop, rewards, and phase transitions | Required for connecting tile drops to shop rune offers |
| `src/components/shop/FloorShop.tsx` | Rune/item shop UI | Needed to surface tile-dropped rune offers cleanly |
| `src/components/sidebar/RunesPanel.tsx` | Equipped runes + active synergies panel | Existing UX already supports discoverability of synergies |

### Existing Patterns & Conventions

- Rune behavior is split cleanly between pure engine helpers (`src/engine/runes.ts`) and stateful store integration (`src/stores/gameStore.ts`).
- New progression features are usually introduced with store-level integration tests in `src/stores/__tests__` plus focused engine unit tests in `src/engine/__tests__`.
- Shop pricing and rune selection are centralized in `gameStore` and should stay centralized.

### Integration Points

- Tile reveal flow: `useGameStore.revealCell()` and `useGameStore.usePeekScroll()`.
- Shop entry flow: `useGameStore.setPhase('shopping')` and `useGameStore.generateShop()`.
- Rune purchase flow: `useGameStore.selectRuneReward()` and replacement path.
- Synergy UX: `run.activeSynergyIds`, `run.discoveredSynergyIds`, `run.synergyNotification`.

### Constraints Discovered

- Phase deliverable references `src/data/runes/index.ts`, but this repository uses `src/data/runes.ts` as the active source of truth.
- Rune shop logic is already modifier-aware (discounts/increases), so tile-drop work must avoid duplicating price logic.
- USER GATE requires manual validation that builds feel meaningfully different; design needs explicit test paths for this.

## Requirements Sources

### From Phase File

- Integrate all prior rune sets into a playable build.
- Add rune drops from revealed tiles.
- Keep rune purchases in shop.
- Ensure synergies are discoverable and applied.
- Tune balance so distinct builds emerge.

### From Memory Documents

- **Constitution Principle I (Information Is Power)**: Rune interactions must preserve deduction-focused gameplay.
- **Constitution Principle V (Passive Mastery)**: No active ability buttons; rune power remains passive.
- **Constitution Principle VII (Move Fast, Iterate Often)**: Ship a playable POC, then verify via user gate.

## Scope Clarification

### Working Assumptions (No Additional User Input Required)

- Tile-based rune drops should feed into existing rune-purchase flow, not bypass shop economy.
- Existing rune and synergy implementations are mostly complete; this phase closes integration and tuning gaps.
- Build differentiation is validated via combination of automated checks and explicit manual gate steps.

### Confirmed Understanding

**What this phase needs to achieve**:
- Complete the missing tile-drop-to-shop loop.
- Preserve and verify rune purchase and synergy systems.
- Add tuning and verification coverage to support the USER GATE.

**How it relates to existing code**:
- Reuse current rune catalog, synergy engine, and shop architecture.
- Add the minimum new state and helper logic necessary for tile drops and balance checks.

**Key constraints and requirements**:
- Keep logic passive and deterministic where testable.
- Avoid regressions in existing shop and synergy flows.
- Provide concrete manual verification path for build diversity.

**User confirmed**: Implicit (orchestrated flow, no additional clarification required)

## Recommendations For Spec

### Include In Scope

- Tile reveal rune-drop mechanics with floor-aware balancing knobs.
- Integration of dropped runes into shop reward offerings.
- Regression coverage for synergy discovery and shop purchasing.
- Explicit build archetype verification criteria for the USER GATE.

### Exclude From Scope

- New rune categories or major rune redesign.
- New UI surfaces beyond minor shop/rune-offer affordances.
- Non-rune milestone features (AI DM, movement, audio, etc.).
