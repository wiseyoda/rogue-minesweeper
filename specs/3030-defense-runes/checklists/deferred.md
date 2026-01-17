# Deferred Items: Phase 3030 - Defense Runes

## Summary

| Item | Source | Reason | Target |
|------|--------|--------|--------|
| T025: Manual playtest Hardy | tasks.md | Requires user interaction | User verification gate |
| T026: Manual playtest Shield Bearer | tasks.md | Requires user interaction | User verification gate |
| T027: Manual playtest Iron Skin | tasks.md | Requires user interaction | User verification gate |
| T028: Manual playtest Undying | tasks.md | Requires user interaction | User verification gate |

## Details

### Manual Playtest Tasks (T025-T028)

**Reason**: These tasks require manual user interaction with the game UI to verify visual feedback and gameplay feel. They cannot be automated and are best performed during the user verification gate.

**User Verification Criteria**:
1. **Hardy**: Equip Hardy rune, verify HUD shows increased max lives (+1)
2. **Shield Bearer**: Start a new floor with Shield Bearer equipped, verify shield count increases
3. **Iron Skin**: Take damage from a monster, verify damage is reduced (e.g., 4 → 3)
4. **Undying**: Reveal 50+ tiles with Undying equipped, verify HP heals when threshold reached

**Automated Coverage**: All rune effects have been verified via unit tests (`defenseRunes.test.ts`) and integration tests. The manual playtests are for confirming visual/UX elements work as expected.

---

*Created: 2026-01-17*
*Phase: 3030-defense-runes*
