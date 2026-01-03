// Generated from openapi.yaml

export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    enabled: boolean;
}

export interface EnrichedProduct extends Product {
    totalOrders: number;
    lastOrderedAt: string | null;
}

export interface OrderItem {
    productId: string;
    productName?: string;
    name?: string;
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

export interface CartItem {
    productId: string;
    quantity: number;
    price: number;
    name: string;
}

export interface Cart {
    customerId: string;
    items: CartItem[];
    totalPrice: number;
    promotionCode?: string;
    discountAmount?: number;
    shippingAddressId?: string;
}

const PORTS = {
    USER: 3001,
    ORDER: 3002,
    INVENTORY: 3003,
    PRODUCT: 3004,
    CUSTOMER: 3005,
    WISHLIST: 3006,
    CART: 3007,
    PROMOTIONS: 3008,
    SHIPPING: 3009,
};

const isServer = typeof window === 'undefined';

const getBaseUrl = (serviceName: string, port: number) => {
    if (isServer) {
        // In Docker environment, services are accessible by service name
        // e.g., http://order-service:3002
        // We can default to localhost if not in docker (dev mode with separate terminals)
        // But the user asked for "docker setup", so we account for container networking.
        // However, if running `npm run dev` locally outside docker, this might break if we hardcode service names.
        // A robust way is to check an ENV var, e.g. IS_DOCKER.
        // For simplicity in this "setup for docker" request, we can try to rely on env vars or fallbacks.
        // Let's assume standard localhost for development, but mapped names for Docker.
        // Actually, if we use process.env.SERVICE_URL, we can control it via docker-compose.

        switch (serviceName) {
            case 'USER': return process.env.USER_SERVICE_URL || `http://localhost:${port}`;
            case 'ORDER': return process.env.ORDER_SERVICE_URL || `http://localhost:${port}`;
            case 'INVENTORY': return process.env.INVENTORY_SERVICE_URL || `http://localhost:${port}`;
            case 'PRODUCT': return process.env.PRODUCT_SERVICE_URL || `http://localhost:${port}`;
            case 'CUSTOMER': return process.env.CUSTOMER_SERVICE_URL || `http://localhost:${port}`;
            case 'WISHLIST': return process.env.WISHLIST_SERVICE_URL || `http://localhost:${port}`;
            case 'CART': return process.env.CART_SERVICE_URL || `http://localhost:${port}`;
            case 'PROMOTIONS': return process.env.PROMOTIONS_SERVICE_URL || `http://localhost:${port}`;
            case 'SHIPPING': return process.env.SHIPPING_SERVICE_URL || `http://localhost:${port}`;
            default: return `http://localhost:${port}`;
        }
    }
    // Client side always hits localhost (mapped ports) or public URL
    return `http://localhost:${port}`;
}

const BASE_URLS = {
    USER: getBaseUrl('USER', PORTS.USER),
    ORDER: getBaseUrl('ORDER', PORTS.ORDER),
    INVENTORY: getBaseUrl('INVENTORY', PORTS.INVENTORY),
    PRODUCT: getBaseUrl('PRODUCT', PORTS.PRODUCT),
    CUSTOMER: getBaseUrl('CUSTOMER', PORTS.CUSTOMER),
    WISHLIST: getBaseUrl('WISHLIST', PORTS.WISHLIST),
    CART: getBaseUrl('CART', PORTS.CART),
    PROMOTIONS: getBaseUrl('PROMOTIONS', PORTS.PROMOTIONS),
    SHIPPING: getBaseUrl('SHIPPING', PORTS.SHIPPING),
};

export class ApiClient {
    // User Service
    static async login(email: string, password: string) {
        const res = await fetch(`${BASE_URLS.USER}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return res.json();
    }

    static async getProfile(token: string): Promise<User> {
        const res = await fetch(`${BASE_URLS.USER}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.json();
    }

    // Customer Service (Port 3005)
    static async getOrders(token: string): Promise<Order[]> {
        // Changed to call Customer Service which extracts ID from token
        // URL: http://localhost:3005/customers/me/orders
        const res = await fetch(`${BASE_URLS.CUSTOMER}/customers/me/orders`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store'
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
    }

    // Not in original spec, but needed for UI. Assuming Agent B implements GET /orders/:id or we filter client side?
    // Agent B spec at /orders was List.
    // We added /orders (POST, GET).
    // Strictly speaking, Agent B doesn't have /orders/:id yet. 
    // I must add it to Agent B first via "Phase 5 Rule: Update Backend Contract"?
    // Or I can just filter the list from getOrders if I want to be lazy, but that's bad.
    // I will Update Agent B to support GET /orders/:id.

    static async getOrder(id: string): Promise<Order> {
        const res = await fetch(`${BASE_URLS.ORDER}/orders/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch order');
        return res.json();
    }

    static async updateOrderStatus(id: string, status: string): Promise<Order> {
        const res = await fetch(`${BASE_URLS.ORDER}/orders/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!res.ok) throw new Error('Failed to update order status');
        return res.json();
    }

    // Inventory Service (Raw)
    static async getRawProducts(): Promise<Product[]> {
        const res = await fetch(`${BASE_URLS.INVENTORY}/products`, {
            cache: 'no-store'
        });
        return res.json();
    }

    // Product Service (Aggregator - Enriched)
    static async getEnrichedProducts(): Promise<EnrichedProduct[]> {
        const res = await fetch(`${BASE_URLS.PRODUCT}/store/products`, {
            cache: 'no-store'
        });
        // Fallback if service is down for demo resilience?
        if (!res.ok) throw new Error('Product service unreachable');
        return res.json();
    }

    static async getEnrichedProduct(id: string): Promise<EnrichedProduct> {
        const res = await fetch(`${BASE_URLS.PRODUCT}/store/products/${id}`, {
            cache: 'no-store'
        });
        if (!res.ok) throw new Error('Product service unreachable or product not found');
        return res.json();
    }

    static async createProduct(data: Partial<Product>): Promise<EnrichedProduct> {
        const res = await fetch(`${BASE_URLS.PRODUCT}/store/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create product');
        return res.json();
    }

    static async updateProduct(id: string, data: Partial<Product>): Promise<EnrichedProduct> {
        const res = await fetch(`${BASE_URLS.PRODUCT}/store/products/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to update product');
        return res.json();
    }

    // Customer Admin
    static async getCustomers(): Promise<User[]> {
        const res = await fetch(`${BASE_URLS.CUSTOMER}/customers`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch customers');
        return res.json();
    }

    static async getCustomerDetails(id: string): Promise<User & { orders: Order[], wishlist?: { products: any[] } }> {
        const res = await fetch(`${BASE_URLS.CUSTOMER}/customers/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch customer details');
        return res.json();
    }

    static async searchOrders(filters: { userId?: string, period?: string }): Promise<Order[]> {
        const params = new URLSearchParams();
        if (filters.userId) params.append('userId', filters.userId);
        if (filters.period) params.append('period', filters.period);

        const res = await fetch(`${BASE_URLS.CUSTOMER}/customers/orders?${params.toString()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to search orders');
        return res.json();
    }

    // Promotions Service
    static async getPromotions(): Promise<Promotion[]> {
        const res = await fetch(`${BASE_URLS.PROMOTIONS}/promotions`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch promotions');
        return res.json();
    }

    static async createPromotion(promo: Partial<Promotion>): Promise<Promotion> {
        const res = await fetch(`${BASE_URLS.PROMOTIONS}/promotions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(promo)
        });
        if (!res.ok) throw new Error('Failed to create promotion');
        return res.json();
    }

    static async togglePromotion(code: string): Promise<Promotion> {
        const res = await fetch(`${BASE_URLS.PROMOTIONS}/promotions/${code}/toggle`, {
            method: 'POST'
        });
        if (!res.ok) throw new Error('Failed to toggle promotion');
        return res.json();
    }

    // Cart Service
    static async getAllCarts(): Promise<Cart[]> {
        const res = await fetch(`${BASE_URLS.CART}/cart`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch carts');
        return res.json();
    }

    static async addToCart(userId: string, productId: string, quantity: number = 1) {
        const res = await fetch(`${BASE_URLS.CART}/cart/${userId}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity })
        });
        if (!res.ok) throw new Error('Failed to add to cart');
        return res.json();
    }

    static async checkout(userId: string) {
        const res = await fetch(`${BASE_URLS.CART}/cart/${userId}/checkout`, {
            method: 'POST'
        });
        if (!res.ok) throw new Error('Failed to checkout');
        return res.json();
    }

    static async applyPromotion(userId: string, code: string) {
        const res = await fetch(`${BASE_URLS.CART}/cart/${userId}/promotion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Failed to apply promotion');
        }
        return res.json();
    }
    static async setCartAddress(userId: string, addressId: string) {
        const res = await fetch(`${BASE_URLS.CART}/cart/${userId}/address`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ addressId })
        });
        if (!res.ok) throw new Error('Failed to update cart address');
        return res.json();
    }
    // Wishlist Service
    static async addToWishlist(userId: string, productId: string) {
        const res = await fetch(`${BASE_URLS.WISHLIST}/wishlist/${userId}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId })
        });
        if (!res.ok) throw new Error('Failed to add to wishlist');
        return res.json();
    }

    // Shipping Service
    static async getShippingAddresses(userId: string): Promise<ShippingAddress[]> {
        const res = await fetch(`${BASE_URLS.SHIPPING}/shipping/${userId}/addresses`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch shipping addresses');
        return res.json();
    }

    static async addShippingAddress(userId: string, address: Partial<ShippingAddress>) {
        const res = await fetch(`${BASE_URLS.SHIPPING}/shipping/${userId}/addresses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(address)
        });
        if (!res.ok) throw new Error('Failed to add shipping address');
        return res.json();
    }

    static async dispatchShipment(orderId: string, userId: string, addressId: string, items: any[]) {
        const res = await fetch(`${BASE_URLS.SHIPPING}/shipping/dispatch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, userId, addressId, items })
        });
        if (!res.ok) throw new Error('Failed to dispatch shipment');
        return res.json();
    }
}

export interface ShippingAddress {
    id: string;
    userId: string;
    fullName: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface Shipment {
    id: string;
    orderId: string;
    userId: string;
    distributorId: string;
    status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
    trackingNumber: string;
    shippedAt: string;
    items: any[];
}

export interface Promotion {
    code: string;
    type: 'PERCENTAGE' | 'FIXED_AMOUNT';
    value: number;
    minOrderValue?: number;
    enabled: boolean;
}
