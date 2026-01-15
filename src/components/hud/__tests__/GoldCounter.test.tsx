/**
 * Unit tests for GoldCounter component.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GoldCounter } from '../GoldCounter';

describe('GoldCounter', () => {
  it('renders the gold amount', () => {
    render(<GoldCounter amount={42} />);

    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders with gold icon', () => {
    render(<GoldCounter amount={100} />);

    // Check for the gold icon
    expect(screen.getByText('💰')).toBeInTheDocument();
  });

  it('renders zero gold', () => {
    render(<GoldCounter amount={0} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('applies dungeon-gold color class', () => {
    render(<GoldCounter amount={50} />);

    const amountElement = screen.getByText('50');
    expect(amountElement).toHaveClass('text-dungeon-gold');
  });
});
