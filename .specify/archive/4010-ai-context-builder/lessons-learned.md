## Lessons Learned

### Decisions

- Centralized AI contracts in `src/types/ai.ts` so upcoming provider and UI phases share one context schema.
- Kept context-builder logic pure in `src/ai/context.ts` and exposed a separate live-store wrapper to keep unit tests deterministic.
- Added a dedicated `dungeonStore` instead of overloading `gameStore` to keep AI telemetry lifecycle independent from core gameplay state.

### Gotchas

- With strict indexed access enabled, reverse-index loops require null guards for array entries (`runHistory[i]`).
- Persisted stores need explicit reset behavior in tests to avoid localStorage bleed between test cases.

### Patterns

- Sliding-window request throttling can live in state now and be reused unchanged in provider integration.
- Token-budget enforcement is easiest to reason about with deterministic truncation order (actions first, then historical arrays).
