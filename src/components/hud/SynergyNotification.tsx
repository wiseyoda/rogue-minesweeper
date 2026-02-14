/**
 * Synergy discovery notification banner.
 * @module components/hud/SynergyNotification
 */

import { useEffect } from 'react';
import type { SynergyNotification as SynergyNotificationPayload } from '@/types';

export interface SynergyNotificationProps {
  /** Notification payload from game state. */
  notification?: SynergyNotificationPayload;
  /** Called to dismiss the notification. */
  onDismiss: () => void;
  /** Auto-dismiss delay in milliseconds. */
  durationMs?: number;
}

export function SynergyNotification({
  notification,
  onDismiss,
  durationMs = 3500,
}: SynergyNotificationProps) {
  useEffect(() => {
    if (!notification) return;

    const timer = window.setTimeout(() => {
      onDismiss();
    }, durationMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [notification, onDismiss, durationMs]);

  if (!notification) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        border: '1px solid var(--mystic)',
        background: 'linear-gradient(180deg, var(--mystic-void) 0%, var(--stone-900) 100%)',
        boxShadow: '0 0 12px var(--mystic-dark)',
        padding: '10px',
      }}
    >
      <div
        style={{
          fontSize: '9px',
          color: 'var(--mystic-glow)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '4px',
        }}
      >
        Synergy Discovered
      </div>

      <div style={{ fontSize: '12px', color: 'var(--bone)', marginBottom: '3px' }}>
        {notification.name}
      </div>

      <div style={{ fontSize: '9px', color: 'var(--stone-300)', lineHeight: 1.4 }}>
        {notification.description}
      </div>
    </div>
  );
}
