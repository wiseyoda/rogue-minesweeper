import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the Dungeon Delver heading', () => {
    render(<App />);
    expect(screen.getByText('DUNGEON DELVER')).toBeInTheDocument();
  });

  it('renders the POC subtitle', () => {
    render(<App />);
    expect(screen.getByText('Core Logic POC')).toBeInTheDocument();
  });

  it('renders the initial game status', () => {
    render(<App />);
    expect(screen.getByText('Click any cell to start')).toBeInTheDocument();
  });

  it('renders 64 grid cells (8x8)', () => {
    render(<App />);
    const buttons = screen.getAllByRole('button');
    // 64 grid cells + 1 reset button = 65 buttons
    expect(buttons.length).toBe(65);
  });

  it('renders the New Game button', () => {
    render(<App />);
    expect(screen.getByText('New Game')).toBeInTheDocument();
  });
});
