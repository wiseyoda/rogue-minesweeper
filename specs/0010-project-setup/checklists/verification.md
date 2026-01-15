# Verification Checklist: 0010 - Project Setup

**Phase**: 0010-project-setup
**Type**: Post-Completion Verification
**Created**: 2026-01-14

---

## Build Verification

### Package Manager

- [ ] `pnpm -v` shows version 8.x or higher
- [ ] `pnpm-lock.yaml` exists in project root
- [ ] `node_modules/` directory exists after install
- [ ] No `package-lock.json` or `yarn.lock` present

### Install & Build

- [ ] `pnpm install` completes with exit code 0
- [ ] No peer dependency warnings (or documented exceptions)
- [ ] `pnpm dev` starts Vite server on localhost:5173
- [ ] Browser shows React app at http://localhost:5173
- [ ] `pnpm build` completes with exit code 0
- [ ] `dist/` directory created with assets
- [ ] `pnpm preview` serves production build

---

## TypeScript Verification

### Configuration

- [ ] `tsconfig.json` exists with `strict: true`
- [ ] `strictNullChecks: true` configured
- [ ] `noUncheckedIndexedAccess: true` configured
- [ ] Path alias `@/*` resolves to `./src/*`
- [ ] `tsconfig.node.json` exists for config files

### Type Checking

- [ ] `pnpm typecheck` (or `tsc --noEmit`) passes with 0 errors
- [ ] IDE shows type errors for incorrect code
- [ ] Path aliases work in import statements (`@/components/...`)

---

## Linting Verification

### ESLint Configuration

- [ ] `.eslintrc.cjs` exists
- [ ] Extends `eslint:recommended`
- [ ] Extends `plugin:react/recommended`
- [ ] Extends `plugin:react-hooks/recommended`
- [ ] Extends `plugin:@typescript-eslint/recommended`
- [ ] Compatible with Prettier (no formatting conflicts)

### ESLint Execution

- [ ] `pnpm lint` runs without errors
- [ ] Unused variable triggers lint error
- [ ] Missing hook dependency triggers lint warning
- [ ] IDE shows ESLint errors inline

---

## Prettier Verification

### Configuration

- [ ] `.prettierrc` exists with project settings
- [ ] 2-space indentation configured
- [ ] Trailing commas enabled
- [ ] Single quotes configured
- [ ] `.prettierignore` excludes dist/, node_modules/

### Formatting

- [ ] `pnpm format:check` passes (if script exists)
- [ ] Code auto-formats on save (IDE configured)
- [ ] No conflicts between ESLint and Prettier rules

---

## Testing Verification

### Vitest Configuration

- [ ] `vitest.config.ts` exists
- [ ] jsdom environment configured
- [ ] `vitest.setup.ts` imports jest-dom matchers

### Test Execution

- [ ] `pnpm test:run` passes with 0 failures
- [ ] At least 1 test exists (App.test.tsx)
- [ ] `pnpm test:coverage` generates coverage report
- [ ] Coverage report excludes config files

---

## Tailwind Verification

### Configuration

- [ ] `tailwind.config.ts` exists (TypeScript)
- [ ] Content paths include `./src/**/*.{ts,tsx}`
- [ ] Custom fantasy theme colors defined
- [ ] Cinzel font family added to theme
- [ ] `postcss.config.js` exists with autoprefixer

### Styling

- [ ] Tailwind classes apply in components
- [ ] No CDN script tag in index.html
- [ ] Production build includes only used classes

---

## Project Structure Verification

### Directories

- [ ] `src/components/` exists
- [ ] `src/stores/` exists
- [ ] `src/engine/` exists
- [ ] `src/hooks/` exists
- [ ] `src/utils/` exists
- [ ] `src/types/` exists
- [ ] `src/data/` exists
- [ ] `src/assets/` exists
- [ ] `src/styles/` exists

### Archive

- [ ] `.archive/poc/` contains original POC files
- [ ] Original `src/*.js` files archived
- [ ] Original `public/index.html` archived
- [ ] Original `styles/style.css` archived

### Entry Files

- [ ] `index.html` exists in project root
- [ ] `src/main.tsx` is entry point
- [ ] `src/App.tsx` is root component
- [ ] `src/index.css` has Tailwind directives
- [ ] App displays "Dungeon Delver" placeholder

---

## Deployment Verification

### Vercel Configuration

- [ ] `vercel.json` exists with SPA rewrites
- [ ] `.nvmrc` specifies Node version
- [ ] Build command: `pnpm build`
- [ ] Output directory: `dist`

### Deployment Test (Manual)

- [ ] Vercel CLI can deploy locally (`vercel`)
- [ ] Preview URL shows placeholder app
- [ ] Refresh on non-root URL works (SPA routing)

---

## Package.json Verification

- [ ] `name`: "dungeon-delver"
- [ ] `type`: "module"
- [ ] `engines.node`: ">= 18.0.0"
- [ ] Script: `dev` - starts Vite
- [ ] Script: `build` - production build
- [ ] Script: `preview` - serve build
- [ ] Script: `lint` - run ESLint
- [ ] Script: `test` - run Vitest watch
- [ ] Script: `test:run` - run Vitest once
- [ ] Script: `test:coverage` - coverage report
- [ ] Script: `typecheck` - TypeScript check

---

## Git Verification

- [ ] `.gitignore` includes `node_modules/`
- [ ] `.gitignore` includes `dist/`
- [ ] `.gitignore` includes coverage reports
- [ ] `.gitignore` includes IDE files
- [ ] No secrets or credentials committed

---

## Summary Checklist

| Category     | Passing |
| ------------ | ------- |
| Build        | [ ]     |
| TypeScript   | [ ]     |
| Linting      | [ ]     |
| Prettier     | [ ]     |
| Testing      | [ ]     |
| Tailwind     | [ ]     |
| Structure    | [ ]     |
| Deployment   | [ ]     |
| Package.json | [ ]     |
| Git          | [ ]     |

**All checks passing**: [ ]

---

## Notes

_Space for verification notes and exceptions_
