# Requirements Decisions Log

> Decisions captured during `/flow.init` interview. These feed into memory document generation.

## Decision Index
| ID | Phase | Title | Confidence | Memory Doc Impact |
|----|-------|-------|------------|-------------------|
| D-1 | 0 | Project Goal | High | constitution.md |
| D-2 | 0 | Project Type | Medium | tech-stack.md |
| D-3 | 0 | Target Audience | High | constitution.md |
| D-4 | 0 | Team Composition | High | constitution.md |
| D-5 | 0 | Iteration Style | High | constitution.md |
| D-6 | 0 | Platform | High | tech-stack.md |
| D-7 | 0 | Framework | High | tech-stack.md |
| D-8 | 0 | Visual Style | High | design-system.md |
| D-9 | 1 | Core Hook | High | constitution.md |
| D-10 | 1 | Run Length | High | constitution.md |
| D-11 | 1 | Core Mechanic | High | constitution.md |
| D-12 | 1 | Meta Progression | High | constitution.md |
| D-13 | 3 | Power-up System | High | constitution.md |
| D-14 | 3 | Death Mechanic | High | constitution.md |
| D-15 | 3 | Class System | High | constitution.md |
| D-16 | 3 | Economy | High | constitution.md |
| D-17 | 5 | Persistence | High | tech-stack.md |
| D-18 | 5 | Rendering | High | tech-stack.md |
| D-19 | 5 | State Management | High | tech-stack.md |
| D-20 | 5 | Deployment | High | tech-stack.md |
| D-21 | 7 | Audio Strategy | High | design-system.md |
| D-22 | 7 | Input Methods | High | ux-patterns.md |
| D-23 | 7 | Onboarding | High | ux-patterns.md |
| D-24 | 7 | MVP Scope | High | constitution.md |
| D-25 | Dream | Information as Power | High | constitution.md, game-design.md |
| D-26 | Dream | Living Dungeon Narrative | High | constitution.md |
| D-27 | Dream | AI Dungeon Master | High | constitution.md, tech-stack.md |
| D-28 | Dream | DM Personality | High | game-design.md |
| D-29 | Dream | Rune Synergy System | High | game-design.md |
| D-30 | Dream | Synergy Discovery | High | game-design.md |
| D-31 | Dream | Moving Monsters | High | game-design.md |
| D-32 | Dream | Monster Stats | High | game-design.md |
| D-33 | Dream | Passive-Only Abilities | High | constitution.md |
| D-34 | Dream | Resource Tension | High | constitution.md |
| D-35 | Dream | Endless Mastery Endgame | High | constitution.md |
| D-36 | Dream | Seed Sharing | High | tech-stack.md |
| D-37 | Dream | Elevator Pitch | High | constitution.md |
| D-38 | Dream | Phased Development | High | constitution.md |

## Progress
- **Decisions Made**: 38
- **Open Questions**: 0
- **Contradictions**: 0

---

#### D-1: Project Goal
- **Phase**: 0: Discovery
- **Status**: Decided
- **Confidence**: High
- **Context**: Understanding what we're building and why
- **Decision**: Rewrite existing POC into a polished, best-in-class roguelike Minesweeper game
- **Alternatives**: Continue iterating on POC (rejected - needs proper architecture)
- **Consequences**: Enables clean architecture, Requires platform decision, Requires progression system design
- **Memory Doc Impact**: constitution.md

#### D-2: Project Type
- **Phase**: 0: Discovery
- **Status**: Tentative
- **Confidence**: Medium
- **Context**: Choosing the right platform for the game
- **Decision**: Options open - Web app, macOS native, or iOS app
- **Alternatives**: Web app (widest reach), macOS (new learning), iOS (mobile gaming)
- **Consequences**: Requires technology stack decision, Constrains UI patterns
- **Memory Doc Impact**: tech-stack.md

#### D-3: Target Audience
- **Phase**: 0: Discovery
- **Status**: Decided
- **Confidence**: High
- **Context**: Who is this for?
- **Decision**: Personal passion project - polish for personal satisfaction, potential public release
- **Alternatives**: N/A
- **Consequences**: Enables freedom in design, No external stakeholder constraints
- **Memory Doc Impact**: constitution.md

#### D-4: Team Composition
- **Phase**: 0: Discovery
- **Status**: Decided
- **Confidence**: High
- **Context**: Understanding development constraints
- **Decision**: Solo developer
- **Alternatives**: N/A
- **Consequences**: Requires manageable scope, Enables fast decisions, Requires good tooling
- **Memory Doc Impact**: constitution.md

#### D-5: Iteration Style
- **Phase**: 0: Discovery
- **Status**: Decided
- **Confidence**: High
- **Context**: How to balance speed vs stability
- **Decision**: Move fast - prioritize iteration and feature velocity
- **Alternatives**: Careful/stable approach (rejected for this stage)
- **Consequences**: Enables rapid prototyping, Requires good testing habits later
- **Memory Doc Impact**: constitution.md

#### D-6: Platform
- **Phase**: 0: Discovery
- **Status**: Decided
- **Confidence**: High
- **Context**: Choosing the right platform for fast iteration
- **Decision**: Web App - widest reach, fastest iteration, can add PWA for offline
- **Alternatives**: macOS native (rejected - learning curve), iOS (rejected - mobile constraints)
- **Consequences**: Enables instant deployment, Enables easy sharing, Can add Tauri wrapper later for desktop
- **Memory Doc Impact**: tech-stack.md

#### D-7: Framework
- **Phase**: 0: Discovery
- **Status**: Decided
- **Confidence**: High
- **Context**: Framework for rapid game development
- **Decision**: React + Vite - familiar stack, instant dev server, huge ecosystem
- **Alternatives**: SvelteKit (smaller ecosystem), Next.js (overkill), Vanilla (too much boilerplate)
- **Consequences**: Enables fast prototyping, Large library ecosystem, TypeScript support
- **Memory Doc Impact**: tech-stack.md

#### D-8: Visual Style
- **Phase**: 0: Discovery
- **Status**: Decided
- **Confidence**: High
- **Context**: Aesthetic direction for the retro feel
- **Decision**: Pixel Art - classic retro, 8-bit/16-bit feel, hand-crafted sprites
- **Alternatives**: Hand-drawn (more complex), Vector/Flat (less retro), ASCII (too minimal)
- **Consequences**: Requires sprite assets, Enables classic roguelike aesthetic, Works well with D&D theme
- **Memory Doc Impact**: design-system.md

#### D-9: Core Hook
- **Phase**: 1: Problem & Vision
- **Status**: Decided
- **Confidence**: High
- **Context**: What keeps players coming back for "one more run"
- **Decision**: Dual hook - Power fantasy (becoming OP with stacking abilities) + Mastery curve (pattern recognition improves)
- **Alternatives**: Risk/reward only, Collection/completion only
- **Consequences**: Enables satisfying progression, Requires ability stacking system, Requires difficulty scaling
- **Memory Doc Impact**: constitution.md

#### D-10: Run Length
- **Phase**: 1: Problem & Vision
- **Status**: Decided
- **Confidence**: High
- **Context**: How long each playthrough lasts
- **Decision**: Core runs 15-30 minutes with endless mode for seeing how far you can push (like Balatro). Must scale infinitely.
- **Alternatives**: Fixed short runs, Fixed long runs
- **Consequences**: Requires difficulty scaling, Requires endless mode, Enables both casual and hardcore play
- **Memory Doc Impact**: constitution.md

#### D-11: Core Mechanic
- **Phase**: 1: Problem & Vision
- **Status**: Decided
- **Confidence**: High
- **Context**: How Minesweeper mechanics translate to D&D theme
- **Decision**: Hybrid dungeon exploration. Mines = monsters & traps. Safe tiles = loot. Goal is to fully explore dungeon avoiding monsters, then advance to harder dungeon.
- **Alternatives**: Pure combat, Pure resource gathering, Pure exploration
- **Consequences**: Enables varied tile types, Requires loot system, Requires dungeon progression, Clear win condition per level
- **Memory Doc Impact**: constitution.md

#### D-12: Meta Progression
- **Phase**: 1: Problem & Vision
- **Status**: Decided
- **Confidence**: High
- **Context**: What persists between runs (the meta-game)
- **Decision**: Both unlocks AND stats - breadth (new abilities/classes) + depth (permanent stat upgrades)
- **Alternatives**: Unlocks only, Stats only, Cosmetic only
- **Consequences**: Requires currency system, Requires unlock tree, Requires stat upgrade shop, More complex but more engaging
- **Memory Doc Impact**: constitution.md

#### D-13: Power-up System
- **Phase**: 3: Functional
- **Status**: Decided
- **Confidence**: High
- **Context**: How players gain abilities during a run
- **Decision**: Three-tier system: (1) Random drops from tiles = floor-only buffs, (2) Shop between floors = run-lasting power-ups, (3) End-of-run permanent upgrades with leftover gold
- **Alternatives**: Single power-up system, Only shop-based
- **Consequences**: Requires loot table for drops, Requires shop UI, Requires permanent upgrade store, Clear progression loop
- **Memory Doc Impact**: constitution.md

#### D-14: Death Mechanic
- **Phase**: 3: Functional
- **Status**: Decided
- **Confidence**: High
- **Context**: What happens when player encounters a monster
- **Decision**: HP system with shield layer. HP takes multiple hits to deplete. Shields absorb damage first. Abilities can grant shields.
- **Alternatives**: Instant death, Lives system
- **Consequences**: Requires HP display, Requires shield display, Enables defensive builds, More forgiving gameplay
- **Memory Doc Impact**: constitution.md

#### D-15: Class System
- **Phase**: 3: Functional
- **Status**: Decided
- **Confidence**: High
- **Context**: How character variety works
- **Decision**: Start with basic human (no abilities). Architecture supports unlockable classes with unique abilities (like Vampire Survivors). Design classes later.
- **Alternatives**: Single character, Class + subclass combos
- **Consequences**: Requires class unlock system, Requires extensible ability framework, MVP is simple
- **Memory Doc Impact**: constitution.md

#### D-16: Economy
- **Phase**: 3: Functional
- **Status**: Decided
- **Confidence**: High
- **Context**: What resources exist in the game
- **Decision**: Single currency (Gold). Used for run shops, permanent upgrades, and unlocks. Simple and clear.
- **Alternatives**: Dual currency, Multiple resources
- **Consequences**: Simpler implementation, Easier balancing, May add secondary currency later if needed
- **Memory Doc Impact**: constitution.md

#### D-17: Persistence
- **Phase**: 5: Architecture
- **Status**: Decided
- **Confidence**: High
- **Context**: How to save game state and progression
- **Decision**: LocalStorage only. Simple, no server needed, works offline. Browser-specific saves are fine for MVP.
- **Alternatives**: IndexedDB (overkill), Cloud sync (future consideration)
- **Consequences**: Simple implementation, No backend needed, Can add cloud sync later
- **Memory Doc Impact**: tech-stack.md

#### D-18: Rendering
- **Phase**: 5: Architecture
- **Status**: Decided
- **Confidence**: High
- **Context**: How to render the game visually
- **Decision**: React DOM + CSS. Tiles as React components, CSS for animations. Simple, fast to build, works perfectly for grid games.
- **Alternatives**: Canvas 2D (more work), WebGL (overkill), Hybrid (complex)
- **Consequences**: Fast development, Simple architecture, Can add Canvas overlay for effects later
- **Memory Doc Impact**: tech-stack.md

#### D-19: State Management
- **Phase**: 5: Architecture
- **Status**: Decided
- **Confidence**: High
- **Context**: How to manage game state in React
- **Decision**: Zustand. Minimal, fast, no boilerplate, built-in persist middleware. Perfect for games.
- **Alternatives**: Context/useReducer (more boilerplate), Jotai (atomic), Redux (overkill)
- **Consequences**: Simple store setup, Easy LocalStorage persistence, Good TypeScript support
- **Memory Doc Impact**: tech-stack.md

#### D-20: Deployment
- **Phase**: 5: Architecture
- **Status**: Decided
- **Confidence**: High
- **Context**: Where to host the game
- **Decision**: Vercel. Zero-config for Vite/React, generous free tier, instant deploys from git.
- **Alternatives**: Netlify (similar), GitHub Pages (more manual), Self-hosted (unnecessary)
- **Consequences**: Fast deployment workflow, Free hosting, Easy preview deploys
- **Memory Doc Impact**: tech-stack.md

#### D-21: Audio Strategy
- **Phase**: 7: UX
- **Status**: Decided
- **Confidence**: High
- **Context**: Sound design for retro aesthetic
- **Decision**: Chiptune music + 8-bit SFX. Classic retro feel with beeps, bloops, and catchy loops.
- **Alternatives**: Ambient (too modern), No music (less polish), Defer (valid but less fun)
- **Consequences**: Requires audio assets, Enables full retro experience, Need volume controls
- **Memory Doc Impact**: design-system.md

#### D-22: Input Methods
- **Phase**: 7: UX
- **Status**: Decided
- **Confidence**: High
- **Context**: How players interact with the game
- **Decision**: Mouse only for MVP. Left click reveal, right click flag. Touch/PWA support planned for future phase.
- **Alternatives**: All inputs (more work), Touch first (limits desktop experience)
- **Consequences**: Simple implementation, Classic Minesweeper feel, PWA deferred
- **Memory Doc Impact**: ux-patterns.md

#### D-23: Onboarding
- **Phase**: 7: UX
- **Status**: Decided
- **Confidence**: High
- **Context**: How new players learn the game
- **Decision**: Learn by playing. No explicit tutorial. First floor is easy, teaches naturally. Tooltips on hover for abilities.
- **Alternatives**: Tutorial overlay, Training dungeon (more work)
- **Consequences**: Assumes Minesweeper knowledge, Faster to play, Can add tutorial later
- **Memory Doc Impact**: ux-patterns.md

#### D-24: MVP Scope
- **Phase**: 7: UX
- **Status**: Decided
- **Confidence**: High
- **Context**: What to build first
- **Decision**: Full vision, phase 1. Design everything, implement core only. Architecture ready for expansion.
- **Alternatives**: Core loop only, Core + power-ups, Core + shop + meta
- **Consequences**: Clean architecture from start, MVP is playable core, Can iterate quickly
- **Memory Doc Impact**: constitution.md

---

## Dreaming Session Decisions

*The following decisions were made during a "dream big" brainstorming session to elevate the game from good to best-in-class.*

#### D-25: Information as Power
- **Phase**: Dream
- **Status**: Decided
- **Confidence**: High
- **Context**: What makes the power fantasy unique to Minesweeper?
- **Decision**: Core fantasy is "cheating" at information. Runes predict, reveal, and illuminate. Information IS the weapon.
- **Alternatives**: Combat focus, Traditional RPG stats
- **Consequences**: Runes affect information gathering, Not just +damage. Unique identity for the game.
- **Memory Doc Impact**: constitution.md, game-design.md

#### D-26: Living Dungeon Narrative
- **Phase**: Dream
- **Status**: Decided
- **Confidence**: High
- **Context**: What narrative hook makes dying feel good (like Hades)?
- **Decision**: The dungeon is alive. It reshapes itself. You're mapping an ever-changing labyrinth. Death means the dungeon "wins" this round.
- **Alternatives**: Groundhog Day loop, Treasure hunter guild, Minimal story
- **Consequences**: Dungeon becomes a character, Creates rivalry, Enables AI DM concept
- **Memory Doc Impact**: constitution.md

#### D-27: AI Dungeon Master
- **Phase**: Dream
- **Status**: Decided
- **Confidence**: High
- **Context**: How do we make the dungeon feel truly alive without scripting everything?
- **Decision**: Use AI (Gemini/Claude/GPT) to generate dynamic dungeon personality. Send player history + run stats, get back mood/taunts/narration/difficulty suggestions.
- **Alternatives**: Pre-scripted lines only, No personality, Random selection
- **Consequences**: Unique differentiator, Requires AI integration (Phase 3), Must handle rate limiting and failures gracefully
- **Memory Doc Impact**: constitution.md, tech-stack.md

#### D-28: DM Personality
- **Phase**: Dream
- **Status**: Decided
- **Confidence**: High
- **Context**: What personality archetype for the AI Dungeon Master?
- **Decision**: Sarcastic trickster. Playful, mocking, enjoys failures but respects good plays. GLaDOS meets a D&D DM.
- **Alternatives**: Ancient evil, Chaotic neutral, Player-selectable
- **Consequences**: Defines tone of all AI-generated content, Must be consistent across sessions
- **Memory Doc Impact**: game-design.md

#### D-29: Rune Synergy System
- **Phase**: Dream
- **Status**: Decided
- **Confidence**: High
- **Context**: What's our "Joker" equivalent (like Balatro)?
- **Decision**: Runes with passive effects that stack and combine unexpectedly. Discovery of synergies is half the fun.
- **Alternatives**: Monster parts, Spellbook system, Equipment slots
- **Consequences**: Requires careful rune design, Emergent gameplay, Community will find combos
- **Memory Doc Impact**: game-design.md

#### D-30: Synergy Discovery
- **Phase**: Dream
- **Status**: Decided
- **Confidence**: High
- **Context**: How do players discover rune combos?
- **Decision**: Emergent discovery (no hints by default) + occasional DM hints. "I've seen those two together before..."
- **Alternatives**: In-game codex, Visual cues, Full documentation
- **Consequences**: Community builds tier lists, DM hints add personality, Keeps discovery exciting
- **Memory Doc Impact**: game-design.md

#### D-31: Moving Monsters
- **Phase**: Dream
- **Status**: Decided
- **Confidence**: High
- **Context**: How can we evolve beyond static Minesweeper?
- **Decision**: Turn-based movement. Not all monsters move. Boss floors (every 3rd) introduce moving monsters. Some move multiple tiles. Creates tactics layer.
- **Alternatives**: Real-time movement, All monsters move, No movement
- **Consequences**: Phase 4 feature, Significant complexity, Changes from puzzle to tactics as you progress
- **Memory Doc Impact**: game-design.md

#### D-32: Monster Stats
- **Phase**: Dream
- **Status**: Decided
- **Confidence**: High
- **Context**: If monsters have D&D-style stats, what matters?
- **Decision**: HP + Damage for all monsters. Special abilities for some (dragon breathes fire, spider webs). D&D-inspired but simplified.
- **Alternatives**: Full stat blocks (STR/DEX/etc), Simple HP only
- **Consequences**: Requires monster ability system, Adds variety without overwhelming complexity
- **Memory Doc Impact**: game-design.md

#### D-33: Passive-Only Abilities
- **Phase**: Dream
- **Status**: Decided
- **Confidence**: High
- **Context**: Should players have active abilities (buttons to press)?
- **Decision**: Keep it passive. All player power comes from runes that modify reveal/flag behavior. No ability buttons.
- **Alternatives**: Limited-use abilities, Cooldown abilities, Unlock actives later
- **Consequences**: Keeps core gameplay pure (clicking tiles), Strategy is in rune selection, Simpler UI
- **Memory Doc Impact**: constitution.md

#### D-34: Resource Tension
- **Phase**: Dream
- **Status**: Decided
- **Confidence**: High
- **Context**: What's the core tension that makes each click exciting?
- **Decision**: Resource management. HP, gold, shields are finite. Every decision costs something. Can't brute force - must be smart.
- **Alternatives**: Risk/reward focus, Time pressure, All three balanced
- **Consequences**: Scarcity drives strategy, Must balance resource gains/costs carefully
- **Memory Doc Impact**: constitution.md

#### D-35: Endless Mastery Endgame
- **Phase**: Dream
- **Status**: Decided
- **Confidence**: High
- **Context**: What keeps players coming back after 50+ hours?
- **Decision**: No "ending." Endless mastery. Push as deep as possible. The dungeon always wins eventually - how long can you survive?
- **Alternatives**: Defeat the dungeon (final boss), Unlock everything, Story branches
- **Consequences**: Leaderboards matter, Infinite scaling required, "One more run" loop
- **Memory Doc Impact**: constitution.md

#### D-36: Seed Sharing
- **Phase**: Dream
- **Status**: Decided
- **Confidence**: High
- **Context**: Should players be able to share/compete?
- **Decision**: Seed sharing. Compete on identical dungeon layouts. Daily/weekly challenges. "Try this run!"
- **Alternatives**: Build sharing, Replays, Pure solo
- **Consequences**: Requires deterministic RNG, Community feature for Phase 5
- **Memory Doc Impact**: tech-stack.md

#### D-37: Elevator Pitch
- **Phase**: Dream
- **Status**: Decided
- **Confidence**: High
- **Context**: How do we describe the game in one sentence?
- **Decision**: "Minesweeper meets Hades" - A roguelike where you outsmart a living, AI-driven dungeon.
- **Alternatives**: "Outsmart a living dungeon", "Information is your weapon", "D&D puzzle roguelike"
- **Consequences**: Marketing hook, Sets expectations, Guides all design decisions
- **Memory Doc Impact**: constitution.md

#### D-38: Phased Development
- **Phase**: Dream
- **Status**: Decided
- **Confidence**: High
- **Context**: How do we approach building this bigger vision?
- **Decision**: Phase carefully. MVP is core Minesweeper loop. Phase 2 adds runes. Phase 3 adds AI DM. Phase 4 adds moving monsters. Validate each layer.
- **Alternatives**: Prototype unique parts first, Full architecture now, Split the difference
- **Consequences**: Clear milestones, Playable at each phase, Can course-correct
- **Memory Doc Impact**: constitution.md
