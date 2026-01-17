# Dungeon Delver Development Roadmap

> **Source of Truth**: This document defines all feature phases, their order, and completion status.
> Work proceeds through phases sequentially. Each phase produces a deployable increment.

**Project**: Dungeon Delver - Minesweeper meets Hades roguelike with AI Dungeon Master
**Created**: 2026-01-14
**Schema Version**: 2.1 (ABBC numbering, modular phases)
**Status**: Not Started

---

## Phase Numbering (v2.1)

Phases use **ABBC** format:

- **A** = Milestone (0-9) - Major version or project stage
- **BB** = Phase (01-99) - Sequential work within milestone
- **C** = Hotfix (0-9) - Insert slot (0 = main phase, 1-9 = hotfixes/inserts)

---

## Phase Overview

| Phase                                | Name                     | Status         | Verification Gate                                |
| ------------------------------------ | ------------------------ | -------------- | ------------------------------------------------ |
| **Milestone 0: Foundation**          |                          |                |                                                  |
| 0010                                 | project-setup            | ✅ Complete | Project scaffolded, builds, and deploys          |
| 0020                                 | core-types               | ✅ Complete | All game types defined and tested                |
| 0030                                 | grid-engine              | ✅ Complete | Minesweeper logic works in isolation             |
| 0040                                 | core-logic-poc           | ✅ Complete | **USER GATE**: Playable grid in test page        |
| **Milestone 1: Game State & UI**     |                          |                |                                                  |
| 1010                                 | **zustand-stores**       | ✅ Complete | State management with persistence                |
| 1020                                 | game-board-ui            | ✅ Complete | Interactive tile grid renders                    |
| 1030                                 | hud-components           | ✅ Complete | HP, gold, level display working                  |
| 1040                                 | **ui-integration-poc**   | ✅ Complete | **USER GATE**: Full game loop works              |
| 1041                                 | design-system-integration | ✅ Complete | Mockup design implemented in React              |
| **Milestone 2: Progression Systems** |                          |                |                                                  |
| 2010                                 | floor-progression        | ✅ Complete | Level advancement and scaling                    |
| 2020                                 | floor-shop               | ✅ Complete | Between-floor shop UI and logic                  |
| 2030                                 | meta-progression         | ✅ Complete | Permanent upgrades persist                       |
| 2040                                 | meta-shop                | ✅ Complete | Shop polish + First Click Safety fix             |
| 2050                                 | **progression-poc**      | ✅ Complete | **USER GATE**: Complete run loop works           |
| **Milestone 3: Rune System**         |                          |                |                                                  |
| 3010                                 | rune-framework           | ✅ Complete | Rune types, effects, and stacking                |
| 3020                                 | information-runes        | ✅ Complete | Runes that reveal/predict danger                 |
| 3030                                 | defense-runes            | ✅ Complete | Runes for HP, shields, armor                     |
| 3040                                 | economy-runes            | ✅ Complete | Runes for gold and loot                          |
| 3050                                 | rune-synergies           | ⬜ Not Started | Combo detection and effects                      |
| 3060                                 | **rune-system-poc**      | ⬜ Not Started | **USER GATE**: 10+ runes playable with synergies |
| **Milestone 4: AI Dungeon Master**   |                          |                |                                                  |
| 4010                                 | ai-context-builder       | ⬜ Not Started | Build player history for AI                      |
| 4020                                 | ai-provider-integration  | ⬜ Not Started | Vercel AI SDK with Gemini/Claude                 |
| 4030                                 | dm-dialogue-ui           | ⬜ Not Started | Dialogue box and mood indicator                  |
| 4040                                 | dm-personality           | ⬜ Not Started | Sarcastic trickster prompts                      |
| 4050                                 | dm-triggers              | ⬜ Not Started | When DM speaks (death, boss, etc.)               |
| 4060                                 | **ai-dm-poc**            | ⬜ Not Started | **USER GATE**: DM reacts with personality        |
| **Milestone 5: Moving Monsters**     |                          |                |                                                  |
| 5010                                 | turn-system              | ⬜ Not Started | Turn-based game loop                             |
| 5020                                 | monster-movement         | ⬜ Not Started | Monsters move after player acts                  |
| 5030                                 | monster-abilities        | ⬜ Not Started | Web, fire breath, phase                          |
| 5040                                 | boss-encounters          | ⬜ Not Started | Every 3rd floor boss                             |
| 5050                                 | **moving-monsters-poc**  | ⬜ Not Started | **USER GATE**: Tactical monster combat works     |
| **Milestone 6: Polish & Audio**      |                          |                |                                                  |
| 6010                                 | visual-juice             | ⬜ Not Started | Animations, screen shake, particles              |
| 6020                                 | audio-system             | ⬜ Not Started | Howler.js integration                            |
| 6030                                 | sound-effects            | ⬜ Not Started | Click, damage, loot sounds                       |
| 6040                                 | music                    | ⬜ Not Started | Chiptune background music                        |
| 6050                                 | **polish-poc**           | ⬜ Not Started | **USER GATE**: Game feels great to play          |
| **Milestone 7: Community Features**  |                          |                |                                                  |
| 7010                                 | seed-system              | ⬜ Not Started | Deterministic RNG for sharing                    |
| 7020                                 | daily-challenges         | ⬜ Not Started | Same seed for everyone                           |
| 7030                                 | leaderboards             | ⬜ Not Started | Vercel KV high scores                            |
| 7040                                 | **community-poc**        | ⬜ Not Started | **USER GATE**: Seeds shareable, scores tracked   |
| **Milestone 8: Production**          |                          |                |                                                  |
| 8010                                 | pwa-support              | ⬜ Not Started | Offline play, installable                        |
| 8020                                 | performance-optimization | ⬜ Not Started | Bundle size, render perf                         |
| 8030                                 | accessibility            | ⬜ Not Started | Keyboard nav, screen reader                      |
| 8040                                 | error-handling           | ⬜ Not Started | Graceful failures, recovery                      |
| 8050                                 | **production-gate**      | ⬜ Not Started | **USER GATE**: Ready for public release          |

**Legend**: ⬜ Not Started | 🔄 In Progress | ⏳ Awaiting User | ✅ Complete | **USER GATE** = Requires user verification

---

## Phase Details

Phase details are stored in modular files:

| Location                      | Content                      |
| ----------------------------- | ---------------------------- |
| `.specify/phases/*.md`        | Active/pending phase details |
| `.specify/history/HISTORY.md` | Archived completed phases    |

To view a specific phase:

```bash
speckit phase show 0010
```

To create a phase:

```bash
speckit phase create 0010 "project-setup"
```

---

## Verification Gates Summary

| Gate                | Phase | What User Verifies                                                    |
| ------------------- | ----- | --------------------------------------------------------------------- |
| Core Logic POC      | 0040  | Grid reveals correctly, numbers accurate, monsters dealt damage       |
| UI Integration POC  | 1040  | Complete game loop: reveal tiles, take damage, collect gold, win/lose |
| Progression POC     | 2050  | Multi-level run with shops, permanent upgrades persist across runs    |
| Rune System POC     | 3060  | Runes affect gameplay, synergies discoverable, builds feel different  |
| AI DM POC           | 4060  | DM speaks with personality, reacts to player actions, mood changes    |
| Moving Monsters POC | 5050  | Monsters chase player, abilities work, boss fights are tense          |
| Polish POC          | 6050  | Audio/visual feedback is satisfying, "one more run" feeling           |
| Community POC       | 7040  | Can share seeds with friends, daily challenge works                   |
| Production Gate     | 8050  | PWA installs, works offline, no crashes, accessible                   |

---

## Development Phases (from Constitution)

The Constitution defines 5 high-level phases. This roadmap breaks them into agentic-sized work:

| Constitution Phase | Roadmap Milestones | Focus                                                      |
| ------------------ | ------------------ | ---------------------------------------------------------- |
| Phase 1: Core Loop | Milestones 0-2     | Playable Minesweeper with HP, shops, meta-progression      |
| Phase 2: Runes     | Milestone 3        | Synergy system with 10+ runes, information-based abilities |
| Phase 3: AI DM     | Milestone 4        | Dynamic dungeon personality with 5+ mood states            |
| Phase 4: Movement  | Milestone 5        | Turn-based monster tactics, 3+ boss encounters             |
| Phase 5: Polish    | Milestones 6-8     | Full audio, seed sharing, daily challenges                 |

---

## Phase Sizing Guidelines

Each phase is designed to be:

- **Completable** in a single agentic coding session (~200k tokens)
- **Independently deployable** (no half-finished features)
- **Verifiable** with clear success criteria
- **Building** on previous phases

Typical phase size:

- 3-5 files modified
- 500-1000 lines of code
- Clear "done" condition

If a phase is running long:

1. Cut scope to MVP for that phase
2. Document deferred items in backlog
3. Prioritize verification gate requirements

---

## Technology Stack Reference

See `.specify/memory/tech-stack.md` for full details.

**Core**: React 18 + TypeScript + Vite + Zustand + Tailwind CSS
**AI**: Vercel AI SDK with Gemini/Claude/GPT (Milestone 4)
**Audio**: Howler.js (Milestone 6)
**Deployment**: Vercel

---

## How to Use This Document

### Starting a Phase

```
/speckit.orchestrate
```

Or manually:

```
/speckit.specify "Phase NNNN - [Phase Name]"
```

### After Completing a Phase

1. Update status in table above: ⬜ → ✅
2. Archive phase: `speckit phase archive NNNN`
3. If USER GATE: get explicit user verification before proceeding

### Adding New Phases

```bash
speckit roadmap insert --after 0020 "New Phase Name"
speckit phase create 0025 "new-phase"
```

---

## Architecture Reference

```
┌─────────────────────────────────────────────────────┐
│                    React UI                          │
├─────────────────────────────────────────────────────┤
│  GameBoard  │  HUD  │  Shop  │  DungeonMaster       │
├─────────────────────────────────────────────────────┤
│                  Zustand Stores                      │
│  gameStore │ metaStore │ dungeonStore │ uiStore     │
├─────────────────────────────────────────────────────┤
│                  Game Engine                         │
│  GridLogic │ MonsterAI │ RuneSystem │ TurnManager   │
├─────────────────────────────────────────────────────┤
│                  AI Layer (Milestone 4)              │
│  ContextBuilder │ ProviderAdapter │ ResponseParser  │
└─────────────────────────────────────────────────────┘
```

---

## Key Design Principles

From `.specify/memory/constitution.md`:

1. **Information Is Power** - Runes reveal and predict, not just +damage
2. **The Dungeon Is Alive** - AI DM with consistent sarcastic personality
3. **Emergent Complexity** - Simple base, layers added as player progresses
4. **Resource Tension** - HP, gold, shields are scarce
5. **Passive Mastery** - No ability buttons, runes modify behavior
6. **Juice Is Holistic** - Audio + visual + pacing all matter
7. **Move Fast, Iterate Often** - Each phase produces playable build

---

## UI Design Reference

**All visual design decisions are documented in the definitive UI mockup:**

📄 **`.specify/reference/ui-mockup-definitive.html`**

Open this file in a browser to see:
- Live interactive mockup with all tile states
- Complete color palette with CSS custom properties
- Typography scale, spacing system, timing tokens
- Button variants, icon library, atmosphere layers
- Design decisions log with rationale
- DO/DON'T implementation guidelines

**Any phase touching UI MUST reference this mockup.** Key decisions:
- **Single font**: Press Start 2P only (no font mixing)
- **No rounded corners** on tiles or panels
- **Mystic purple (#7030b0)** as brand signature color
- **40px tiles** with 2px gap
- **Segmented health bar** (not continuous)

See also: `.specify/memory/design-system.md` for quick reference tables.

---

## Backlog

Items captured for future triage. Run `/speckit.backlog` to assign to phases.

| Item | Description | Priority | Notes |
|------|-------------|----------|-------|
| [Recommendation] Add more shop items for variety (healing, buffs, utility) | Added 2026-01-15 | - | |
| [Deferred from 2020] T036: Add purchase confirmation animation - P3 polish item | Added 2026-01-15 | - | |
| [Deferred from 2040] T005: Status message when First Click Safety triggers - requires status/toast system | Added 2026-01-15 | Low | |
