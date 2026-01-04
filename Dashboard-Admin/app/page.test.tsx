import { render, screen } from '@testing-library/react';
import Dashboard from './page';
import { ApiClient } from '@/lib/api';
import { vi, describe, it, expect } from 'vitest';

// Mock ApiClient
vi.mock('@/lib/api', () => ({
    ApiClient: {
        getEnrichedProducts: vi.fn(),
    },
}));

// Mock sub-components
vi.mock('@/components/RecentOrders', () => ({ default: () => <div>RecentOrders</div> }));
vi.mock('@/components/PromotionsSection', () => ({ default: () => <div>PromotionsSection</div> }));
vi.mock('@/components/ActiveCarts', () => ({ default: () => <div>ActiveCarts</div> }));

describe('Dashboard Page', () => {
    it('renders dashboard with products', async () => {
        // Setup mock data
        const mockProducts = [
            { id: '1', name: 'Test Product', price: 100, stock: 20, totalOrders: 5, lastOrderedAt: new Date().toISOString() }
        ];
        (ApiClient.getEnrichedProducts as any).mockResolvedValue(mockProducts);

        // Render Async Component
        const ui = await Dashboard();
        render(ui);

        // Assertions
        expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('$100')).toBeInTheDocument();
        expect(screen.getByText('RecentOrders')).toBeInTheDocument();
    });

    it('handles error gracefully when fetching products fails', async () => {
        (ApiClient.getEnrichedProducts as any).mockRejectedValue(new Error('Failed to fetch'));

        // Check if it renders without crashing (products list empty)
        const ui = await Dashboard();
        render(ui);

        expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
        // Assuming table header exists
        expect(screen.getByText('Product Name')).toBeInTheDocument();
    });
});
