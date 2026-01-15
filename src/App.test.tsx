import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';
import { useGameStore } from '@/stores';

describe('App', () => {
  beforeEach(() => {
    // Reset store to default state before each test
    useGameStore.getState().reset();
  });

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

  it('renders grid cells based on gridConfig', () => {
    render(<App />);
    const { gridConfig } = useGameStore.getState();
    const buttons = screen.getAllByRole('button');
    // grid cells + 1 reset button
    const expectedCount = gridConfig.rows * gridConfig.cols + 1;
    expect(buttons.length).toBe(expectedCount);
  });

  it('renders the New Game button', () => {
    render(<App />);
    expect(screen.getByText('New Game')).toBeInTheDocument();
  });
});
