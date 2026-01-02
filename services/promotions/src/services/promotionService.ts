import axios from 'axios';
import { Cart, Promotion, PromotionResponse } from '../models/promotion';

export class PromotionService {
    private cartServiceUrl = (process.env.CART_SERVICE_URL || 'http://localhost:3007') + '/cart';

    // In-memory promotions store
    private promotions: Promotion[] = [
        { code: 'SAVE10', type: 'PERCENTAGE', value: 10, enabled: true },
        { code: 'MINUS5', type: 'FIXED_AMOUNT', value: 5, minOrderValue: 20, enabled: true },
        { code: 'WELCOME20', type: 'PERCENTAGE', value: 20, minOrderValue: 50, enabled: false },
    ];

    public getAllPromotions(): Promotion[] {
        return this.promotions;
    }

    public createPromotion(promo: Promotion): Promotion {
        if (this.promotions.find(p => p.code === promo.code)) {
            throw new Error('Promotion code already exists');
        }
        // Force uppercase code
        promo.code = promo.code.toUpperCase();
        this.promotions.push(promo);
        return promo;
    }

    public togglePromotion(code: string): Promotion {
        const promo = this.promotions.find(p => p.code === code);
        if (!promo) {
            throw new Error('Promotion not found');
        }
        promo.enabled = !promo.enabled;
        return promo;
    }

    public async applyPromotion(customerId: string, couponCode: string): Promise<PromotionResponse> {
        // 1. Fetch Cart
        const cart = await this.getCart(customerId);
        if (!cart || cart.items.length === 0) {
            throw new Error('Cart is empty or not found');
        }

        // 2. Find Promotion
        const promotion = this.promotions.find(p => p.code === couponCode);
        if (!promotion) {
            throw new Error('Invalid coupon code');
        }

        if (!promotion.enabled) {
            throw new Error('This coupon is currently disabled');
        }

        // 3. Validate Rules
        if (promotion.minOrderValue && cart.totalPrice < promotion.minOrderValue) {
            throw new Error(`Minimum order value of $${promotion.minOrderValue} required for this coupon`);
        }

        // 4. Calculate Discount
        let discountAmount = 0;
        if (promotion.type === 'PERCENTAGE') {
            discountAmount = (cart.totalPrice * promotion.value) / 100;
        } else if (promotion.type === 'FIXED_AMOUNT') {
            discountAmount = promotion.value;
        }

        // Ensure discount doesn't exceed total
        if (discountAmount > cart.totalPrice) {
            discountAmount = cart.totalPrice;
        }

        const finalTotal = cart.totalPrice - discountAmount;

        return {
            valid: true,
            originalTotal: cart.totalPrice,
            discount: parseFloat(discountAmount.toFixed(2)),
            discountAmount: parseFloat(discountAmount.toFixed(2)),
            finalTotal: parseFloat(finalTotal.toFixed(2)),
            message: 'Coupon applied successfully'
        };
    }

    private async getCart(customerId: string): Promise<Cart> {
        try {
            const response = await axios.get(`${this.cartServiceUrl}/${customerId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching cart:', error);
            throw new Error('Failed to fetch cart');
        }
    }
}
