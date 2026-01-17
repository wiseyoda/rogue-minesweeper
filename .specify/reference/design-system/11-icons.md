# SVG Icons Reference

Source: ui-mockup-definitive.html

All icons are inline SVGs - no external dependencies.
Use these exact SVGs in React components.

## Flag Icon (16x16)

```svg
<svg viewBox="0 0 16 16" fill="none">
  <rect x="5" y="3" width="2" height="11" fill="var(--gold-dark)"/>
  <path d="M7 3 L13 6 L7 9 Z" fill="var(--gold)"/>
</svg>
```

## Skull/Monster Icon (16x16)

```svg
<svg viewBox="0 0 16 16" fill="var(--bone-light)">
  <rect x="4" y="2" width="8" height="8" rx="1"/>
  <rect x="5" y="4" width="2" height="2" fill="var(--blood-dark)"/>
  <rect x="9" y="4" width="2" height="2" fill="var(--blood-dark)"/>
  <rect x="6" y="10" width="1" height="4"/>
  <rect x="9" y="10" width="1" height="4"/>
</svg>
```

## Coin/Gold Icon (20x20)

```svg
<svg viewBox="0 0 20 20" fill="var(--gold)">
  <circle cx="10" cy="10" r="8"/>
  <circle cx="10" cy="10" r="5" fill="var(--gold-dark)"/>
  <text x="10" y="13" text-anchor="middle" font-size="7" fill="var(--gold-bright)" font-family="Press Start 2P">$</text>
</svg>
```

## Shield Icon (20x20)

```svg
<svg viewBox="0 0 20 20" fill="var(--ice)">
  <path d="M10 2 L3 5 V10 C3 14 6 17 10 18 C14 17 17 14 17 10 V5 L10 2 Z"/>
  <path d="M10 4 L5 6 V10 C5 13 7 15 10 16 C13 15 15 13 15 10 V6 L10 4 Z" fill="var(--ice-dark)"/>
</svg>
```

## Seer's Stone Rune (16x16)

```svg
<svg viewBox="0 0 16 16" fill="none" stroke="var(--mystic-bright)" stroke-width="1.5">
  <circle cx="8" cy="8" r="3"/>
  <line x1="8" y1="2" x2="8" y2="5"/>
  <line x1="8" y1="11" x2="8" y2="14"/>
  <line x1="2" y1="8" x2="5" y2="8"/>
  <line x1="11" y1="8" x2="14" y2="8"/>
</svg>
```

## Ward Crystal Rune (16x16)

```svg
<svg viewBox="0 0 16 16" fill="none" stroke="var(--stone-300)" stroke-width="1.5">
  <path d="M8 2 L3 8 L8 14 L13 8 Z"/>
</svg>
```

## Heart Icon (for HP)

```svg
<svg viewBox="0 0 16 16" fill="var(--blood)">
  <path d="M8 14 C4 10 2 7 2 5 C2 3 4 1 6 1 C7 1 8 2 8 2 C8 2 9 1 10 1 C12 1 14 3 14 5 C14 7 12 10 8 14 Z"/>
</svg>
```

## Icon Size Classes

```css
.icon { display: inline-block; vertical-align: middle; }
.icon-sm { width: 12px; height: 12px; }
.icon-md { width: 16px; height: 16px; }
.icon-lg { width: 20px; height: 20px; }
```
