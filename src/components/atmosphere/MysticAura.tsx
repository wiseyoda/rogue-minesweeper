/**
 * MysticAura - Centered breathing glow
 *
 * Fixed-position mystic purple glow that breathes in the center.
 * Source: .specify/reference/design-system/03-atmosphere.css
 */

export function MysticAura() {
  return (
    <div
      className="fixed pointer-events-none"
      style={{
        zIndex: 1,
        width: '600px',
        height: '350px',
        left: '50%',
        top: '40%',
        transform: 'translateX(-50%)',
        background: 'radial-gradient(ellipse at center, rgba(112, 48, 176, 0.2) 0%, transparent 70%)',
        animation: 'aura-breathe 8s ease-in-out infinite',
      }}
      aria-hidden="true"
    />
  );
}
