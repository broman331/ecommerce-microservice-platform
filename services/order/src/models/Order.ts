export interface OrderItem {
    productId: string;
    quantity: number;
    priceAtPurchase: number;
}

export interface Order {
    id: string;
    userId: string;
    status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED';
    totalAmount: number;
    items: OrderItem[];
    createdAt: string;
    shippingAddressId?: string;
}

// Mock Database
const generateMockOrders = () => {
    const orders: Order[] = [];
    const userIds = Array.from({ length: 10 }, (_, i) => (i + 1).toString()); // '1'...'10'
    const now = new Date();

    userIds.forEach(userId => {
        const numOrders = Math.floor(Math.random() * 16) + 5; // 5 to 20
        for (let i = 0; i < numOrders; i++) {
            const monthsBack = Math.random() * 24;
            const date = new Date(now.getTime() - monthsBack * 30 * 24 * 60 * 60 * 1000);

            orders.push({
                id: `order-${userId}-${i}`,
                userId,
                status: Math.random() > 0.5 ? 'DELIVERED' : 'SHIPPED',
                totalAmount: Math.floor(Math.random() * 500) + 50,
                items: [
                    { productId: '1', quantity: 1, priceAtPurchase: 50 }
                ],
                createdAt: date.toISOString()
            });
        }
    });
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const orders: Order[] = generateMockOrders();
