/**
 * Unit tests for SynergyNotification component.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { SynergyNotification } from '../SynergyNotification';

describe('SynergyNotification', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders nothing when notification is undefined', () => {
    const { container } = render(
      <SynergyNotification notification={undefined} onDismiss={() => {}} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders notification content when provided', () => {
    render(
      <SynergyNotification
        notification={{
          id: 'greedy',
          name: 'Greedy',
          description: '+50% floor completion bonus',
        }}
        onDismiss={() => {}}
      />
    );

    expect(screen.getByText('Synergy Discovered')).toBeInTheDocument();
    expect(screen.getByText('Greedy')).toBeInTheDocument();
    expect(screen.getByText('+50% floor completion bonus')).toBeInTheDocument();
  });

  it('auto-dismisses after configured duration', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();

    render(
      <SynergyNotification
        notification={{
          id: 'seer',
          name: 'Seer',
          description: 'Prophecy always triggers at floor start',
        }}
        onDismiss={onDismiss}
        durationMs={500}
      />
    );

    expect(onDismiss).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(onDismiss).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
