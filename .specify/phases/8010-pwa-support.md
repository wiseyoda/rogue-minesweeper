---
phase: "8010"
name: pwa-support
status: not_started
created: 2026-01-14
---

# 8010 - PWA Support

**Goal**: Make the game installable and work offline.

## Scope

- Service worker setup
- Manifest.json
- Offline caching
- Install prompt
- App icons

## Deliverables

| File | Description |
|------|-------------|
| `public/manifest.json` | PWA manifest |
| `public/sw.js` | Service worker |
| `src/hooks/usePWA.ts` | PWA hook |
| `public/icons/` | App icons |

## Verification Gate

- [ ] Shows install prompt
- [ ] Installs as app
- [ ] Works offline
- [ ] Icons display correctly
- [ ] Updates when new version

## Estimated Complexity

**Low** - Standard PWA setup.

## PWA Features

- Installable on desktop/mobile
- Offline gameplay
- Background sync (leaderboards)
- Push notifications (daily challenge?)

## Notes

- Use Vite PWA plugin
- Cache game assets aggressively
- Handle update flow gracefully
