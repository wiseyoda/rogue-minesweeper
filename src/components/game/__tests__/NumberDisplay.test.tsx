/**
 * Tests for NumberDisplay component.
 * @module components/game/__tests__/NumberDisplay.test
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NumberDisplay } from '../NumberDisplay';

describe('NumberDisplay', () => {
  it('should render the number', () => {
    render(<NumberDisplay count={3} />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should apply color style for number 1', () => {
    render(<NumberDisplay count={1} />);

    const element = screen.getByText('1');
    expect(element).toHaveStyle({ color: 'var(--num-1)' });
  });

  it('should apply color style for number 2', () => {
    render(<NumberDisplay count={2} />);

    const element = screen.getByText('2');
    expect(element).toHaveStyle({ color: 'var(--num-2)' });
  });

  it('should apply color style for number 3', () => {
    render(<NumberDisplay count={3} />);

    const element = screen.getByText('3');
    expect(element).toHaveStyle({ color: 'var(--num-3)' });
  });

  it('should apply color style for number 4', () => {
    render(<NumberDisplay count={4} />);

    const element = screen.getByText('4');
    expect(element).toHaveStyle({ color: 'var(--num-4)' });
  });

  it('should apply color style for number 5', () => {
    render(<NumberDisplay count={5} />);

    const element = screen.getByText('5');
    expect(element).toHaveStyle({ color: 'var(--num-5)' });
  });

  it('should apply color style for number 6', () => {
    render(<NumberDisplay count={6} />);

    const element = screen.getByText('6');
    expect(element).toHaveStyle({ color: 'var(--num-6)' });
  });

  it('should apply color style for number 7', () => {
    render(<NumberDisplay count={7} />);

    const element = screen.getByText('7');
    expect(element).toHaveStyle({ color: 'var(--num-7)' });
  });

  it('should apply color style for number 8', () => {
    render(<NumberDisplay count={8} />);

    const element = screen.getByText('8');
    expect(element).toHaveStyle({ color: 'var(--num-8)' });
  });

  it('should have bold font weight', () => {
    render(<NumberDisplay count={1} />);

    const element = screen.getByText('1');
    expect(element).toHaveStyle({ fontWeight: 'bold' });
  });

  it('should have select-none for no text selection', () => {
    render(<NumberDisplay count={1} />);

    const element = screen.getByText('1');
    expect(element).toHaveClass('select-none');
  });
});
