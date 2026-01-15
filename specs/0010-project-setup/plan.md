# Implementation Plan: 0010 - Project Setup

**Phase**: 0010-project-setup
**Version**: 1.0.0
**Created**: 2026-01-14
**Status**: Draft

---

## Technical Context

### Current State

| Aspect          | Status                 |
| --------------- | ---------------------- |
| Package manager | None (no package.json) |
| Build tool      | None (raw ES modules)  |
| TypeScript      | Not configured         |
| Linting         | Not configured         |
| Testing         | Not configured         |
| Tailwind        | CDN only               |
| Deployment      | None configured        |

### Target State

| Aspect          | Target                        |
| --------------- | ----------------------------- |
| Package manager | pnpm 8.x                      |
| Build tool      | Vite 5.x                      |
| Framework       | React 18.x                    |
| Language        | TypeScript 5.x (strict)       |
| Styling         | Tailwind CSS 3.x (build-time) |
| Testing         | Vitest + Testing Library      |
| Linting         | ESLint 8.x + Prettier         |
| Deployment      | Vercel auto-deploy            |

---

## Constitution Compliance Check

| Principle                     | Impact                                | Status |
| ----------------------------- | ------------------------------------- | ------ |
| I. Information Is Power       | N/A - setup phase                     | PASS   |
| II. The Dungeon Is Alive      | N/A - setup phase                     | PASS   |
| III. Emergent Complexity      | N/A - setup phase                     | PASS   |
| IV. Resource Tension          | N/A - setup phase                     | PASS   |
| V. Passive Mastery            | N/A - setup phase                     | PASS   |
| VI. Juice Is Holistic         | N/A - setup phase                     | PASS   |
| VII. Move Fast, Iterate Often | Standard tooling, not over-engineered | PASS   |

### Development Workflow Compliance

| Requirement          | Implementation                  |
| -------------------- | ------------------------------- |
| Conventional Commits | Dev will use manually           |
| TypeScript strict    | tsconfig.json strict: true      |
| ESLint no errors     | .eslintrc.cjs configured        |
| Prettier formatting  | .prettierrc configured          |
| Quality Gates        | Build/lint/test scripts defined |

---

## Implementation Strategy

### Approach: Vite Template + Enhancement

Rather than building from scratch, we'll:

1. Create project using Vite's React-TS template
2. Enhance with additional tooling
3. Configure per our requirements

This is the fastest path with least risk of configuration errors.

### Implementation Phases

```
Phase A: Archive & Initialize
├── Archive existing POC files
└── Create new Vite project

Phase B: Core Configuration
├── Configure TypeScript (strict mode, paths)
├── Configure ESLint + Prettier
└── Configure Vitest

Phase C: Styling & Structure
├── Configure Tailwind CSS
├── Create directory structure
└── Set up path aliases

Phase D: Entry Files & Deployment
├── Create placeholder components
├── Configure Vercel
└── Verify all scripts work
```

---

## Technical Decisions

### TD-1: Use Vite React-TS Template

**Decision**: Start with `pnpm create vite@latest . --template react-ts`

**Rationale**:

- Pre-configured React + TypeScript
- Correct Vite plugin setup
- Known working configuration
- Faster than manual setup

**Alternatives Considered**:

- Manual setup: More control, higher risk of errors
- Create React App: Deprecated, not recommended
- Next.js: Over-engineered for this use case

### TD-2: ESLint Flat Config vs Legacy

**Decision**: Use legacy `.eslintrc.cjs` format

**Rationale**:

- Better plugin ecosystem support
- More documentation available
- Flat config still stabilizing
- Can migrate later if needed

### TD-3: Tailwind Config Format

**Decision**: Use `tailwind.config.ts` (TypeScript)

**Rationale**:

- Type safety for theme values
- Consistent with project TypeScript-first approach
- Better IDE support

### TD-4: Test File Location

**Decision**: Colocate tests with source files

**Rationale**:

- `src/components/App.test.tsx` next to `App.tsx`
- Easier to maintain
- Standard React Testing Library convention

---

## File Changes

### Files Created

| File                 | Purpose                 |
| -------------------- | ----------------------- |
| `package.json`       | Project config and deps |
| `pnpm-lock.yaml`     | Dependency lock         |
| `vite.config.ts`     | Build configuration     |
| `tsconfig.json`      | TypeScript config       |
| `tsconfig.node.json` | Node scripts config     |
| `tailwind.config.ts` | Tailwind theme          |
| `postcss.config.js`  | PostCSS pipeline        |
| `.eslintrc.cjs`      | Linting rules           |
| `.prettierrc`        | Formatting rules        |
| `.prettierignore`    | Formatting exclusions   |
| `vitest.config.ts`   | Test configuration      |
| `vitest.setup.ts`    | Test setup file         |
| `index.html`         | Entry HTML              |
| `src/main.tsx`       | React entry point       |
| `src/App.tsx`        | Root component          |
| `src/App.test.tsx`   | Root component test     |
| `src/index.css`      | Global styles           |
| `src/vite-env.d.ts`  | Vite type declarations  |
| `vercel.json`        | Deployment config       |
| `.nvmrc`             | Node version            |
| `.gitignore`         | Updated ignores         |

### Files Archived

| Original            | Archive Location         |
| ------------------- | ------------------------ |
| `src/*.js`          | `.archive/poc/src/`      |
| `src/data/*.js`     | `.archive/poc/src/data/` |
| `public/index.html` | `.archive/poc/public/`   |
| `styles/style.css`  | `.archive/poc/styles/`   |

### Files Deleted

| File       | Reason                      |
| ---------- | --------------------------- |
| `public/`  | Replaced by root index.html |
| `styles/`  | Replaced by src/styles/     |
| `src/*.js` | After archiving             |

### Directories Created

| Directory         | Purpose                  |
| ----------------- | ------------------------ |
| `.archive/poc/`   | Archived POC files       |
| `src/components/` | React components         |
| `src/stores/`     | Zustand stores (Phase 2) |
| `src/engine/`     | Game logic (Phase 2)     |
| `src/hooks/`      | Custom hooks             |
| `src/utils/`      | Utility functions        |
| `src/types/`      | TypeScript types         |
| `src/data/`       | Static data              |
| `src/assets/`     | Static assets            |
| `src/styles/`     | Style files              |

---

## Dependencies

### Production

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
```

### Development

```json
{
  "typescript": "^5.6.0",
  "vite": "^5.4.0",
  "@vitejs/plugin-react": "^4.3.0",
  "tailwindcss": "^3.4.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0",
  "eslint": "^8.57.0",
  "@typescript-eslint/eslint-plugin": "^8.0.0",
  "@typescript-eslint/parser": "^8.0.0",
  "eslint-plugin-react": "^7.35.0",
  "eslint-plugin-react-hooks": "^4.6.0",
  "eslint-config-prettier": "^9.1.0",
  "prettier": "^3.3.0",
  "vitest": "^2.1.0",
  "@testing-library/react": "^16.0.0",
  "@testing-library/jest-dom": "^6.5.0",
  "jsdom": "^25.0.0",
  "@types/react": "^18.3.0",
  "@types/react-dom": "^18.3.0"
}
```

---

## Configuration Details

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Tailwind Theme Extension

```typescript
theme: {
  extend: {
    colors: {
      dungeon: {
        stone: '#78716c',   // stone-500
        amber: '#f59e0b',   // amber-500
        blood: '#b91c1c',   // red-700
        gold: '#eab308',    // yellow-500
        shadow: '#1c1917',  // stone-900
      }
    },
    fontFamily: {
      cinzel: ['Cinzel', 'serif'],
      merriweather: ['Merriweather', 'serif'],
    }
  }
}
```

---

## Architecture

### Project Structure

```
dungeon-delver/
├── .archive/                # Archived POC files
│   └── poc/
│       ├── src/
│       ├── public/
│       └── styles/
├── .specify/                # SpecKit artifacts
├── specs/                   # Phase specifications
├── src/
│   ├── components/          # React components
│   │   ├── game/            # Game UI (Phase 2+)
│   │   ├── shop/            # Shop UI (Phase 2+)
│   │   └── ui/              # Generic UI
│   ├── stores/              # Zustand stores (Phase 2+)
│   ├── engine/              # Game logic (Phase 2+)
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript types
│   ├── data/                # Static game data
│   ├── assets/              # Static assets
│   ├── styles/              # CSS files
│   ├── App.tsx              # Root component
│   ├── App.test.tsx         # Root component test
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── index.html               # Entry HTML
├── package.json             # Dependencies
├── vite.config.ts           # Build config
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # Tailwind config
├── vitest.config.ts         # Test config
├── .eslintrc.cjs            # Lint config
├── .prettierrc              # Format config
└── vercel.json              # Deploy config
```

### Module Boundaries

| Layer      | Responsibility   | Dependencies         |
| ---------- | ---------------- | -------------------- |
| Components | UI rendering     | Stores, Hooks, Types |
| Stores     | State management | Engine, Types        |
| Engine     | Game logic       | Types only           |
| Hooks      | Reusable logic   | Stores, Utils        |
| Utils      | Pure functions   | None (standalone)    |
| Types      | Type definitions | None (standalone)    |
| Data       | Static content   | None (standalone)    |

### Build Pipeline

```
Source Files → TypeScript → Vite → Production Bundle
     │                        │
     └── Tailwind ────────────┘
```

---

## Risk Assessment

| Risk                    | Mitigation                                     |
| ----------------------- | ---------------------------------------------- |
| Vite template changes   | Pin Vite version, review generated files       |
| ESLint plugin conflicts | Use tested combination, eslint-config-prettier |
| Path alias issues       | Test aliases in build AND dev mode             |
| Tailwind JIT issues     | Use standard content paths                     |

---

## Verification Plan

### Manual Verification

1. Run `pnpm install` - should complete without errors
2. Run `pnpm dev` - should open browser with placeholder
3. Run `pnpm build` - should create dist/ folder
4. Run `pnpm lint` - should pass with no errors
5. Run `pnpm test:run` - should pass App test
6. Deploy to Vercel - should show placeholder page

### Automated Verification

All verification scripts added to package.json:

- `pnpm typecheck` - TypeScript compilation check
- `pnpm lint` - ESLint
- `pnpm test:run` - Vitest single run
- `pnpm test:coverage` - Coverage report

---

## References

- Vite React-TS Template: https://vitejs.dev/guide/
- Tailwind CSS v3: https://tailwindcss.com/docs
- Vitest: https://vitest.dev/
- ESLint: https://eslint.org/
- Testing Library: https://testing-library.com/react
