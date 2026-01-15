---
phase: '0010'
name: project-setup
status: not_started
created: 2026-01-14
---

# 0010 - Project Setup

**Goal**: Scaffold a new React + TypeScript + Vite project with all dev tooling configured.

## Scope

- Initialize Vite React-TS project
- Configure pnpm as package manager
- Set up Tailwind CSS
- Configure ESLint + Prettier
- Set up TypeScript strict mode
- Add Vitest for testing
- Create initial project structure (empty directories)
- Configure Vercel deployment
- Create basic App.tsx placeholder

## Deliverables

| File                 | Description                      |
| -------------------- | -------------------------------- |
| `package.json`       | Project dependencies and scripts |
| `vite.config.ts`     | Vite configuration               |
| `tsconfig.json`      | TypeScript strict config         |
| `tailwind.config.ts` | Tailwind setup                   |
| `.eslintrc.cjs`      | ESLint rules                     |
| `.prettierrc`        | Prettier config                  |
| `vitest.config.ts`   | Vitest setup                     |
| `src/App.tsx`        | Placeholder app component        |
| `src/main.tsx`       | Entry point                      |
| `vercel.json`        | Deployment config                |

## Verification Gate

- [ ] `pnpm install` succeeds
- [ ] `pnpm dev` starts dev server
- [ ] `pnpm build` produces production build
- [ ] `pnpm test` runs (even with no tests)
- [ ] `pnpm lint` passes
- [ ] Deploys to Vercel successfully

## Estimated Complexity

**Low** - Standard project scaffolding with familiar tools.

## Notes

- Delete existing vanilla JS POC files (keep as reference in `.archive/` if desired)
- Use pnpm, not npm or yarn
- Strict TypeScript from day 1
