import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the Dungeon Delver heading', () => {
    render(<App />);
    expect(screen.getByText('DUNGEON DELVER')).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<App />);
    expect(screen.getByText('A roguelike minesweeper adventure')).toBeInTheDocument();
  });
});
