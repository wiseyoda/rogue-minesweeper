/**
 * ShopItemCard component tests.
 * @module components/shop/__tests__/ShopItemCard.test
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShopItemCard } from '../ShopItemCard';
import type { ShopItem } from '@/types/item';

describe('ShopItemCard', () => {
  const mockItem: ShopItem = {
    id: 'test-item',
    name: 'Test Item',
    description: 'A test item',
    cost: 50,
    rarity: 'common',
    apply: vi.fn(),
  };

  const defaultProps = {
    item: mockItem,
    canAfford: true,
    isPurchased: false,
    onPurchase: vi.fn(),
  };

  it('renders item name', () => {
    render(<ShopItemCard {...defaultProps} />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('renders item description', () => {
    render(<ShopItemCard {...defaultProps} />);
    expect(screen.getByText('A test item')).toBeInTheDocument();
  });

  it('renders item cost on purchase button', () => {
    render(<ShopItemCard {...defaultProps} />);
    expect(screen.getByText('50g')).toBeInTheDocument();
  });

  it('calls onPurchase when button is clicked', () => {
    const onPurchase = vi.fn();
    render(<ShopItemCard {...defaultProps} onPurchase={onPurchase} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onPurchase).toHaveBeenCalledTimes(1);
  });

  it('disables purchase button when cannot afford', () => {
    render(<ShopItemCard {...defaultProps} canAfford={false} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('shows "Purchased" text when item is purchased', () => {
    render(<ShopItemCard {...defaultProps} isPurchased={true} />);

    expect(screen.getByText('Purchased')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('disables purchase button when item is purchased', () => {
    render(<ShopItemCard {...defaultProps} isPurchased={true} />);

    // Button should be replaced with "Purchased" text
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders with uncommon rarity styling', () => {
    const uncommonItem: ShopItem = { ...mockItem, rarity: 'uncommon' };
    const { container } = render(
      <ShopItemCard {...defaultProps} item={uncommonItem} />
    );

    // Check that the card has the ice border color for uncommon
    const card = container.firstChild as HTMLElement;
    expect(card.style.border).toContain('var(--ice)');
  });

  it('renders with rare rarity styling', () => {
    const rareItem: ShopItem = { ...mockItem, rarity: 'rare' };
    const { container } = render(
      <ShopItemCard {...defaultProps} item={rareItem} />
    );

    const card = container.firstChild as HTMLElement;
    expect(card.style.border).toContain('var(--mystic)');
  });

  it('renders with legendary rarity styling', () => {
    const legendaryItem: ShopItem = { ...mockItem, rarity: 'legendary' };
    const { container } = render(
      <ShopItemCard {...defaultProps} item={legendaryItem} />
    );

    const card = container.firstChild as HTMLElement;
    expect(card.style.border).toContain('var(--gold)');
  });

  it('applies reduced opacity when purchased', () => {
    const { container } = render(
      <ShopItemCard {...defaultProps} isPurchased={true} />
    );

    const card = container.firstChild as HTMLElement;
    expect(card.style.opacity).toBe('0.5');
  });
});
