# Deferred Items: Phase 1041 - Design System Integration

## Summary

| Item | Source | Reason | Target Phase |
|------|--------|--------|--------------|
| A11Y-03: prefers-reduced-motion support | verification.md | Not implemented in current animations | 8030 (accessibility) |
| DM message logic | spec.md:Out of Scope | Visual only for this phase | 4030 (dm-dialogue-ui) |
| Rune slot functionality | spec.md:Out of Scope | Visual only for this phase | 3010 (rune-framework) |
| Touch gesture enhancements | spec.md:Out of Scope | Not included in scope | 6010 (visual-juice) |

## Detail

### A11Y-03: prefers-reduced-motion

**Current State**: Atmosphere animations (particle-float, aura-breathe, eye-look, etc.) run regardless of user motion preferences.

**Needed**: Add CSS media query support to disable/reduce animations when `prefers-reduced-motion: reduce` is set.

**Target Phase**: 8030 (accessibility) - dedicated accessibility phase.

### DM Message Logic

**Current State**: DMPanel shows static placeholder "WATCHING" status and no actual messages.

**Needed**: Integration with AI provider to generate contextual dungeon master commentary.

**Target Phase**: 4030 (dm-dialogue-ui) - full DM dialogue integration.

### Rune Slot Functionality

**Current State**: RunesPanel displays placeholder empty slots with no actual buff data.

**Needed**: Integration with rune system to display equipped runes and their effects.

**Target Phase**: 3010 (rune-framework) - rune system foundation.

### Touch Gesture Enhancements

**Current State**: Standard click/tap interactions only.

**Needed**: Long-press for flag, swipe gestures, touch-optimized targets.

**Target Phase**: 6010 (visual-juice) or dedicated mobile phase.

---

**Created**: 2026-01-15
**Phase**: 1041 - Design System Integration
