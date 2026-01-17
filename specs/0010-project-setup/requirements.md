# Requirements Checklist: 0010 - Project Setup

**Phase**: 0010-project-setup
**Spec Version**: 1.0.0
**Created**: 2026-01-14

---

## Functional Requirements

### Package Configuration (FR-1)

- [ ] FR-1.1: package.json with name "dungeon-delver"
- [ ] FR-1.2: pnpm as package manager (pnpm-lock.yaml exists)
- [ ] FR-1.3: Scripts: dev, build, preview, lint, test, test:run, test:coverage
- [ ] FR-1.4: type: "module" in package.json
- [ ] FR-1.5: engines.node >= 18.0.0

### TypeScript Configuration (FR-2)

- [ ] FR-2.1: strict: true
- [ ] FR-2.2: strictNullChecks: true
- [ ] FR-2.3: noUncheckedIndexedAccess: true
- [ ] FR-2.4: Path alias @/ -> src/
- [ ] FR-2.5: target: ES2022
- [ ] FR-2.6: tsconfig.node.json for config files

### Vite Configuration (FR-3)

- [ ] FR-3.1: @vitejs/plugin-react configured
- [ ] FR-3.2: Path aliases match TypeScript
- [ ] FR-3.3: Build output to dist/
- [ ] FR-3.4: Dev server configured

### ESLint Configuration (FR-4)

- [ ] FR-4.1: Extends eslint:recommended
- [ ] FR-4.2: Extends plugin:react/recommended
- [ ] FR-4.3: Extends plugin:react-hooks/recommended
- [ ] FR-4.4: Extends plugin:@typescript-eslint/recommended
- [ ] FR-4.5: Compatible with Prettier
- [ ] FR-4.6: Unused imports detected

### Prettier Configuration (FR-5)

- [ ] FR-5.1: 2-space indentation
- [ ] FR-5.2: Trailing commas enabled
- [ ] FR-5.3: Single quotes
- [ ] FR-5.4: 100 character line length
- [ ] FR-5.5: Semicolons enabled

### Vitest Configuration (FR-6)

- [ ] FR-6.1: jsdom environment
- [ ] FR-6.2: @testing-library/react installed
- [ ] FR-6.3: @testing-library/jest-dom matchers
- [ ] FR-6.4: Test patterns: _.test.ts, _.test.tsx
- [ ] FR-6.5: Coverage with v8 provider
- [ ] FR-6.6: Config files excluded from coverage

### Tailwind Configuration (FR-7)

- [ ] FR-7.1: tailwind.config.ts (TypeScript)
- [ ] FR-7.2: Content paths for React files
- [ ] FR-7.3: Fantasy color palette extended
- [ ] FR-7.4: Cinzel font family added
- [ ] FR-7.5: PostCSS with autoprefixer

### Project Structure (FR-8)

- [ ] FR-8.1: src/components/ exists
- [ ] FR-8.2: src/stores/ exists
- [ ] FR-8.3: src/engine/ exists
- [ ] FR-8.4: src/hooks/ exists
- [ ] FR-8.5: src/utils/ exists
- [ ] FR-8.6: src/types/ exists
- [ ] FR-8.7: src/data/ exists
- [ ] FR-8.8: src/assets/ exists
- [ ] FR-8.9: src/styles/ exists
- [ ] FR-8.10: POC archived to .archive/poc/

### Entry Files (FR-9)

- [ ] FR-9.1: index.html in project root
- [ ] FR-9.2: src/main.tsx entry point
- [ ] FR-9.3: src/App.tsx root component
- [ ] FR-9.4: src/index.css with Tailwind
- [ ] FR-9.5: App.tsx shows "Dungeon Delver" placeholder

### Vercel Configuration (FR-10)

- [ ] FR-10.1: vercel.json exists
- [ ] FR-10.2: SPA rewrites configured
- [ ] FR-10.3: Build command: pnpm build
- [ ] FR-10.4: Output directory: dist

---

## Verification Gates

### Build Verification

- [ ] `pnpm install` succeeds
- [ ] `pnpm dev` starts server
- [ ] `pnpm build` produces dist/
- [ ] `pnpm preview` serves build

### Type Verification

- [ ] TypeScript strict mode works
- [ ] Path aliases resolve
- [ ] No TS errors in project

### Lint Verification

- [ ] `pnpm lint` passes
- [ ] Unused vars caught
- [ ] Hook deps caught

### Test Verification

- [ ] `pnpm test:run` passes
- [ ] App.tsx test works
- [ ] Coverage generates

### Deploy Verification

- [ ] Vercel deploys successfully
- [ ] Site shows placeholder
