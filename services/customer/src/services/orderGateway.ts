import axios from 'axios';

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3002/orders';

export class OrderGateway {
    async getOrdersForUser(userId: string, token: string) {
        // In a real app, pass the token or use a system token
        try {
            const response = await axios.get(`${ORDER_SERVICE_URL}/orders?userId=${userId}`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch orders from order service", error);
            return [];
        }
    }

    async searchOrders(filters: { userId?: string, startDate?: string, endDate?: string }) {
        try {
            const params = new URLSearchParams();
            if (filters.userId && filters.userId !== 'all') params.append('userId', filters.userId);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);

            const response = await axios.get(`${ORDER_SERVICE_URL}/orders/search?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error("Failed to search orders", error);
            return [];
        }
    }
}
