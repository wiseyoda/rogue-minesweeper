/**
 * useLongPress hook - detects long press on touch devices.
 * @module hooks/useLongPress
 */

import { useCallback, useRef } from 'react';

/**
 * Options for the useLongPress hook.
 */
export interface UseLongPressOptions {
  /** Callback when long press is detected */
  onLongPress: () => void;
  /** Delay in milliseconds before long press triggers (default: 500) */
  delay?: number;
  /** Callback for regular click (fires if not a long press) */
  onClick?: () => void;
}

/**
 * Return type for useLongPress hook.
 */
export interface UseLongPressHandlers {
  /** Attach to onTouchStart */
  onTouchStart: (e: React.TouchEvent) => void;
  /** Attach to onTouchEnd */
  onTouchEnd: (e: React.TouchEvent) => void;
  /** Attach to onTouchMove */
  onTouchMove: (e: React.TouchEvent) => void;
}

/**
 * Hook to detect long press on touch devices.
 * Triggers onLongPress after holding for the specified delay.
 * Cancels if the touch moves or ends before the delay.
 *
 * @example
 * const handlers = useLongPress({
 *   onLongPress: () => console.log('Long pressed!'),
 *   onClick: () => console.log('Clicked!'),
 *   delay: 500,
 * });
 *
 * <button {...handlers}>Press me</button>
 */
export function useLongPress({
  onLongPress,
  delay = 500,
  onClick,
}: UseLongPressOptions): UseLongPressHandlers {
  const timerRef = useRef<number | null>(null);
  const isLongPressRef = useRef(false);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      isLongPressRef.current = false;

      // Store starting position to detect movement
      const touch = e.touches[0];
      if (!touch) return;

      startPosRef.current = { x: touch.clientX, y: touch.clientY };

      timerRef.current = window.setTimeout(() => {
        isLongPressRef.current = true;
        onLongPress();
      }, delay);
    },
    [delay, onLongPress]
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      clearTimer();

      // If it wasn't a long press, trigger onClick
      if (!isLongPressRef.current && onClick) {
        // Prevent the click event from also firing
        e.preventDefault();
        onClick();
      }

      startPosRef.current = null;
    },
    [clearTimer, onClick]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      // Cancel long press if user moves finger too much (scrolling)
      if (startPosRef.current) {
        const touch = e.touches[0];
        if (!touch) return;

        const moveThreshold = 10; // pixels
        const dx = Math.abs(touch.clientX - startPosRef.current.x);
        const dy = Math.abs(touch.clientY - startPosRef.current.y);

        if (dx > moveThreshold || dy > moveThreshold) {
          clearTimer();
          startPosRef.current = null;
        }
      }
    },
    [clearTimer]
  );

  return {
    onTouchStart,
    onTouchEnd,
    onTouchMove,
  };
}
