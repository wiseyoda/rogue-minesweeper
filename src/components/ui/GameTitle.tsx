/**
 * GameTitle - Main title with diamond accents
 *
 * Blood-colored title with animated gem sparkles.
 * Source: .specify/reference/design-system/10-layout.css
 */

interface GameTitleProps {
  title: string;
  subtitle?: string;
}

export function GameTitle({ title, subtitle }: GameTitleProps) {
  return (
    <div className="text-center">
      <h1
        className="relative inline-block"
        style={{
          fontSize: '22px',
          color: 'var(--blood)',
          textShadow: '0 0 20px var(--blood-dark), 0 2px 0 var(--blood-void)',
          letterSpacing: '2px',
          animation: 'title-pulse 4s ease-in-out infinite',
        }}
      >
        {/* Left diamond */}
        <span
          className="absolute"
          style={{
            left: '-20px',
            top: '50%',
            transform: 'translateY(-50%) rotate(45deg)',
            width: '8px',
            height: '8px',
            background: 'var(--gold)',
            boxShadow: '0 0 8px var(--gold)',
            animation: 'gem-sparkle 2s ease-in-out infinite',
          }}
        />
        {title}
        {/* Right diamond */}
        <span
          className="absolute"
          style={{
            right: '-20px',
            top: '50%',
            transform: 'translateY(-50%) rotate(45deg)',
            width: '8px',
            height: '8px',
            background: 'var(--gold)',
            boxShadow: '0 0 8px var(--gold)',
            animation: 'gem-sparkle 2s ease-in-out infinite',
            animationDelay: '1s',
          }}
        />
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: '7px',
            color: 'var(--stone-300)',
            marginTop: '8px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
