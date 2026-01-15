/**
 * DMPanel - Dungeon Master watching panel
 *
 * Animated eye with status indicator.
 * Source: .specify/reference/design-system/06-dm-panel.css
 */

import { Panel } from '../ui/Panel';

export function DMPanel() {
  return (
    <Panel variant="dm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span
          style={{
            fontSize: '6px',
            color: 'var(--mystic-glow)',
            letterSpacing: '2px',
          }}
        >
          DUNGEON MASTER
        </span>
        <div className="flex items-center gap-2">
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--mystic-bright)',
              animation: 'status-blink 1.5s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontSize: '5px',
              color: 'var(--mystic-bright)',
              letterSpacing: '1px',
            }}
          >
            WATCHING
          </span>
        </div>
      </div>

      {/* Eye container */}
      <div
        className="flex items-center justify-center"
        style={{
          width: '48px',
          height: '48px',
          margin: '0 auto 12px',
          background: 'radial-gradient(circle at 50% 50%, var(--mystic-dark) 0%, var(--mystic-void) 70%)',
          borderRadius: '50%',
          border: '2px solid var(--mystic)',
          boxShadow: '0 0 15px var(--mystic-dark), inset 0 0 10px var(--mystic-void)',
        }}
      >
        {/* Eye */}
        <div
          style={{
            width: '20px',
            height: '20px',
            background: 'radial-gradient(circle at 50% 40%, var(--mystic-glow) 0%, var(--mystic-bright) 30%, var(--mystic) 60%, var(--mystic-dark) 100%)',
            borderRadius: '50%',
            boxShadow: '0 0 10px var(--mystic-bright)',
            animation: 'eye-look 6s ease-in-out infinite',
          }}
        >
          {/* Pupil */}
          <div
            style={{
              width: '8px',
              height: '8px',
              margin: '6px auto 0',
              background: 'var(--void)',
              borderRadius: '50%',
              boxShadow: '0 0 4px var(--mystic-void)',
            }}
          />
        </div>
      </div>

      {/* Message */}
      <p
        style={{
          fontSize: '7px',
          color: 'var(--stone-400)',
          textAlign: 'center',
          fontStyle: 'italic',
          lineHeight: '1.8',
        }}
      >
        "Your fate unfolds..."
      </p>
    </Panel>
  );
}
