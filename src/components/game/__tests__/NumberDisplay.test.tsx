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

  it('should apply blue color for number 1', () => {
    render(<NumberDisplay count={1} />);

    const element = screen.getByText('1');
    expect(element).toHaveClass('text-blue-600');
  });

  it('should apply green color for number 2', () => {
    render(<NumberDisplay count={2} />);

    const element = screen.getByText('2');
    expect(element).toHaveClass('text-green-600');
  });

  it('should apply red color for number 3', () => {
    render(<NumberDisplay count={3} />);

    const element = screen.getByText('3');
    expect(element).toHaveClass('text-red-600');
  });

  it('should apply purple color for number 4', () => {
    render(<NumberDisplay count={4} />);

    const element = screen.getByText('4');
    expect(element).toHaveClass('text-purple-600');
  });

  it('should apply amber color for number 5', () => {
    render(<NumberDisplay count={5} />);

    const element = screen.getByText('5');
    expect(element).toHaveClass('text-amber-600');
  });

  it('should apply cyan color for number 6', () => {
    render(<NumberDisplay count={6} />);

    const element = screen.getByText('6');
    expect(element).toHaveClass('text-cyan-600');
  });

  it('should apply dark gray color for number 7', () => {
    render(<NumberDisplay count={7} />);

    const element = screen.getByText('7');
    expect(element).toHaveClass('text-gray-800');
  });

  it('should apply medium gray color for number 8', () => {
    render(<NumberDisplay count={8} />);

    const element = screen.getByText('8');
    expect(element).toHaveClass('text-gray-600');
  });

  it('should have bold font weight', () => {
    render(<NumberDisplay count={1} />);

    const element = screen.getByText('1');
    expect(element).toHaveClass('font-bold');
  });

  it('should have select-none for no text selection', () => {
    render(<NumberDisplay count={1} />);

    const element = screen.getByText('1');
    expect(element).toHaveClass('select-none');
  });
});
