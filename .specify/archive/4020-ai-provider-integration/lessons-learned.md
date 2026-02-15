## Lessons Learned

### Decisions
- Kept provider orchestration in `src/ai/generate.ts` as a small stateful wrapper with dependency injection, allowing network-free tests and future trigger/UI integration.
- Used strict schema parsing (`src/ai/parser.ts`) as a hard boundary so downstream layers never handle unvalidated model payloads.
- Added a dedicated cooldown helper (`src/ai/rateLimit.ts`) rather than embedding timer logic in store code, which keeps policy testable and reusable.

### Gotchas
- `noUncheckedIndexedAccess` in TypeScript strict mode requires explicit guard paths even for non-empty fallback arrays.
- Provider packages are easy to wire but still need explicit timeout/error normalization to prevent ambiguous fallback behavior.

### Patterns
- For external AI providers, use an ordered fallback chain (`primary -> secondary -> local fallback`) with source metadata and deterministic local fallback selection.
- Keep environment parsing centralized in `src/ai/providers.ts` to avoid scattered `import.meta.env` usage.
