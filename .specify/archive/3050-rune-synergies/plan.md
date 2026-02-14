# Implementation Plan: 3050 - Rune Synergies

**Branch**: `3050-rune-synergies`  
**Date**: 2026-02-14  
**Spec**: `specs/3050-rune-synergies/spec.md`

## Summary

Introduce a data-driven synergy system that detects rune-pair combos, computes passive synergy modifiers, applies those modifiers at existing gameplay hook points, and surfaces first-discovery feedback in UI.

## Technical Context

- **Language/Version**: TypeScript 5.x
- **UI**: React 18
- **State**: Zustand + Immer
- **Testing**: Vitest + Testing Library
- **Project Type**: Single web app (`src/`)
- **Constraints**:
  - No active ability buttons
  - No new dependencies
  - Maintain compatibility with existing rune behavior

## Constitution Check

- **I. Information Is Power**: Covered by Seer + Hunter's Vision synergies.
- **V. Passive Mastery**: All synergy bonuses are passive and event-driven.
- **VII. Move Fast**: Fixed synergy list (5) and minimal invasive integration.

No violations.

## Synergy Definitions (Phase Scope)

| ID | Name | Required Runes | Bonus Effects |
|----|------|----------------|---------------|
| `hunters-vision` | Hunter's Vision | `scout-eye`, `omniscience` | +1 extra safe reveal at floor start |
| `greedy` | Greedy | `lucky-coin`, `treasure-hunter` | +50% floor completion bonus |
| `immortal` | Immortal | `undying`, `second-chance` | Second Chance leaves +1 additional HP |
| `seer` | Seer | `prophecy`, `danger-sense` | Prophecy highlight guaranteed at floor start |
| `fortified-deal` | Fortified Deal | `shield-bearer`, `bargain-hunter` | +1 floor-start shield, +5% shop discount |

## Architecture Changes

### 1. New Data Module

**File**: `src/data/synergies.ts`

Responsibilities:
- Define `SYNERGIES` list
- Export helper lookups (`getSynergy`, `getAllSynergies`)

### 2. New Engine Module

**File**: `src/engine/synergies.ts`

Responsibilities:
- Detect active synergies from equipped runes
- Compute `SynergyModifiers` object
- Compute newly discovered IDs (set diff)
- Provide typed helpers for store integration

Proposed core APIs:

```ts
findActiveSynergyIds(equippedRunes: string[]): string[]
getSynergyModifiers(activeSynergyIds: string[]): SynergyModifiers
getNewlyDiscoveredSynergyIds(active: string[], discovered: string[]): string[]
```

### 3. Type Extensions

**Files**:
- `src/types/game.ts`
- `src/types/player.ts` (only if needed; default preference is `RunState` placement)
- `src/stores/types.ts`

State additions (RunState):
- `activeSynergyIds: string[]`
- `discoveredSynergyIds: string[]`
- `synergyNotification?: { id: string; name: string; description: string }`

### 4. Store Integration

**File**: `src/stores/gameStore.ts`

Add a private refresh path that:
1. Recomputes active synergies from equipped runes
2. Computes newly discovered IDs
3. Updates `activeSynergyIds`, `discoveredSynergyIds`
4. Emits a notification payload for first newly discovered synergy

Integration points:
- `startNewRun` (reset)
- `startLevel` (recompute + apply floor-start modifiers)
- `equipRune`, `replaceRune`, `confirmRuneReplacement`, `selectRuneReward` (recompute)
- `setPhase('shopping')` (apply floor bonus multiplier)
- `takeDamage` (second-chance additional HP)
- `purchaseItem`, `selectRuneReward`, `rerollShop`, `getRuneRemovalFee` (synergy shop discount)

### 5. UI Components

**New File**: `src/components/hud/SynergyNotification.tsx`

Responsibilities:
- Render discovery card/banner
- Show synergy name + effect
- Dismiss automatically (timer) and/or manually

**Updated Files**:
- `src/components/sidebar/Sidebar.tsx` (render notification)
- `src/components/sidebar/RunesPanel.tsx` (display active synergies)
- optional export surface updates in `src/components/hud/index.ts`

### 6. Tests

**New File**: `src/engine/__tests__/synergies.test.ts`

Coverage:
- Detection per synergy
- Multi-synergy activation
- Modifier aggregation
- Newly discovered ID behavior

**Updated Tests**:
- `src/stores/__tests__/gameStore.test.ts`
- `src/stores/__tests__/gameStore.shop.test.ts`
- `src/stores/__tests__/gameStore.shopIntegration.test.ts`
- add component test for `SynergyNotification` if needed

## Application Order Rules

To avoid ambiguous stacking:

1. Base values from existing game logic
2. Rune modifiers (`getPassiveRuneModifiers`)
3. Synergy modifiers
4. Existing minimum/ceiling clamps (e.g., price min = 1)

## File Change Plan

| File | Change |
|------|--------|
| `src/data/synergies.ts` | New |
| `src/engine/synergies.ts` | New |
| `src/engine/__tests__/synergies.test.ts` | New |
| `src/types/game.ts` | Modify |
| `src/stores/types.ts` | Modify |
| `src/stores/gameStore.ts` | Modify |
| `src/components/hud/SynergyNotification.tsx` | New |
| `src/components/hud/index.ts` | Modify |
| `src/components/sidebar/Sidebar.tsx` | Modify |
| `src/components/sidebar/RunesPanel.tsx` | Modify |
| `src/stores/__tests__/gameStore*.test.ts` | Modify |

## Risks

- **State drift** between equipped runes and active synergies.
  - Mitigation: single refresh helper reused across all rune mutation paths.
- **Shop price inconsistency** between displayed and charged costs.
  - Mitigation: compute effective price through shared helper.
- **UI noise** from repeated notifications.
  - Mitigation: discovery-only notifications; no reactivation notices.

## Verification Strategy

- Unit tests for synergy engine behavior.
- Store tests for integration hooks and modifier outcomes.
- UI test for notification rendering/dismissal.
- Full quality gate: test, lint, typecheck.
