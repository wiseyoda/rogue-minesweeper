/**
 * BrickPattern - Subtle dungeon wall texture
 *
 * Fixed-position SVG brick pattern background layer.
 * Source: .specify/reference/design-system/03-atmosphere.css
 */

export function BrickPattern() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        opacity: 0.4,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='20' viewBox='0 0 40 20'%3E%3Crect fill='%2318182a' width='40' height='20'/%3E%3Crect fill='%231e1e30' x='1' y='1' width='18' height='8'/%3E%3Crect fill='%231e1e30' x='21' y='1' width='18' height='8'/%3E%3Crect fill='%231e1e30' x='-9' y='11' width='18' height='8'/%3E%3Crect fill='%231e1e30' x='11' y='11' width='18' height='8'/%3E%3Crect fill='%231e1e30' x='31' y='11' width='18' height='8'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}
      aria-hidden="true"
    />
  );
}
