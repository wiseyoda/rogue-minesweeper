# Tasks: 0010 - Project Setup

**Phase**: 0010-project-setup
**Generated**: 2026-01-14
**Total Tasks**: 51

---

## Task Legend

- `T###` - Task ID
- `[P#]` - Priority (1=highest, 3=lowest)
- `[US-#]` - User Story reference
- `[D:T###]` - Dependency on another task

---

## Setup Phase

### Archive Existing POC

- [x] T001 [P1] [US-5] Create archive directory `.archive/poc/`
- [x] T002 [P1] [US-5] [D:T001] Move `src/*.js` to `.archive/poc/src/`
- [x] T003 [P1] [US-5] [D:T001] Move `src/data/*.js` to `.archive/poc/src/data/`
- [x] T004 [P1] [US-5] [D:T001] Move `public/index.html` to `.archive/poc/public/`
- [x] T005 [P1] [US-5] [D:T001] Move `styles/style.css` to `.archive/poc/styles/`
- [x] T006 [P1] [US-5] [D:T002,T003,T004,T005] Remove empty `src/`, `public/`, `styles/` directories

---

## Foundational Phase

### Initialize Vite Project

- [x] T007 [P1] [US-1] [D:T006] Run `pnpm create vite@latest . --template react-ts` in project root
- [x] T008 [P1] [US-1] [D:T007] Run `pnpm install` to install initial dependencies
- [x] T009 [P1] [US-1] [D:T008] Verify `pnpm dev` starts successfully

### Configure TypeScript Strict Mode

- [x] T010 [P1] [US-1] [D:T007] Update `tsconfig.json` with strict settings and path aliases
- [x] T011 [P1] [US-1] [D:T010] Create `tsconfig.node.json` for config files

### Configure ESLint

- [x] T012 [P1] [US-1] [D:T008] Install ESLint dependencies (`eslint`, `@typescript-eslint/*`, `eslint-plugin-react*`, `eslint-config-prettier`)
- [x] T013 [P1] [US-1] [D:T012] Create `.eslintrc.cjs` with React + TypeScript rules
- [x] T014 [P1] [US-1] [D:T013] Verify `pnpm lint` passes

### Configure Prettier

- [x] T015 [P1] [US-1] [D:T008] Install Prettier
- [x] T016 [P1] [US-1] [D:T015] Create `.prettierrc` with project settings
- [x] T017 [P1] [US-1] [D:T016] Create `.prettierignore` for build artifacts
- [x] T018 [P1] [US-1] [D:T017] Add `format` and `format:check` scripts to package.json

---

## User Story Implementation

### US-2: Testing Infrastructure

- [x] T019 [P1] [US-2] [D:T008] Install Vitest dependencies (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`)
- [x] T020 [P1] [US-2] [D:T019] Create `vitest.config.ts` with jsdom environment
- [x] T021 [P1] [US-2] [D:T020] Create `vitest.setup.ts` with jest-dom matchers
- [x] T022 [P1] [US-2] [D:T021] Create `src/App.test.tsx` with basic render test
- [x] T023 [P1] [US-2] [D:T022] Verify `pnpm test:run` passes

### US-3: Styling Setup

- [x] T024 [P1] [US-3] [D:T008] Install Tailwind dependencies (`tailwindcss`, `postcss`, `autoprefixer`)
- [x] T025 [P1] [US-3] [D:T024] Create `tailwind.config.ts` with fantasy theme
- [x] T026 [P1] [US-3] [D:T024] Create `postcss.config.js`
- [x] T027 [P1] [US-3] [D:T025,T026] Update `src/index.css` with Tailwind directives
- [x] T028 [P2] [US-3] [D:T027] Update `src/App.tsx` to use Tailwind classes

### US-4: Deployment Pipeline

- [x] T029 [P1] [US-4] [D:T009] Create `vercel.json` with SPA configuration
- [x] T030 [P2] [US-4] [D:T029] Create `.nvmrc` with Node version

### US-5: Project Structure

- [x] T031 [P2] [US-5] [D:T007] Create `src/components/` directory with `.gitkeep`
- [x] T032 [P2] [US-5] [D:T007] Create `src/stores/` directory with `.gitkeep`
- [x] T033 [P2] [US-5] [D:T007] Create `src/engine/` directory with `.gitkeep`
- [x] T034 [P2] [US-5] [D:T007] Create `src/hooks/` directory with `.gitkeep`
- [x] T035 [P2] [US-5] [D:T007] Create `src/utils/` directory with `.gitkeep`
- [x] T036 [P2] [US-5] [D:T007] Create `src/types/` directory with `.gitkeep`
- [x] T037 [P2] [US-5] [D:T007] Create `src/data/` directory with `.gitkeep`
- [x] T038 [P2] [US-5] [D:T007] Create `src/assets/` directory with `.gitkeep`
- [x] T039 [P2] [US-5] [D:T007] Create `src/styles/` directory with `.gitkeep`

---

## Polish Phase

### Update Package.json

- [x] T040 [P2] [US-1] [D:T018,T023] Update package.json `name` to "dungeon-delver"
- [x] T041 [P2] [US-1] [D:T040] Add `engines.node` >= 18.0.0 requirement
- [x] T042 [P2] [US-1] [D:T041] Add `typecheck` script for TypeScript validation

### Configure Vite Path Aliases

- [x] T043 [P1] [US-1] [D:T010] Update `vite.config.ts` with path alias resolution

### Update App Placeholder

- [x] T044 [P3] [US-5] [D:T028] Update `src/App.tsx` with "Dungeon Delver" placeholder and fantasy styling

### Update .gitignore

- [x] T045 [P2] [US-5] [D:T007] Update `.gitignore` for Vite, test coverage, and IDE files

---

## Verification Phase

### Run All Checks

- [x] T046 [P1] [D:T044] Verify `pnpm install` succeeds
- [x] T047 [P1] [D:T046] Verify `pnpm dev` starts server
- [x] T048 [P1] [D:T047] Verify `pnpm build` produces dist/
- [x] T049 [P1] [D:T048] Verify `pnpm lint` passes
- [x] T050 [P1] [D:T049] Verify `pnpm test:run` passes
- [x] T051 [P1] [D:T050] Verify `pnpm typecheck` passes

---

## Dependency Graph

```
T001 (archive dir)
 ├── T002 (move src/*.js)
 ├── T003 (move src/data/*.js)
 ├── T004 (move public/index.html)
 └── T005 (move styles/style.css)
      └── T006 (remove empty dirs)
           └── T007 (vite create)
                ├── T008 (pnpm install)
                │    ├── T012-T018 (ESLint/Prettier)
                │    ├── T019-T023 (Vitest)
                │    └── T024-T028 (Tailwind)
                ├── T010-T011 (TypeScript)
                │    └── T043 (Vite aliases)
                ├── T029-T030 (Vercel)
                └── T031-T039 (directories)
                     └── T040-T042 (package.json)
                          └── T044 (App placeholder)
                               └── T045 (.gitignore)
                                    └── T046-T051 (verification)
```

---

## Summary

| Category     | Count  |
| ------------ | ------ |
| Setup        | 6      |
| Foundational | 12     |
| User Story   | 21     |
| Polish       | 6      |
| Verification | 6      |
| **Total**    | **51** |

**Estimated Effort**: Low (standard scaffolding)
