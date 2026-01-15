# Discovery: 0010 - Project Setup

**Phase**: 0010-project-setup
**Created**: 2026-01-14
**Status**: Complete

---

## Codebase Examination

### Current State

The project currently contains a **working vanilla JavaScript POC** of the Dungeon Delver game:

| Directory   | Contents                                                | Status                        |
| ----------- | ------------------------------------------------------- | ----------------------------- |
| `src/`      | 6 JS files (game.js, ui.js, main.js, state.js, shop.js) | POC - to be replaced          |
| `src/data/` | permanentUpgrades.js, temporaryItems.js                 | Game data - preserve concepts |
| `public/`   | index.html with Tailwind CDN                            | POC - to be replaced          |
| `styles/`   | style.css                                               | POC - to be replaced          |

### No Package Manager Configured

- No `package.json` exists
- No node_modules
- Currently uses CDN for Tailwind (`<script src="https://cdn.tailwindcss.com">`)
- ES modules loaded directly via browser

### Existing Game Features (POC)

The POC implements:

- Minesweeper-style grid with monsters instead of mines
- Lives system (hearts + shields)
- Gold economy from safe tiles and level completion
- Permanent upgrade shop (between runs)
- Temporary item shop (between levels)
- High score tracking
- D&D dungeon theme with Cinzel/Merriweather fonts

### Files to Archive/Delete

Per phase instructions, existing POC files should be archived or deleted:

- `src/*.js` - All vanilla JS files
- `public/index.html` - Current HTML shell
- `styles/style.css` - Current styles

### Integration Points

None for this phase - this is a fresh scaffolding phase.

---

## Requirements Analysis

### From Phase Definition

**Deliverables**:

1. `package.json` - Project dependencies and scripts
2. `vite.config.ts` - Vite configuration
3. `tsconfig.json` - TypeScript strict config
4. `tailwind.config.ts` - Tailwind setup
5. `.eslintrc.cjs` - ESLint rules
6. `.prettierrc` - Prettier config
7. `vitest.config.ts` - Vitest setup
8. `src/App.tsx` - Placeholder app component
9. `src/main.tsx` - Entry point
10. `vercel.json` - Deployment config

### From tech-stack.md

| Technology      | Version  | Required                       |
| --------------- | -------- | ------------------------------ |
| TypeScript      | ^5.x     | Yes                            |
| React           | ^18.x    | Yes                            |
| Vite            | ^5.x     | Yes                            |
| Zustand         | ^4.x     | Yes (for Phase 1, install now) |
| pnpm            | ^8.x     | Yes                            |
| Tailwind CSS    | (latest) | Yes                            |
| Vitest          | (latest) | Yes                            |
| Testing Library | (latest) | Yes                            |
| ESLint          | (latest) | Yes                            |
| Prettier        | (latest) | Yes                            |

### From constitution.md

- **Principle VII**: Move Fast, Iterate Often - Keep setup minimal, don't over-engineer
- **Development Workflow**: Conventional Commits, TypeScript strict mode, ESLint/Prettier required
- **Quality Gates**: TypeScript compilation, ESLint no errors, Prettier formatting, tests passing

---

## Constraints & Decisions

### Package Manager

**Decision**: Use pnpm (explicitly required in phase definition and tech-stack.md)

### TypeScript Config

**Decision**: Strict mode from day 1 (per tech-stack.md and phase definition)

### Tailwind Version

**Decision**: Use Tailwind CSS v3.x with proper build tooling (not CDN)

### Directory Structure

**Decision**: Follow planned structure from tech-stack.md:

```
src/
├── components/
├── stores/
├── engine/
├── hooks/
├── utils/
├── types/
├── data/
├── assets/
└── styles/
```

### POC Files

**Decision**: Archive to `.archive/poc/` for reference rather than delete

---

## User Intent Clarification

Based on the phase definition and memory documents, the intent is clear:

1. Replace the vanilla JS POC with a proper React + TypeScript + Vite setup
2. Configure all development tooling for professional workflow
3. Create empty placeholder files/directories ready for Phase 2
4. Ensure deployability to Vercel from day 1

No clarifying questions needed - the scope is well-defined and standard for project scaffolding.

---

## Recommendations for Specification

1. **Create project from Vite template** rather than manual setup
2. **Add all Phase 1 dependencies upfront** (Zustand, etc.) to avoid setup again later
3. **Configure ESLint with strict React rules** per tech-stack.md
4. **Create empty directory structure** matching tech-stack.md planned structure
5. **Archive POC files** before scaffolding new structure
