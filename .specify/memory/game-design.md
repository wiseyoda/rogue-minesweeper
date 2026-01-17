# Game Design Document - Dungeon Delver

> Detailed mechanics, systems, and design specifications.

**Version**: 1.0.0
**Last Updated**: 2026-01-14
**Status**: DRAFT (Refine through playtesting)

---

## Core Concept

**Dungeon Delver** = Minesweeper + Roguelike + AI Dungeon Master

You explore a grid-based dungeon where:
- Hidden tiles contain monsters, traps, or loot
- Numbers indicate adjacent danger (like Minesweeper)
- You have HP, gold, and collectible runes
- An AI Dungeon Master reacts to your play with personality
- Monsters eventually start hunting YOU

---

## The Grid

### Tile Types

| Tile | Reveal Result | MVP | Phase |
|------|---------------|-----|-------|
| Empty | Safe, shows adjacent danger count | Yes | 1 |
| Monster | Damage to player | Yes | 1 |
| Trap | Damage + effect (slow, blind) | No | 2 |
| Loot | Gold + possible item | Yes | 1 |
| Rune | Collectible power-up | No | 2 |
| Shrine | Choice/blessing | No | 3 |
| Boss Lair | Boss encounter | No | 4 |

### Danger Numbers
Like Minesweeper, revealed tiles show a number indicating adjacent dangers.

| Number | Meaning |
|--------|---------|
| 0 | No adjacent dangers (auto-reveal neighbors) |
| 1-8 | Count of adjacent monster/trap tiles |
| Special | Runes might modify what counts as "danger" |

### Grid Scaling

| Floor | Grid Size | Monster % | Monster Types |
|-------|-----------|-----------|---------------|
| 1 | 6x6 | 10% | Goblin only |
| 2-3 | 8x8 | 12% | Goblin, Rat |
| 4-6 | 10x10 | 15% | +Skeleton (moves) |
| 7-9 | 12x12 | 18% | +Spider (ability) |
| 10+ | 14x14 | 20% | All types, scaling stats |

---

## Player Stats

### Core Stats

| Stat | Base | Description |
|------|------|-------------|
| HP | 3 | Hits before death |
| Max HP | 3 | Maximum HP (upgradeable) |
| Shield | 0 | Absorbs damage first |
| Gold | 0 | Currency for shops |
| Vision | 0 | Bonus reveal radius (rune effect) |

### Derived Stats (from runes)

| Stat | Source | Effect |
|------|--------|--------|
| Luck | Runes | Better loot drops |
| Danger Sense | Runes | See farther danger counts |
| Gold Find | Runes | +% gold from loot |
| Armor | Runes | % damage reduction |

---

## Monster System

### Monster Stats

```typescript
interface Monster {
  id: string;
  name: string;
  tier: 1 | 2 | 3 | 'boss';

  // Combat
  damage: number;        // HP lost on reveal
  hp?: number;           // For combat monsters (Phase 4+)

  // Movement (Phase 4+)
  canMove: boolean;
  moveSpeed: number;     // Tiles per turn
  movePattern: 'random' | 'chase' | 'patrol';

  // Abilities (Phase 4+)
  ability?: MonsterAbility;

  // Loot
  goldDrop: [number, number]; // min-max
  runeDrop?: number;          // % chance
}
```

### Monster Roster (MVP)

| Monster | Tier | Damage | Movement | Ability | Notes |
|---------|------|--------|----------|---------|-------|
| Goblin | 1 | 1 | Static | None | Tutorial monster |
| Rat | 1 | 1 | Static | None | Swarm (appears in groups) |
| Skeleton | 2 | 1 | 1 tile/turn | None | First mover (Phase 4) |
| Spider | 2 | 1 | Static | Web (slow) | First ability (Phase 4) |
| Orc | 2 | 2 | Static | None | Tanky |
| Ghost | 3 | 1 | 2 tiles/turn | Phase (ignores walls) | Fast mover |
| Dragon | Boss | 3 | 1 tile/turn | Fire Breath (AoE) | Boss floor 3 |

### Movement Rules (Phase 4)

1. **Turn Order**: Player reveals → Monsters move → Check collision
2. **Fog of War**: Monsters only exist in unrevealed tiles
3. **Chase Pattern**: Move toward last revealed tile
4. **Collision**: If monster moves to revealed tile, player takes damage
5. **Prediction**: Runes can show "movement paths" of nearby monsters

---

## Rune System (Phase 2)

### Rune Types

| Category | Effect Type | Example |
|----------|-------------|---------|
| Information | Reveal/predict | See monster type before reveal |
| Defense | HP/shield/armor | +1 Max HP |
| Economy | Gold/loot | +25% gold find |
| Utility | QoL/misc | Auto-flag obvious monsters |

### Rune Rarity

| Rarity | Drop Rate | Power Level |
|--------|-----------|-------------|
| Common | 60% | Minor effect |
| Uncommon | 30% | Moderate effect |
| Rare | 9% | Strong effect |
| Legendary | 1% | Build-defining |

### Example Runes (Information Category)

| Rune | Rarity | Effect |
|------|--------|--------|
| Scout's Eye | Common | See 1 random monster location at floor start |
| Danger Sense | Common | Danger numbers show +1 range |
| Monster Lens | Uncommon | Revealed numbers show monster TYPE count |
| Prophecy | Rare | Highlight safest tile to click |
| Omniscience | Legendary | See all monster locations (but not types) |

### Rune Synergies

Runes can combo when conditions are met:

```
Scout's Eye + Monster Lens = "Hunter's Vision"
  → See monster locations AND types at floor start
  → Bonus: +10% gold from those monsters
```

The DM occasionally hints at synergies:
> "Interesting combination you're building there. I've seen those two runes work... interestingly together."

---

## Progression Systems

### Floor Progression

Within a single floor:
- Reveal tiles to find loot
- Avoid/defeat monsters
- Clear all safe tiles to complete floor
- Gold and items persist to next floor

### Run Progression

Between floors (same run):
- Visit shop to spend gold
- Buy HP, runes, or consumables
- Difficulty increases each floor

### Meta Progression

Between runs (permanent):
- Spend leftover gold on permanent upgrades
- Unlock new classes (future)
- Unlock new runes in the pool
- Stats tracked for leaderboards

### Permanent Upgrades (Meta Shop)

| Upgrade | Cost | Effect | Max Level |
|---------|------|--------|-----------|
| Vitality | 100g | +1 starting Max HP | 3 |
| Fortune | 150g | +10% gold find | 5 |
| Preparation | 200g | Start with random common rune | 3 |
| Resilience | 250g | +1 starting shield | 2 |

---

## Shop System

### Floor Shop (Between Floors)

Appears after clearing each floor. Limited selection.

| Item Type | Example | Cost Range |
|-----------|---------|------------|
| Heal | Restore 1 HP | 25-50g |
| Max HP | +1 Max HP | 75-100g |
| Rune | Random rune | 50-200g |
| Shield | +1 Shield | 30-60g |
| Reroll | New shop items | 10g |

### Meta Shop (After Death)

Spend remaining gold on permanent upgrades.

Gold carries over: If you die with 500g, you can spend it all on upgrades.

---

## Difficulty Scaling

### Per-Floor Scaling

| Aspect | Scaling |
|--------|---------|
| Grid size | +2 tiles every 3 floors |
| Monster % | +1% every 2 floors |
| Monster damage | +1 every 5 floors |
| Monster HP | +1 every 5 floors (Phase 4) |
| Gold drops | +10% every floor |

### Boss Floors

Every 3rd floor is a boss floor:
- Floor 3: Dragon (introduces boss concept)
- Floor 6: Beholder (introduces AoE)
- Floor 9: Lich (introduces summoning)
- Floor 12+: Random boss with scaling

### Endless Scaling (Floor 15+)

After floor 15, scaling becomes exponential:
- Multiple boss monsters per floor
- All monsters can move
- New monster combinations
- "The dungeon stops playing fair"

---

## AI Dungeon Master

### Personality: Sarcastic Trickster

The dungeon is sentient, ancient, and bored. You're entertainment.

**Tone Examples**:
- On death: "Oh, what a shame. And you were doing so... adequately."
- On good play: "Hmph. Lucky guess. Try that again."
- On rune combo: "Those two together? Bold. Stupid, but bold."
- On return: "Back so soon? I didn't even have time to miss you."

### Mood States

| Mood | Trigger | Behavior |
|------|---------|----------|
| Amused | Player makes mistakes | More taunts, easier spawns |
| Bored | Player plays slowly | Hints to speed up, neutral spawns |
| Impressed | Clean floor clear | Grudging compliments, harder spawns |
| Vengeful | Long win streak | Maximum difficulty, no hints |
| Curious | Unusual rune combos | More hints about synergies |

### AI Integration Points

When to call the AI:
1. **Floor start**: Mood update + intro taunt
2. **Near-death moment**: Taunt or (rarely) hint
3. **Boss defeated**: Reaction to victory
4. **Death**: Death commentary
5. **Rune combo detected**: Synergy hint (30% chance)

### Rate Limiting

- Max 1 AI call per 30 seconds
- Cache responses when possible
- Fallback to pre-written lines if AI fails
- Track token usage, optimize prompts

---

## Win/Lose Conditions

### Floor Win
- All safe tiles revealed
- OR all monsters flagged correctly (classic mode)

### Floor Lose
- HP reaches 0

### Run Win
- There is no "win" - endless mastery
- Floors 1-10 are "tutorial"
- Floor 15+ is "true game"
- Personal bests tracked

### Achievements (Future)

| Achievement | Condition |
|-------------|-----------|
| First Steps | Clear floor 1 |
| Delver | Reach floor 10 |
| Survivor | Reach floor 20 |
| Legend | Reach floor 50 |
| No Damage | Clear a floor without taking damage |
| Pacifist | Clear a floor by flagging only (no reveals) |
| Maximalist | Clear a floor with 100% tiles revealed |

---

## UI/UX Specifications

### Game Board
- Center of screen
- Tiles are clickable squares
- Revealed tiles show number or content
- Unrevealed tiles have consistent "fog" look

### HUD
- Top: HP hearts, Shield icons, Gold counter
- Left: Equipped runes (icons)
- Right: Floor number, turn counter
- Bottom: DM dialogue box (when speaking)

### Shop
- Modal overlay
- Grid of purchasable items
- Gold counter prominent
- "Continue" button to proceed

### Animations (Priority Order)
1. Tile reveal (most common, must feel great)
2. Damage taken (screen shake, red flash)
3. Loot pickup (gold floats up)
4. Monster movement (smooth slide)
5. Rune activation (glow effect)

---

## Balancing Notes

### Design Pillars for Balance
1. **First floor should be trivially easy** - teach, don't punish
2. **Death should feel fair** - player made a mistake, not RNG
3. **Power fantasy is real** - late-game should feel OP
4. **Endless scales infinitely** - eventually everyone dies

### Tuning Levers
- Monster density
- Monster damage
- Gold drop rates
- Rune drop rates
- Shop prices
- Upgrade costs

### Playtest Questions
- How long is average run? (Target: 15-30 min)
- What floor do most players die? (Target: 5-10 for new players)
- Do runes feel impactful?
- Is the DM annoying or charming?
- Does endless feel endless?

---

## Future Ideas (Parking Lot)

- Multiple dungeon biomes (cave, crypt, forest)
- Class system with unique abilities
- Daily challenges with leaderboards
- Replay system (watch your runs)
- Mod support (custom runes, monsters)
- Mobile app (touch controls)
- Multiplayer race mode (same seed)
