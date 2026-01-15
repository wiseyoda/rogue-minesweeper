# Tech Stack - Dungeon Delver

> Approved technologies and versions for the Dungeon Delver project.

**Last Updated**: 2026-01-14
**Version**: 2.0.0
**Project Type**: Game (Web App)

---

## Core Technologies

| Technology | Version | Purpose                 | Phase |
| ---------- | ------- | ----------------------- | ----- |
| TypeScript | ^5.x    | Primary language        | 1     |
| React      | ^18.x   | UI framework            | 1     |
| Vite       | ^5.x    | Build tool / Dev server | 1     |
| Zustand    | ^4.x    | State management        | 1     |
| pnpm       | ^8.x    | Package manager         | 1     |

## Styling

| Technology    | Purpose           | Notes                          |
| ------------- | ----------------- | ------------------------------ |
| Tailwind CSS  | Utility styling   | Familiar from POC              |
| CSS Modules   | Component scoping | For custom animations          |
| Framer Motion | Animations        | Smooth, declarative (Phase 2+) |

## Testing

| Technology      | Purpose                 |
| --------------- | ----------------------- |
| Vitest          | Unit & component tests  |
| Testing Library | React component testing |
| Playwright      | E2E tests (future)      |

## Code Quality

| Tool       | Purpose       | Config                          |
| ---------- | ------------- | ------------------------------- |
| ESLint     | Linting       | Strict React rules              |
| Prettier   | Formatting    | 2-space indent, trailing commas |
| TypeScript | Type checking | Strict mode                     |

## AI Integration (Phase 3)

| Technology       | Purpose                 | Notes                       |
| ---------------- | ----------------------- | --------------------------- |
| Vercel AI SDK    | AI provider abstraction | Switch providers easily     |
| Google Gemini    | Primary DM provider     | Fast, cost-effective        |
| Anthropic Claude | Fallback/alternative    | Better personality modeling |
| OpenAI GPT       | Fallback/alternative    | Widest adoption             |

### AI Architecture

```
Player Action → Game State Update → AI Context Builder → AI Provider → Parse Response → Update UI
```

**AI Request Format** (sent to provider):

```typescript
interface DungeonMasterContext {
  // Player history
  totalRuns: number;
  bestFloor: number;
  favoriteRunes: string[];
  deathCauses: string[];

  // Current run
  currentFloor: number;
  currentHP: number;
  currentGold: number;
  equippedRunes: string[];
  recentActions: string[]; // last 10 actions

  // Current situation
  tilesRevealed: number;
  monstersRemaining: number;
  nearDeathMoments: number;

  // Request type
  requestType: 'taunt' | 'hint' | 'mood_update' | 'difficulty_suggestion';
}
```

**AI Response Format** (parsed from provider):

```typescript
interface DungeonMasterResponse {
  dialogue: string; // What the dungeon "says"
  mood: 'amused' | 'bored' | 'impressed' | 'vengeful' | 'curious';
  difficultyAdjustment?: number; // -1 to +1 suggestion
  hintType?: 'rune_synergy' | 'monster_warning' | 'safe_path';
  hintContent?: string;
}
```

**Prompt Engineering Notes**:

- System prompt defines sarcastic trickster personality
- Few-shot examples for consistent tone
- JSON mode for reliable parsing
- Temperature ~0.7 for creativity with consistency
- Version control prompts alongside code

## Audio (Phase 5)

| Technology    | Purpose        | Notes                     |
| ------------- | -------------- | ------------------------- |
| Howler.js     | Audio playback | Sprite sheets, pooling    |
| Web Audio API | Effects        | Positional audio, filters |

## Data & Persistence

| Technology   | Purpose               | Notes               |
| ------------ | --------------------- | ------------------- |
| LocalStorage | Game saves            | Via Zustand persist |
| IndexedDB    | Large data (future)   | Replay storage      |
| Vercel KV    | Leaderboards (future) | Redis-compatible    |

---

## Architecture Decisions

### Rendering: React DOM + CSS

Tiles rendered as React components. CSS handles animations. Simple, fast, works for grid games.

**Rationale**: Fastest to build, familiar patterns, can add Canvas overlay later for particle effects.

**Future**: Consider Canvas layer for particle effects, screen shake, juice.

### State: Zustand

Single store with slices for:

- `gameStore`: Current run state (grid, HP, gold, floor, runes)
- `metaStore`: Permanent progression (upgrades, unlocks, stats)
- `dungeonStore`: AI DM state (mood, history, difficulty)
- `uiStore`: Menus, settings, modals

**Rationale**: Minimal boilerplate, built-in LocalStorage persistence, no provider hell.

### Game Loop Architecture

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
│                  AI Layer (Phase 3)                  │
│  ContextBuilder │ ProviderAdapter │ ResponseParser  │
└─────────────────────────────────────────────────────┘
```

### Monster Movement (Phase 4)

Turn-based system:

1. Player reveals tile
2. Game processes reveal (damage, loot, etc.)
3. Turn counter increments
4. All moving monsters take their turn
5. Check for player collision
6. Update UI

### Persistence: LocalStorage

Game saves stored in browser LocalStorage via Zustand persist middleware.

**Rationale**: No server needed, works offline, simple for MVP. Can migrate to cloud later.

### Deployment: Vercel

Auto-deploy from git. Preview deploys for PRs.

**Rationale**: Zero-config for Vite, generous free tier, instant deploys, built-in AI SDK support.

---

## Project Structure (Planned)

```
src/
├── components/           # React components
│   ├── game/             # Game board, tiles, HUD
│   │   ├── Board.tsx
│   │   ├── Tile.tsx
│   │   ├── HUD.tsx
│   │   └── MonsterCard.tsx
│   ├── shop/             # Shop screens
│   │   ├── FloorShop.tsx
│   │   └── MetaShop.tsx
│   ├── dungeon-master/   # AI DM UI
│   │   ├── DialogueBox.tsx
│   │   └── MoodIndicator.tsx
│   └── ui/               # Generic UI components
├── stores/               # Zustand stores
│   ├── gameStore.ts      # Run state
│   ├── metaStore.ts      # Persistent state
│   ├── dungeonStore.ts   # AI DM state
│   └── uiStore.ts        # UI state
├── engine/               # Game logic (pure functions)
│   ├── grid.ts           # Minesweeper logic
│   ├── monsters.ts       # Monster behavior
│   ├── runes.ts          # Rune effects
│   ├── turns.ts          # Turn management
│   └── difficulty.ts     # Scaling logic
├── ai/                   # AI Dungeon Master
│   ├── context.ts        # Build context for AI
│   ├── prompts.ts        # System prompts
│   ├── providers.ts      # AI provider adapters
│   └── parser.ts         # Response parsing
├── hooks/                # Custom React hooks
├── utils/                # Pure utility functions
├── types/                # TypeScript types
│   ├── game.ts
│   ├── monsters.ts
│   ├── runes.ts
│   └── ai.ts
├── data/                 # Static game data
│   ├── monsters.json     # Monster definitions
│   ├── runes.json        # Rune definitions
│   └── upgrades.json     # Upgrade definitions
├── assets/               # Sprites, audio, fonts
└── styles/               # Global styles, Tailwind config
```

---

## Phase-Specific Dependencies

### Phase 1: Core Loop

- React, Vite, TypeScript, Zustand, Tailwind
- No additional deps needed

### Phase 2: Rune System

- Consider Immer for complex state updates
- Framer Motion for rune animations

### Phase 3: AI Dungeon Master

- Vercel AI SDK (`ai` package)
- Provider SDKs (Google AI, Anthropic, OpenAI)
- Zod for response validation

### Phase 4: Moving Monsters

- No new deps (pure logic)
- Consider adding pathfinding lib if needed

### Phase 5: Audio & Community

- Howler.js for audio
- Vercel KV for leaderboards
- Consider analytics (Plausible, PostHog)

---

## Adding New Technologies

Before adding a new dependency:

1. Check if it aligns with "move fast" principle
2. Verify bundle size impact
3. Document in this file with rationale
4. Prefer well-maintained libraries with TypeScript support
5. Consider: "Can we defer this to a later phase?"
