/**
 * FloorShop component tests.
 * @module components/shop/__tests__/FloorShop.test
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FloorShop } from '../FloorShop';
import type { ShopItem } from '@/types/item';
import { REROLL_BASE_COST, REROLL_INCREMENT } from '@/data/shopItems';

describe('FloorShop', () => {
  const mockItems: ShopItem[] = [
    {
      id: 'item-1',
      name: 'Item One',
      description: 'First item',
      cost: 30,
      rarity: 'common',
      apply: vi.fn(),
    },
    {
      id: 'item-2',
      name: 'Item Two',
      description: 'Second item',
      cost: 50,
      rarity: 'uncommon',
      apply: vi.fn(),
    },
  ];

  const defaultProps = {
    items: mockItems,
    gold: 100,
    purchasedIds: [] as string[],
    rerollCount: 0,
    onPurchase: vi.fn(),
    onReroll: vi.fn(),
    onContinue: vi.fn(),
  };

  it('renders shop title', () => {
    render(<FloorShop {...defaultProps} />);
    expect(screen.getByText('FLOOR SHOP')).toBeInTheDocument();
  });

  it('displays current gold amount', () => {
    render(<FloorShop {...defaultProps} gold={250} />);
    // Gold is displayed as just the number with a Coin icon
    expect(screen.getByText('250')).toBeInTheDocument();
  });

  it('renders all shop items', () => {
    render(<FloorShop {...defaultProps} />);

    expect(screen.getByText('Item One')).toBeInTheDocument();
    expect(screen.getByText('Item Two')).toBeInTheDocument();
  });

  it('renders reroll button with cost', () => {
    render(<FloorShop {...defaultProps} />);
    expect(screen.getByText(`Reroll (${REROLL_BASE_COST}g)`)).toBeInTheDocument();
  });

  it('shows escalating reroll cost after rerolls', () => {
    render(<FloorShop {...defaultProps} rerollCount={2} />);
    const expectedCost = REROLL_BASE_COST + 2 * REROLL_INCREMENT;
    expect(screen.getByText(`Reroll (${expectedCost}g)`)).toBeInTheDocument();
  });

  it('renders continue button', () => {
    render(<FloorShop {...defaultProps} />);
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it('calls onPurchase when item is purchased', () => {
    const onPurchase = vi.fn();
    render(<FloorShop {...defaultProps} onPurchase={onPurchase} />);

    // Click the first item's purchase button (30g)
    fireEvent.click(screen.getByText('30g'));

    expect(onPurchase).toHaveBeenCalledWith('item-1');
  });

  it('calls onReroll when reroll button is clicked', () => {
    const onReroll = vi.fn();
    render(<FloorShop {...defaultProps} onReroll={onReroll} />);

    fireEvent.click(screen.getByText(`Reroll (${REROLL_BASE_COST}g)`));

    expect(onReroll).toHaveBeenCalledTimes(1);
  });

  it('calls onContinue when continue button is clicked', () => {
    const onContinue = vi.fn();
    render(<FloorShop {...defaultProps} onContinue={onContinue} />);

    fireEvent.click(screen.getByText('Continue'));

    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('disables reroll button when cannot afford', () => {
    render(<FloorShop {...defaultProps} gold={25} />);

    // Reroll costs REROLL_BASE_COST (50g), so with 25g it should be disabled
    const rerollButton = screen.getByText(`Reroll (${REROLL_BASE_COST}g)`).closest('button');
    expect(rerollButton).toBeDisabled();
  });

  it('enables reroll button when can afford', () => {
    render(<FloorShop {...defaultProps} gold={100} />);

    const rerollButton = screen.getByText(`Reroll (${REROLL_BASE_COST}g)`).closest('button');
    expect(rerollButton).not.toBeDisabled();
  });

  it('disables reroll when escalated cost exceeds gold', () => {
    // After 2 rerolls, cost is 50 + 2*25 = 100g
    render(<FloorShop {...defaultProps} gold={75} rerollCount={2} />);

    const expectedCost = REROLL_BASE_COST + 2 * REROLL_INCREMENT;
    const rerollButton = screen.getByText(`Reroll (${expectedCost}g)`).closest('button');
    expect(rerollButton).toBeDisabled();
  });

  it('marks purchased items correctly', () => {
    render(<FloorShop {...defaultProps} purchasedIds={['item-1']} />);

    expect(screen.getByText('Purchased')).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(<FloorShop {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'shop-title');
  });

  it('renders empty shop gracefully', () => {
    render(<FloorShop {...defaultProps} items={[]} />);

    expect(screen.getByText('FLOOR SHOP')).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });
});
