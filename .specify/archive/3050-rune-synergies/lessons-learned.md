## Lessons Learned

### Decisions
- Kept synergy logic as a dedicated engine (`src/engine/synergies.ts`) rather than mixing it into rune logic to preserve separation of concerns.
- Used run-scoped discovery state (`discoveredSynergyIds`) so notifications are informative without adding permanent progression complexity.
- Applied synergy bonuses through existing hook points (startLevel, takeDamage, setPhase, shop pricing) to minimize regression risk.

### Gotchas
- Full lint gate surfaced pre-existing unused-variable issues outside phase scope; gate closure required repo-wide cleanup.
- First-click-safety test was flaky because it clicked a non-guaranteed tile. Switched it to reveal the guaranteed safe center tile for deterministic behavior.

### Patterns
- A shared `computeSynergyState` helper in store keeps activation/discovery/notification updates consistent across equip/replace/reward paths.
- Additive shop discount synergy was safely composed by extending existing passive rune modifiers instead of introducing a second pricing function.
