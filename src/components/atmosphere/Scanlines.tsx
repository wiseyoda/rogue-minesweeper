/**
 * Scanlines - CRT-style horizontal lines
 *
 * Fixed-position subtle scanline overlay.
 * Source: .specify/reference/design-system/03-atmosphere.css
 */

export function Scanlines() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 100,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px)',
      }}
      aria-hidden="true"
    />
  );
}
