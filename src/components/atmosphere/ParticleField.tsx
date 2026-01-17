/**
 * ParticleField - Floating dust particles
 *
 * 8 particles with staggered animation floating upward.
 * Source: .specify/reference/design-system/03-atmosphere.css
 */

export function ParticleField() {
  const particles = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    >
      {particles.map((i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: '2px',
            height: '2px',
            background: 'var(--bone)',
            borderRadius: '50%',
            left: `${10 + i * 12}%`,
            animation: `particle-float 20s linear infinite`,
            animationDelay: `${i * 2.5}s`,
          }}
        />
      ))}
    </div>
  );
}
