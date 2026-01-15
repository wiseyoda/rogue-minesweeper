/**
 * Vignette - Screen edge darkening
 *
 * Fixed-position radial gradient that darkens screen edges.
 * Source: .specify/reference/design-system/03-atmosphere.css
 */

export function Vignette() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5, 5, 10, 0.7) 100%)',
      }}
      aria-hidden="true"
    />
  );
}
