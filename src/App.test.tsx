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

  it('renders the subtitle', () => {
    render(<App />);
    expect(screen.getByText('Roguelike Minesweeper')).toBeInTheDocument();
  });

  it('renders the sidebar with DM Panel', () => {
    render(<App />);
    // DM Panel shows "WATCHING" status indicator
    expect(screen.getByText('WATCHING')).toBeInTheDocument();
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
