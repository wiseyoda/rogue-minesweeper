/**
 * MessageArea component - displays game messages in a persistent banner.
 * @module components/hud/MessageArea
 */

import { memo } from 'react';

/**
 * Message type determines styling.
 */
export type MessageType = 'info' | 'warning' | 'success' | 'danger';

/**
 * Game message structure.
 */
export interface GameMessage {
  /** Message text to display */
  text: string;
  /** Message type for styling */
  type: MessageType;
}

/**
 * Props for MessageArea component.
 */
export interface MessageAreaProps {
  /** Current message to display (null/undefined for empty state) */
  message?: GameMessage | null;
}

/**
 * Styling classes for each message type.
 */
const MESSAGE_STYLES: Record<MessageType, string> = {
  info: 'bg-dungeon-shadow/50 text-dungeon-stone border-dungeon-stone/30',
  warning: 'bg-dungeon-amber/20 text-dungeon-amber border-dungeon-amber/30',
  success: 'bg-dungeon-gold/20 text-dungeon-gold border-dungeon-gold/30',
  danger: 'bg-dungeon-blood/20 text-dungeon-blood border-dungeon-blood/30',
};

/**
 * Displays a persistent message banner with type-based styling.
 * Shows default empty state when no message is provided.
 */
export const MessageArea = memo(function MessageArea({
  message,
}: MessageAreaProps) {
  // Show empty placeholder when no message
  if (!message) {
    return (
      <div className="h-8 flex items-center justify-center text-dungeon-stone/50 text-sm">
        —
      </div>
    );
  }

  return (
    <div
      className={`h-8 px-3 flex items-center justify-center rounded border ${MESSAGE_STYLES[message.type]}`}
      role="status"
      aria-live="polite"
    >
      <span className="text-sm font-medium">{message.text}</span>
    </div>
  );
});
