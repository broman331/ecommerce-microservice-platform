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
    promotionCode?: string;
    discountAmount?: number;
    shippingAddressId?: string;
}
