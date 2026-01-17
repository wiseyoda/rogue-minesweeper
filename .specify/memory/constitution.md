<!--
SYNC IMPACT REPORT
==================
Version Change: 2.0.0 → 2.1.0 (MINOR - governance section expanded)
Modified Principles: None (all 7 principles retained)
Added Sections:
  - Product Vision (formalized)
  - Technology Stack reference
  - Development Workflow
  - Governance (expanded with authority, compliance, versioning)
  - Decision Traceability
Removed Sections: None
Templates Requiring Updates: None (no conflicts detected)
Follow-up TODOs: None
-->

# Dungeon Delver Constitution

> **Agents**: Reference this document for architectural principles and non-negotiable project requirements.
> This is the authoritative source for project governance and development philosophy.

**Version**: 2.1.0 | **Ratified**: 2026-01-14 | **Last Amended**: 2026-01-14

---

## Product Vision

**"Minesweeper meets Hades"** - A roguelike where you outsmart a living, AI-driven dungeon that adapts to your playstyle, taunts your failures, and grudgingly respects your victories.

Dungeon Delver transforms classic Minesweeper into a roguelike dungeon crawler where **information is your weapon**. An AI Dungeon Master with a sarcastic trickster personality reacts to your every move, creating a living antagonist that learns, adapts, and communicates.

**Target Audience**: Gaming enthusiasts who enjoy roguelikes, puzzle games, and retro aesthetics. Personal passion project with potential public release.

**Primary Experience**: The satisfaction of mastering information-based deduction while building overpowered rune combinations, all while bantering with a sentient dungeon that remembers your failures.

---

## Core Principles

### I. Information Is Power

The core fantasy is "cheating" at information. Abilities predict, reveal, and illuminate.

- Runes MUST affect information gathering (show safe paths, reveal monster types, predict danger)
- Power-ups MUST feel native to Minesweeper's deduction mechanics
- Information advantages MUST create meaningful strategic choices

**Rationale**: Minesweeper is fundamentally about deduction. Power-ups that enhance deduction feel native and differentiate us from generic roguelikes.

**Source**: Decision D-25 (Information as Power)

### II. The Dungeon Is Alive

The dungeon isn't just a system - it's a character with opinions about your playstyle.

- The AI Dungeon Master MUST have consistent personality (sarcastic trickster)
- The dungeon MUST remember player history across runs
- Dialogue MUST react to player actions and performance

**Rationale**: Creates emotional investment and replayability. Every run feels personal when you have a relationship with your antagonist.

**Source**: Decisions D-26 (Living Dungeon), D-27 (AI DM), D-28 (DM Personality)

### III. Emergent Complexity

Start simple, layer mechanics as the player goes deeper.

- Floors 1-3 MUST use static monsters only (classic Minesweeper)
- Moving monsters MUST be introduced gradually (Phase 4)
- Boss encounters MUST teach new mechanics before testing them

**Rationale**: Teach the base game, then subvert expectations. Keeps discovery alive for dozens of hours.

**Source**: Decision D-31 (Moving Monsters)

### IV. Resource Tension

Every click matters because resources are finite.

- HP, gold, and shields MUST be scarce enough to create meaningful decisions
- Players MUST NOT be able to brute-force through floors
- Gold MUST serve multiple competing purposes (shop, upgrades, potentially rune costs)

**Rationale**: Tension comes from scarcity. When everything has a cost, decisions have weight.

**Source**: Decision D-34 (Resource Tension)

### V. Passive Mastery

Player power comes from passive runes, not active abilities.

- There MUST NOT be ability buttons or cooldown skills
- All player power MUST modify reveal/flag behavior passively
- Strategy MUST come from rune selection and synergy discovery

**Rationale**: Keeps core gameplay (clicking tiles) pure and simple. Complexity lives in the build, not the moment-to-moment controls.

**Source**: Decision D-33 (Passive-Only Abilities)

### VI. Juice Is Holistic

Audio + visual feedback + pacing all matter equally.

- Every click MUST feel satisfying (sound + animation)
- Screen shake, particles, and timing MUST be polished
- No shortcuts on feel - this is what makes "best in class"

**Rationale**: Polish is the differentiator between good and great. The game must feel amazing to play, not just work correctly.

**Source**: Decision D-21 (Audio Strategy)

### VII. Move Fast, Iterate Often

Prioritize shipping playable builds over perfection.

- Each development phase MUST produce a playable build
- Features MUST be validated through play before moving on
- Complexity MUST be deferred until core loop is proven fun

**Rationale**: Solo developer building a passion project. Learning what's fun requires playing, not planning.

**Source**: Decisions D-5 (Iteration Style), D-38 (Phased Development)

---

## Technology Stack

**Core Technologies**: React 18 + TypeScript + Vite + Zustand + Tailwind CSS

**AI Integration**: Vercel AI SDK with Gemini/Claude/GPT providers (Phase 3)

**Deployment**: Vercel with auto-deploy from git

**Deviation Process**: Any deviation from approved technologies MUST be documented in the feature's `plan.md` with clear justification and principle alignment check.

> See [`tech-stack.md`](./tech-stack.md) for complete list of approved technologies and architecture decisions.

---

## Development Phases

| Phase | Focus | Exit Criteria |
|-------|-------|---------------|
| **1** | Core Loop | Playable Minesweeper with HP, shops, meta-progression |
| **2** | Runes | Synergy system with 10+ runes, information-based abilities |
| **3** | AI DM | Dynamic dungeon personality with 5+ mood states |
| **4** | Movement | Turn-based monster tactics, 3+ boss encounters |
| **5** | Polish | Full audio, seed sharing, daily challenges |

Each phase MUST be playable and testable before proceeding to the next.

---

## Game Systems Summary

### Core Loop
1. Start run → Enter dungeon floor
2. Reveal tiles (Minesweeper style) → Avoid/fight monsters, collect loot
3. Clear floor → Visit shop → Advance to harder floor
4. Every 3rd floor: Boss encounter
5. Die → Spend gold on permanent upgrades → Start new run

### Progression Tiers
| Tier | Scope | Source |
|------|-------|--------|
| Floor | This floor only | Random tile drops |
| Run | Until death | Shop purchases |
| Permanent | Forever | End-of-run shop |

### Endgame
- No "ending" - endless mastery
- Leaderboards and seed sharing
- The dungeon always wins eventually

---

## Development Workflow

### Code Review Requirements

- All changes to `main` branch require pull request review
- PRs MUST include description of changes and testing performed
- Reviewer verifies constitution compliance before approval
- Squash merge for clean history

### Quality Gates

Before merge, all PRs MUST pass:

1. TypeScript compilation with strict mode (no errors)
2. ESLint with no errors
3. Prettier formatting check
4. All automated tests passing
5. Manual playtest for gameplay changes

### Commit Standards

- Conventional Commits format: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`
- Commit messages describe "why" not just "what"
- Each commit represents a logical unit of change

---

## Governance

### Authority

This Constitution supersedes all other development practices and guidelines.
When conflicts arise, Constitution principles take precedence.

### Amendment Process

1. Propose amendment with clear rationale
2. Test impact through play if game-related
3. Document in PR description
4. Update version number following semantic versioning:
   - **MAJOR**: Principle removed or fundamentally redefined
   - **MINOR**: New principle added or existing principle expanded
   - **PATCH**: Clarifications, typo fixes, non-semantic refinements
5. Update all dependent artifacts as part of amendment

### Compliance Review

- Every PR review includes Constitution compliance check
- Playtest each phase before moving to next
- Principle violations MUST be documented with justification

### Runtime Guidance

For day-to-day development guidance, code style details, and project-specific conventions,
refer to:
- [`tech-stack.md`](./tech-stack.md) - Technology decisions and architecture
- [`game-design.md`](./game-design.md) - Detailed game mechanics
- [`design-system.md`](./design-system.md) - Visual and audio guidelines
- [`ux-patterns.md`](./ux-patterns.md) - Interaction patterns

---

## Decision Traceability

This constitution is derived from 38 decisions captured during project initialization.

### Key Decision Sources

| Principle | Source Decisions |
|-----------|------------------|
| I. Information Is Power | D-25 |
| II. The Dungeon Is Alive | D-26, D-27, D-28 |
| III. Emergent Complexity | D-31 |
| IV. Resource Tension | D-34 |
| V. Passive Mastery | D-33 |
| VI. Juice Is Holistic | D-21 |
| VII. Move Fast, Iterate Often | D-5, D-38 |

Full decision log available at `.specify/discovery/decisions.md`.
