export interface CartItem {
    productId: string;
    quantity: number;
    price: number;
    name: string;
    image: string;
}

export interface Cart {
    customerId: string;
    items: CartItem[];
    totalPrice: number;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
}

export interface Promotion {
    code: string;
    type: 'PERCENTAGE' | 'FIXED_AMOUNT';
    value: number;
    minOrderValue?: number;
    enabled: boolean;
}

export interface PromotionResponse {
    valid: boolean;
    originalTotal?: number;
    discount?: number; // matched with cart service expectation
    discountAmount?: number; // legacy/internal
    finalTotal?: number;
    message?: string;
}
