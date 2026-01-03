import { test, expect } from '@playwright/test';

test('dashboard loads recent orders from mock', async ({ page }) => {
    // Mock Customers API (for user filter)
    await page.route('http://localhost:3005/customers', async route => {
        const json = [
            { id: 'u1', name: 'Alice Mock', email: 'alice@test.com' }
        ];
        await route.fulfill({ json });
    });

    // Mock Orders API (searchOrders interaction)
    // URL pattern: http://localhost:3005/customers/orders?period=last_month...
    await page.route('http://localhost:3005/customers/orders*', async route => {
        const json = [
            {
                id: 'order-mock-123',
                userId: 'u1',
                status: 'DELIVERED',
                totalAmount: 99.99,
                items: [],
                createdAt: new Date().toISOString()
            }
        ];
        await route.fulfill({ json });
    });

    // Mock Active Carts (Cart Service port 3007)
    await page.route('http://localhost:3007/cart', async route => {
        await route.fulfill({ json: [] });
    });

    // Mock Promotions (Port 3008)
    await page.route('http://localhost:3008/promotions', async route => {
        await route.fulfill({ json: [] });
    });

    // Navigate to Dashboard
    await page.goto('/');

    // Verify Dashboard Title (RSC rendered)
    await expect(page.getByRole('heading', { name: 'Dashboard Overview' })).toBeVisible();

    // Verify Client-Side Mocked Data
    // "Recent Orders" section should show our mock order
    await expect(page.getByRole('cell', { name: 'Alice Mock' })).toBeVisible(); // Resolved from userId u1
    await expect(page.getByText('order-mock-123')).toBeVisible();
    await expect(page.getByText('$99.99')).toBeVisible();
});
