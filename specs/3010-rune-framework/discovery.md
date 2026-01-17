# Phase 3010: Rune Framework - Discovery

## Codebase Examination

### Existing Buff System

The game has a **two-layer buff system**:

#### ActiveBuffs (temporary, floor-level)
Located in `src/types/player.ts`:
```typescript
export interface ActiveBuffs {
  extraLife?: boolean;
  goldenGoose?: boolean;
  goldMagnet?: boolean;
  steadyHand?: boolean;
  forcefield?: number;  // Counted
  scrapMetal?: boolean;
  shieldBattery?: boolean;
}
```

#### NextLevelBuffs (applied at level start)
Transferred to ActiveBuffs at level start, then cleared.

### Current Progression Tiers

| Tier | Scope | Source | Current Implementation |
|------|-------|--------|------------------------|
| Floor | This floor only | Random tile drops | Not implemented |
| Run | Until death | Shop purchases | `ActiveBuffs` via shop |
| Permanent | Forever | End-of-run shop | `metaStore.upgrades` |

### UI Components

**RunesPanel** (`src/components/sidebar/RunesPanel.tsx`):
- Currently displays `ActiveBuffs` as "Active Runes"
- Shows 3 slots with dashed empty placeholders
- Uses emoji icons for each buff type

**VitalsPanel**: Shows HP, Gold, Shields, Floor

### Constitution Constraints

From `constitution.md`:

1. **Principle I: Information Is Power**
   - Runes MUST affect information gathering
   - Power-ups MUST feel native to Minesweeper's deduction mechanics

2. **Principle V: Passive Mastery**
   - NO active abilities or cooldown skills
   - All player power MUST modify reveal/flag behavior passively
   - Strategy comes from rune selection and synergy discovery

### Phase Spec Design Notes

From `.specify/phases/3010-rune-framework.md`:
```typescript
interface Rune {
  id: string;
  name: string;
  category: 'information' | 'defense' | 'economy' | 'utility';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  description: string;
  effect: RuneEffect;
  stackable: boolean;
}

interface RuneEffect {
  trigger: 'passive' | 'onReveal' | 'onFloorStart' | 'onDamage';
  action: RuneAction;
  magnitude?: number;
}
```

## Key Design Questions

### 1. Rune Lifecycle
- **Where do runes drop?** Floor tiles? Boss rewards? Both?
- **How long do runes last?** Run only? Permanent collection?
- **Equip limit?** 3 slots like current RunesPanel? More?

### 2. Distinction from Buffs
Current "buffs" are:
- Purchased in shop
- Last one floor (via NextLevelBuffs → ActiveBuffs)
- Boolean or counted

Runes appear to be:
- Dropped/found during gameplay
- Equipped from inventory
- Have categories and rarities

### 3. Stacking Mechanics
- Can you equip multiple of same rune?
- Do effects stack additively? Multiplicatively?
- Is there a cap?

### 4. Information-Based Effects
Per constitution, runes should focus on information:
- Reveal patterns (safe paths, monster types)
- Prediction (danger zones, loot locations)
- Deduction aids (adjacent hints, probability display)

## Integration Points

| File | Change Type | Purpose |
|------|-------------|---------|
| `src/types/rune.ts` | New | Rune type definitions |
| `src/types/player.ts` | Extend | Add equipped runes to PlayerState |
| `src/data/runes.ts` | New | Rune definitions |
| `src/stores/gameStore.ts` | Extend | Equip/unequip actions, effect processing |
| `src/components/sidebar/RunesPanel.tsx` | Modify | Show equipped runes vs active buffs |

## Confirmed Design Decisions

Based on user clarification:

### 1. Rune Acquisition
**Floor completion rewards** - After clearing a floor, player chooses 1 rune from 3 random options (Hades-style boon selection).

### 2. Rune Lifecycle
**Run only** - Runes last until death. Collect and equip during run, start fresh next run. Keeps roguelike variety.

### 3. Relationship to Buffs
**Separate systems** - Runes are distinct from shop buffs. Both can be active simultaneously:
- **Runes** = Found via floor rewards, equipped in slots
- **Buffs** = Purchased in shop, last one floor

### 4. Equip Slots
**3 slots** - Matches current RunesPanel UI layout. Enough for synergies, requires meaningful choices.

### 5. Rune Count (POC)
**6-8 runes** - 2 per category (information, defense, economy, utility). Enough to test system without scope creep.

### 6. Reward Selection UI
**Integrated into floor shop** - Rune selection appears as a section in the existing floor shop (alongside purchasable items). Pick 1 of 3 random runes for FREE as part of floor completion reward.

## Design Summary

```
Floor Clear → Floor Shop Opens
                 ├── Rune Section: Pick 1 of 3 random (FREE)
                 └── Item Section: Purchase with gold (existing)
                           ↓
              Equip rune to slot (max 3) + Buy items
                           ↓
              Continue to next floor
                           ↓
              Die → All runes lost → New run
```

**Integration with Existing Shop:**
- Floor shop (`FloorShop.tsx`) already handles post-floor purchases
- Add "Rune Rewards" section above or beside item purchases
- Runes are FREE (reward), items cost gold (purchase)
- Both selections happen before advancing to next floor
