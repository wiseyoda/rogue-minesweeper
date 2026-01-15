# Requirements Checklist: Phase 0020 - Core Types

> Track requirement completion during implementation.

---

## Functional Requirements

### FR-1: Cell Types
- [ ] FR-1.1: Define `Cell` interface with all properties
- [ ] FR-1.2: Define `CellPosition` type
- [ ] FR-1.3: Add JSDoc comments

### FR-2: Grid Types
- [ ] FR-2.1: Define `Grid` type
- [ ] FR-2.2: Define `GridConfig` interface
- [ ] FR-2.3: Define `GridDimensions` interface

### FR-3: Player Types
- [ ] FR-3.1: Define `PlayerState` interface
- [ ] FR-3.2: Define `PlayerStats` interface
- [ ] FR-3.3: Define `ActiveBuffs` and `NextLevelBuffs`
- [ ] FR-3.4: Use appropriate optional properties for buffs

### FR-4: Monster Types
- [ ] FR-4.1: Define `MonsterTier` union type
- [ ] FR-4.2: Define `Monster` interface
- [ ] FR-4.3: Add Phase 4 placeholder properties

### FR-5: Item and Buff Types
- [ ] FR-5.1: Define `ItemRarity` union type
- [ ] FR-5.2: Define `ShopItem` interface
- [ ] FR-5.3: Define `ShopItemPool` interface

### FR-6: Shop Types
- [ ] FR-6.1: Define `LeveledUpgrade` interface
- [ ] FR-6.2: Define `UnlockableUpgrade` interface
- [ ] FR-6.3: Define `PermanentUpgrade` discriminated union

### FR-7: Game Session Types
- [ ] FR-7.1: Define `GamePhase` union type
- [ ] FR-7.2: Define `GameState` interface
- [ ] FR-7.3: Define `GameStats` interface
- [ ] FR-7.4: Define `RunState` interface

### FR-8: Index Export
- [ ] FR-8.1: Create `index.ts` with all exports
- [ ] FR-8.2: Group exports logically
- [ ] FR-8.3: Use type-only exports

---

## Non-Functional Requirements

- [ ] NFR-1: All types compile with strict TypeScript
- [ ] NFR-2: All exported types have JSDoc comments
- [ ] NFR-3: No `any` types used
- [ ] NFR-4: Type guards provided where applicable

---

## Verification Gate

- [ ] All types compile with strict TypeScript
- [ ] Types have JSDoc comments
- [ ] Types model existing POC functionality
- [ ] No `any` types used
- [ ] Unit tests for type guards (if any)
