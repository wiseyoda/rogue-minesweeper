---
phase: "1010"
name: zustand-stores
status: not_started
created: 2026-01-14
---

# 1010 - Zustand Stores

**Goal**: Set up state management with Zustand, including LocalStorage persistence.

## Scope

- Install Zustand
- Create gameStore (current run state)
- Create metaStore (permanent progression)
- Create uiStore (UI state, modals)
- Configure persist middleware for metaStore
- Add TypeScript types for store slices
- Create store hooks

## Deliverables

| File | Description |
|------|-------------|
| `src/stores/gameStore.ts` | Current run: grid, HP, gold, level, buffs |
| `src/stores/metaStore.ts` | Persistent: upgrades, stats, unlocks |
| `src/stores/uiStore.ts` | UI: modals, settings |
| `src/stores/index.ts` | Store exports |
| `src/stores/__tests__/gameStore.test.ts` | Store logic tests |

## Verification Gate

- [ ] Stores compile with strict TypeScript
- [ ] gameStore resets correctly on new run
- [ ] metaStore persists across page refresh
- [ ] Store actions update state correctly
- [ ] Tests pass for key store operations

## Estimated Complexity

**Medium** - State architecture needs to be right from the start.

## Store Shape

```typescript
// gameStore.ts
interface GameStore {
  // Grid state
  grid: Grid | null;
  level: number;

  // Player state
  hp: number;
  maxHp: number;
  shields: number;
  gold: number;

  // Buffs
  activeBuffs: Buff[];
  nextLevelBuffs: Buff[];

  // Game state
  gameOver: boolean;
  revealedCount: number;

  // Actions
  startNewRun: () => void;
  startLevel: () => void;
  revealCell: (row: number, col: number) => void;
  toggleFlag: (row: number, col: number) => void;
  takeDamage: (amount: number) => void;
  addGold: (amount: number) => void;
}

// metaStore.ts
interface MetaStore {
  // Stats
  totalRuns: number;
  highestLevel: number;
  totalGoldEarned: number;

  // Permanent upgrades
  upgrades: Record<string, number>;

  // Unlocks (future)
  unlockedRunes: string[];
  unlockedClasses: string[];

  // Actions
  purchaseUpgrade: (id: string) => void;
  recordRunEnd: (level: number, gold: number) => void;
}
```

## Notes

- Use Zustand's `persist` middleware for metaStore
- Keep gameStore in memory only (resets each session)
- Consider devtools middleware for debugging
