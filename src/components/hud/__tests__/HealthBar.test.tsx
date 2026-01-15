/**
 * Unit tests for HealthBar component.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HealthBar } from '../HealthBar';

describe('HealthBar', () => {
  it('renders the progress bar', () => {
    render(<HealthBar current={3} max={5} />);

    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
  });

  it('renders numeric current/max display', () => {
    render(<HealthBar current={2} max={5} />);

    expect(screen.getByText('2/5')).toBeInTheDocument();
  });

  it('sets correct aria values', () => {
    render(<HealthBar current={3} max={5} />);

    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '3');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '5');
  });

  it('calculates percentage width correctly', () => {
    const { container } = render(<HealthBar current={2} max={4} />);

    // Find the inner bar with the percentage width
    const innerBar = container.querySelector('.bg-dungeon-blood');
    expect(innerBar).toHaveStyle({ width: '50%' });
  });

  it('handles zero max without error', () => {
    render(<HealthBar current={0} max={0} />);

    expect(screen.getByText('0/0')).toBeInTheDocument();
  });

  it('renders heart icon', () => {
    render(<HealthBar current={3} max={3} />);

    expect(screen.getByText('❤️')).toBeInTheDocument();
  });
});
