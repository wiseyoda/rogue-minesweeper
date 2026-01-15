# Specification: 0010 - Project Setup

**Phase**: 0010-project-setup
**Version**: 1.0.0
**Created**: 2026-01-14
**Status**: Draft

---

## Overview

Scaffold a new React + TypeScript + Vite project with all development tooling configured, replacing the existing vanilla JavaScript proof-of-concept.

### Goals

1. Create a modern, type-safe development environment using pnpm, Vite, React 18, and TypeScript
2. Configure all code quality tools (ESLint, Prettier, TypeScript strict mode)
3. Set up Vitest for testing
4. Configure Tailwind CSS with proper build tooling
5. Establish project directory structure per tech-stack.md
6. Configure Vercel deployment
7. Archive existing POC files for reference

### Non-Goals

- Implementing any game logic (deferred to Phase 2+)
- Creating actual UI components beyond placeholder App.tsx
- Setting up Zustand stores (deferred to Phase 2)
- AI integration (Phase 3)
- Audio system (Phase 5)

---

## User Stories

### US-1: Developer Environment Setup

**As a** developer
**I want** a fully configured React + TypeScript project
**So that** I can start building features with type safety and modern tooling

**Acceptance Criteria**:

- `pnpm install` completes without errors
- `pnpm dev` starts Vite dev server on localhost
- `pnpm build` produces production build in `dist/`
- TypeScript catches type errors in editor and build
- ESLint errors appear in editor and block build
- Prettier auto-formats on save (editor config)

### US-2: Testing Infrastructure

**As a** developer
**I want** Vitest configured with React Testing Library
**So that** I can write and run tests from Phase 1 onwards

**Acceptance Criteria**:

- `pnpm test` runs Vitest in watch mode
- `pnpm test:run` runs all tests once
- React components can be tested with Testing Library
- Test files use `.test.tsx` or `.spec.tsx` extension
- Test coverage reporting available via `pnpm test:coverage`

### US-3: Styling Setup

**As a** developer
**I want** Tailwind CSS configured with build-time compilation
**So that** I can use utility classes without CDN dependencies

**Acceptance Criteria**:

- Tailwind classes work in React components
- Custom theme extends Tailwind with D&D fantasy colors
- PostCSS configured for production optimization
- No CDN script tag (proper build-time processing)

### US-4: Deployment Pipeline

**As a** developer
**I want** Vercel deployment configured
**So that** every push to main automatically deploys

**Acceptance Criteria**:

- `vercel.json` configured for Vite SPA
- Vercel can build project using pnpm
- Preview deploys work for PRs
- Production deploy works for main branch

### US-5: Project Structure

**As a** developer
**I want** the directory structure established
**So that** I know where to put code as I build features

**Acceptance Criteria**:

- `src/` directories created per tech-stack.md plan
- Placeholder index files in key directories
- TypeScript path aliases configured for clean imports
- Old POC files archived to `.archive/poc/`

---

## Functional Requirements

### FR-1: Package Configuration

| Requirement | Details                                                                   |
| ----------- | ------------------------------------------------------------------------- |
| FR-1.1      | Create `package.json` with name "dungeon-delver"                          |
| FR-1.2      | Use pnpm as package manager (pnpm-lock.yaml)                              |
| FR-1.3      | Include scripts: dev, build, preview, lint, test, test:run, test:coverage |
| FR-1.4      | Include type: "module" for ES modules                                     |
| FR-1.5      | Set minimum Node.js version (>=18.0.0)                                    |

### FR-2: TypeScript Configuration

| Requirement | Details                                    |
| ----------- | ------------------------------------------ |
| FR-2.1      | Enable strict mode                         |
| FR-2.2      | Enable strictNullChecks                    |
| FR-2.3      | Enable noUncheckedIndexedAccess            |
| FR-2.4      | Configure path aliases (@/ -> src/)        |
| FR-2.5      | Target ES2022                              |
| FR-2.6      | Include separate tsconfig for node scripts |

### FR-3: Vite Configuration

| Requirement | Details                                       |
| ----------- | --------------------------------------------- |
| FR-3.1      | Configure React plugin (@vitejs/plugin-react) |
| FR-3.2      | Configure path aliases matching TypeScript    |
| FR-3.3      | Configure build output to `dist/`             |
| FR-3.4      | Configure dev server port (5173 default)      |

### FR-4: ESLint Configuration

| Requirement | Details                                        |
| ----------- | ---------------------------------------------- |
| FR-4.1      | Extend eslint:recommended                      |
| FR-4.2      | Extend plugin:react/recommended                |
| FR-4.3      | Extend plugin:react-hooks/recommended          |
| FR-4.4      | Extend plugin:@typescript-eslint/recommended   |
| FR-4.5      | Configure to work with Prettier (no conflicts) |
| FR-4.6      | Enable unused imports detection                |

### FR-5: Prettier Configuration

| Requirement | Details                   |
| ----------- | ------------------------- |
| FR-5.1      | Use 2-space indentation   |
| FR-5.2      | Enable trailing commas    |
| FR-5.3      | Use single quotes         |
| FR-5.4      | 100 character line length |
| FR-5.5      | Semicolons enabled        |

### FR-6: Vitest Configuration

| Requirement | Details                                              |
| ----------- | ---------------------------------------------------- |
| FR-6.1      | Configure jsdom environment                          |
| FR-6.2      | Include @testing-library/react                       |
| FR-6.3      | Include @testing-library/jest-dom matchers           |
| FR-6.4      | Configure test file patterns (_.test.ts, _.test.tsx) |
| FR-6.5      | Configure coverage with v8 provider                  |
| FR-6.6      | Exclude config files from coverage                   |

### FR-7: Tailwind Configuration

| Requirement | Details                                 |
| ----------- | --------------------------------------- |
| FR-7.1      | Use tailwind.config.ts (TypeScript)     |
| FR-7.2      | Configure content paths for React files |
| FR-7.3      | Extend theme with fantasy color palette |
| FR-7.4      | Add custom font family for Cinzel       |
| FR-7.5      | Configure PostCSS with autoprefixer     |

### FR-8: Project Structure

| Requirement | Details                              |
| ----------- | ------------------------------------ |
| FR-8.1      | Create `src/components/` directory   |
| FR-8.2      | Create `src/stores/` directory       |
| FR-8.3      | Create `src/engine/` directory       |
| FR-8.4      | Create `src/hooks/` directory        |
| FR-8.5      | Create `src/utils/` directory        |
| FR-8.6      | Create `src/types/` directory        |
| FR-8.7      | Create `src/data/` directory         |
| FR-8.8      | Create `src/assets/` directory       |
| FR-8.9      | Create `src/styles/` directory       |
| FR-8.10     | Archive POC files to `.archive/poc/` |

### FR-9: Entry Files

| Requirement | Details                                            |
| ----------- | -------------------------------------------------- |
| FR-9.1      | Create `index.html` in project root                |
| FR-9.2      | Create `src/main.tsx` as entry point               |
| FR-9.3      | Create `src/App.tsx` as root component             |
| FR-9.4      | Create `src/index.css` with Tailwind imports       |
| FR-9.5      | App.tsx displays "Dungeon Delver" placeholder text |

### FR-10: Vercel Configuration

| Requirement | Details                                    |
| ----------- | ------------------------------------------ |
| FR-10.1     | Create `vercel.json` for SPA routing       |
| FR-10.2     | Configure rewrites for client-side routing |
| FR-10.3     | Set build command to `pnpm build`          |
| FR-10.4     | Set output directory to `dist`             |

---

## Dependencies

### Production Dependencies

| Package   | Version | Purpose            |
| --------- | ------- | ------------------ |
| react     | ^18.x   | UI framework       |
| react-dom | ^18.x   | React DOM renderer |

### Development Dependencies

| Package                          | Version | Purpose             |
| -------------------------------- | ------- | ------------------- |
| typescript                       | ^5.x    | Type checking       |
| vite                             | ^5.x    | Build tool          |
| @vitejs/plugin-react             | latest  | React integration   |
| tailwindcss                      | ^3.x    | Utility CSS         |
| postcss                          | latest  | CSS processing      |
| autoprefixer                     | latest  | CSS vendor prefixes |
| eslint                           | ^8.x    | Linting             |
| @typescript-eslint/eslint-plugin | latest  | TS linting          |
| @typescript-eslint/parser        | latest  | TS parsing          |
| eslint-plugin-react              | latest  | React linting       |
| eslint-plugin-react-hooks        | latest  | Hooks linting       |
| eslint-config-prettier           | latest  | Prettier compat     |
| prettier                         | latest  | Formatting          |
| vitest                           | latest  | Testing             |
| @testing-library/react           | latest  | Component testing   |
| @testing-library/jest-dom        | latest  | DOM matchers        |
| jsdom                            | latest  | Test environment    |
| @types/react                     | latest  | React types         |
| @types/react-dom                 | latest  | React DOM types     |

---

## Verification Criteria

### Build Verification

- [ ] `pnpm install` succeeds with no errors
- [ ] `pnpm dev` starts dev server, opens in browser
- [ ] `pnpm build` produces `dist/` with HTML, JS, CSS
- [ ] `pnpm preview` serves production build

### Type Verification

- [ ] TypeScript strict mode catches errors
- [ ] Path aliases resolve correctly (@/components/...)
- [ ] No TypeScript errors in initial project

### Lint Verification

- [ ] `pnpm lint` runs without errors on fresh project
- [ ] ESLint catches unused variables
- [ ] ESLint catches missing dependencies in hooks

### Test Verification

- [ ] `pnpm test:run` passes
- [ ] Sample test for App.tsx works
- [ ] Coverage report generates

### Deploy Verification

- [ ] Vercel preview deploy succeeds
- [ ] Deployed site shows placeholder content
- [ ] Client-side routing works (if tested)

---

## Out of Scope

| Item                | Reason                        | Future Phase |
| ------------------- | ----------------------------- | ------------ |
| Zustand store setup | No state needed yet           | Phase 2      |
| Game components     | Core loop not started         | Phase 2      |
| AI integration      | Later phase                   | Phase 3      |
| Audio system        | Later phase                   | Phase 5      |
| Framer Motion       | No animations yet             | Phase 2      |
| E2E tests           | Unit tests sufficient for now | Future       |

---

## Risks & Mitigations

| Risk                          | Likelihood | Impact | Mitigation                               |
| ----------------------------- | ---------- | ------ | ---------------------------------------- |
| pnpm version conflicts        | Low        | Medium | Pin pnpm version in package.json engines |
| Vite plugin incompatibilities | Low        | High   | Use official Vite React plugin only      |
| ESLint/Prettier conflicts     | Medium     | Low    | Use eslint-config-prettier               |
| Tailwind v4 breaking changes  | Low        | Medium | Pin to v3.x for stability                |

---

## References

- Phase definition: `.specify/phases/0010-project-setup.md`
- Tech stack: `.specify/memory/tech-stack.md`
- Constitution: `.specify/memory/constitution.md`
- Discovery: `specs/0010-project-setup/discovery.md`
