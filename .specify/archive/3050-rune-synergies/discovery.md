# Discovery: 3050 - Rune Synergies

**Phase**: `3050-rune-synergies`
**Created**: 2026-02-14
**Status**: Complete

## Phase Context

**Source**: `.specify/phases/3050-rune-synergies.md`
**Goal**: Implement rune combo detection and bonus effects, including discovery notification and UI visibility.

### Phase Goals (Source of Truth)

1. Synergy definition system
2. Combo detection engine
3. Synergy bonus effects
4. Synergy discovery notification
5. Synergy display in UI

## Codebase Examination

### Related Implementations

| Location | Description | Relevance |
|----------|-------------|-----------|
| `src/data/runes.ts` | All rune definitions and helper lookups (`getRune`, `countRune`) | Synergies should be declarative like rune data |
| `src/engine/runes.ts` | Rune effect processors (`applyOnFloorStartRunes`, `applyOnRevealRunes`, `applyOnDamageRunes`, passive modifiers) | Synergy bonuses should compose with current rune pipeline |
| `src/stores/gameStore.ts` | Main integration point for level start, reveal, damage, shop, and phase transitions | Best place to apply synergy bonuses and track discovery state |
| `src/types/game.ts` / `src/types/player.ts` | Runtime state model for run and player | Need state fields for active/discovered synergies and notification payload |
| `src/components/sidebar/RunesPanel.tsx` | Displays equipped runes in sidebar | Natural place to show active synergies |
| `src/components/game/Tile.tsx` | Renders highlight overlays (`prophecy`, `omniscience`) | Potential target for information-focused synergy visuals |

### Existing Patterns & Conventions

- **Data-driven content**: Runes are declared in static arrays and queried by ID.
- **Pure engine + stateful store split**: computation in `src/engine/*`, orchestration in `src/stores/gameStore.ts`.
- **Passive effects only**: enforced by constitution principle V and current rune API.
- **3-slot rune cap**: makes simultaneous synergies possible but constrained.
- **Vitest-first verification**: each rune phase added targeted tests under `src/engine/__tests__` and store/component tests where needed.

### Integration Points

- **Detection**: Recompute active synergies whenever equipped runes change (equip/replace/shop selection/start level).
- **Bonuses**: Apply synergy modifiers at existing hook points:
  - `startLevel` (floor-start effects)
  - `setPhase('shopping')` (floor completion bonus)
  - `takeDamage` (second-chance interactions)
  - shop price paths (`purchaseItem`, `selectRuneReward`, `rerollShop`, `getRuneRemovalFee`)
- **Notification**: Emit one-time discovery notification when a synergy is first activated in the run.
- **UI display**: Render active synergies in rune sidebar and show transient discovery card.

### Constraints Discovered

- No existing synergy model in data, engine, or state.
- `specflow status` context currently points to prior phase artifact directory until new artifacts exist.
- `FloorShop` computes some prices client-side from raw rune cost, so store-side effective price and UI display must stay in sync.
- Current highlight types are limited; adding new visual behavior should avoid broad rendering regressions.

## Memory & Constitution Inputs

- **Constitution Principle I (Information Is Power)**: At least some synergies should amplify deduction/information gameplay.
- **Constitution Principle V (Passive Mastery)**: Synergies must be passive, no new active controls.
- **Constitution Principle VII (Move Fast)**: Start with a compact, deterministic synergy set (5 synergies).
- **Tech Stack**: TypeScript + React + Zustand + Vitest; no new dependencies required.

## Scope Clarification Decisions

### Decision 1: Synergy Count and Shape

- Implement **5 fixed synergies** in this phase.
- Each synergy requires an exact rune set (2 runes).
- Activation is boolean (active/inactive), no synergy stacking tiers in this phase.

### Decision 2: Runtime State

- Track both:
  - `activeSynergyIds` (current active set)
  - `discoveredSynergyIds` (run lifetime discoveries)
- A discovery notification fires only when synergy ID moves from undiscovered -> discovered.

### Decision 3: Bonus Delivery Model

- Use a **synergy modifier object** computed from active IDs, then applied at existing store hook points.
- Avoid invasive rewrites to rune internals where possible.

### Decision 4: UI Surface

- Add `SynergyNotification` component (phase deliverable) for discovery pop.
- Extend rune sidebar to list currently active synergies (name + short effect text).

### Decision 5: Initial Synergy Set

The initial synergy definitions use existing runes and existing trigger points:

1. **Hunter's Vision** (`scout-eye` + `omniscience`)
   - Bonus: +1 extra safe reveal at floor start.
2. **Greedy** (`lucky-coin` + `treasure-hunter`)
   - Bonus: +50% floor completion gold bonus.
3. **Immortal** (`undying` + `second-chance`)
   - Bonus: second-chance leaves player at +1 additional HP.
4. **Seer** (`prophecy` + `danger-sense`)
   - Bonus: prophecy always triggers at floor start.
5. **Fortified Deal** (`shield-bearer` + `bargain-hunter`)
   - Bonus: +1 extra shield at floor start and +5% shop discount.

## Risks & Mitigations

- **Risk**: Modifier conflicts with existing rune effects.
  - **Mitigation**: Explicit application order and tests for composition.
- **Risk**: Notification spam on repeated activation checks.
  - **Mitigation**: Discovery deduping against `discoveredSynergyIds`.
- **Risk**: Shop price mismatch between UI and store logic.
  - **Mitigation**: Shared effective-price helper and integration tests.

## Recommendations for SPECIFY

### Must Include

- Explicit synergy entity schema and ID conventions.
- Activation/detection semantics (exact required runes, no stack tiers).
- Bonus application order with existing rune effects.
- Discovery notification behavior and UI exposure requirements.
- Multi-synergy coexistence requirement.

### Non-Goals

- Procedural synergy generation.
- 3+ rune chain synergies.
- DM hint system for synergies (defer to later AI phase).
- Persisting discovered synergies across runs.

### Verification Focus

- Synergy activates exactly when required runes are equipped.
- Bonuses materially affect gameplay hooks.
- Notification appears only on first discovery.
- Multiple synergies can be active simultaneously.
