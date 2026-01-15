/**
 * Unit tests for BuffBar component.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BuffBar } from '../BuffBar';
import type { ActiveBuffs } from '../../../types/player';

describe('BuffBar', () => {
  it('renders nothing when no buffs are active', () => {
    const emptyBuffs: ActiveBuffs = {};
    const { container } = render(<BuffBar buffs={emptyBuffs} />);

    expect(container.firstChild).toBeNull();
  });

  it('renders buff icons for active boolean buffs', () => {
    const buffs: ActiveBuffs = {
      extraLife: true,
      goldMagnet: true,
    };
    render(<BuffBar buffs={buffs} />);

    // Check for extra life and gold magnet icons
    expect(screen.getByText('💖')).toBeInTheDocument();
    expect(screen.getByText('🧲')).toBeInTheDocument();
  });

  it('renders buff with charge count for numbered buffs', () => {
    const buffs: ActiveBuffs = {
      forcefield: 3,
    };
    render(<BuffBar buffs={buffs} />);

    // Check for forcefield icon
    expect(screen.getByText('🔮')).toBeInTheDocument();
    // Check for charge count
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('does not render buffs with false values', () => {
    const buffs: ActiveBuffs = {
      extraLife: false,
      steadyHand: true,
    };
    render(<BuffBar buffs={buffs} />);

    // Should not show extra life icon
    expect(screen.queryByText('💖')).not.toBeInTheDocument();
    // Should show steady hand icon
    expect(screen.getByText('🎯')).toBeInTheDocument();
  });

  it('does not render buffs with zero charges', () => {
    const buffs: ActiveBuffs = {
      forcefield: 0,
      goldMagnet: true,
    };
    render(<BuffBar buffs={buffs} />);

    // Should not show forcefield icon (0 charges)
    expect(screen.queryByText('🔮')).not.toBeInTheDocument();
    // Should show gold magnet icon
    expect(screen.getByText('🧲')).toBeInTheDocument();
  });

  it('renders multiple buffs', () => {
    const buffs: ActiveBuffs = {
      extraLife: true,
      goldenGoose: true,
      steadyHand: true,
      forcefield: 2,
    };
    render(<BuffBar buffs={buffs} />);

    expect(screen.getByText('💖')).toBeInTheDocument();
    expect(screen.getByText('🪿')).toBeInTheDocument();
    expect(screen.getByText('🎯')).toBeInTheDocument();
    expect(screen.getByText('🔮')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
