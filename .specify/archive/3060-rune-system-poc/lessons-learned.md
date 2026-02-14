## Lessons Learned

### Decisions
- Added tile-drop integration through existing store/shop flow rather than creating a separate loot UI, which kept rune economy and purchase rules consistent.
- Kept drop balancing explicit in `src/engine/runes.ts` with exported constants and helper functions to make tuning and tests straightforward.
- Preserved existing synergy discovery pipeline and validated compatibility via dropped-rune purchase regression tests.

### Gotchas
- `specflow phase open` set phase state correctly but stale feature context remained until new `specs/3060-rune-system-poc` artifacts were created.
- Placeholder scanning can false-positive on checklist text containing literal `[NEEDS CLARIFICATION]` references.
- Full-store tests are fast enough to run repeatedly; this made iterative changes safer than relying on narrow unit checks alone.

### Patterns
- For gameplay RNG changes, inject deterministic hooks (`rng` argument) at helper level and exercise integration paths through store tests.
- Keep state changes local to `gameStore` and avoid duplicating pricing/equip logic in UI components.
- Pair each behavior change with at least one integration test at the store boundary and one focused helper/unit test.
