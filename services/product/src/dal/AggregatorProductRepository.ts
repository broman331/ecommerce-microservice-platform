import axios from 'axios';
import { IProductRepository } from './IProductRepository';
import { EnrichedProduct } from '../services/aggregatorService';

interface InventoryProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    enabled: boolean;
}

interface Order {
    id: string;
    items: { productId: string; quantity: number }[];
    createdAt: string;
}

const INVENTORY_URL = process.env.INVENTORY_SERVICE_URL || 'http://localhost:3003/products';
const ORDER_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3002/orders';

export class AggregatorProductRepository implements IProductRepository {
    async getAll(): Promise<EnrichedProduct[]> {
        const productRes = await axios.get<InventoryProduct[]>(INVENTORY_URL);
        const products = productRes.data;

        let orders: Order[] = [];
        try {
            const orderRes = await axios.get<Order[]>(ORDER_URL, { headers: { 'x-user-id': '1' } });
            orders = orderRes.data;
        } catch (e) { console.error("Failed to fetch orders", e); }

        return products.map(p => this.enrich(p, orders));
    }

    async getById(id: string): Promise<EnrichedProduct | null> {
        try {
            const productRes = await axios.get<InventoryProduct>(`${INVENTORY_URL}/${id}`);
            const product = productRes.data;

            let orders: Order[] = [];
            try {
                const orderRes = await axios.get<Order[]>(ORDER_URL, { headers: { 'x-user-id': '1' } });
                orders = orderRes.data;
            } catch (e) { }

            return this.enrich(product, orders);
        } catch (e) { return null; }
    }

    async create(data: any): Promise<EnrichedProduct> {
        const res = await axios.post<InventoryProduct>(INVENTORY_URL, data);
        return { ...res.data, totalOrders: 0, lastOrderedAt: null };
    }

    async update(id: string, data: any): Promise<EnrichedProduct> {
        const res = await axios.patch<InventoryProduct>(`${INVENTORY_URL}/${id}`, data);
        // Optimized: just return with defaults or re-fetch if we wanted strict correctness
        return { ...res.data, totalOrders: 0, lastOrderedAt: null };
    }

    private enrich(product: InventoryProduct, orders: Order[]): EnrichedProduct {
        const relevantOrders = orders.filter(o => o.items.some(i => i.productId === product.id));
        let lastOrderedAt: string | null = null;
        if (relevantOrders.length > 0) {
            relevantOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            lastOrderedAt = relevantOrders[0].createdAt;
        }
        return { ...product, totalOrders: relevantOrders.length, lastOrderedAt };
    }
}
