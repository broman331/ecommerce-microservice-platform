import axios from 'axios';
import { Cart, Promotion, PromotionResponse } from '../models/promotion';
import { IPromotionRepository } from '../dal/IPromotionRepository';

export class PromotionService {
    private cartServiceUrl = (process.env.CART_SERVICE_URL || 'http://localhost:3007') + '/cart';

    constructor(private repository: IPromotionRepository) { }

    public async getAllPromotions(): Promise<Promotion[]> {
        return this.repository.findAll();
    }

    public async createPromotion(promo: Promotion): Promise<Promotion> {
        const existing = await this.repository.findByCode(promo.code);
        if (existing) {
            throw new Error('Promotion code already exists');
        }
        // Force uppercase code
        promo.code = promo.code.toUpperCase();
        return this.repository.save(promo);
    }

    public async togglePromotion(code: string): Promise<Promotion> {
        const promo = await this.repository.findByCode(code);
        if (!promo) {
            throw new Error('Promotion not found');
        }
        promo.enabled = !promo.enabled;
        return this.repository.save(promo);
    }

    public async applyPromotion(customerId: string, couponCode: string): Promise<PromotionResponse> {
        // 1. Fetch Cart
        const cart = await this.getCart(customerId);
        if (!cart || cart.items.length === 0) {
            throw new Error('Cart is empty or not found');
        }

        // 2. Find Promotion
        const promotion = await this.repository.findByCode(couponCode);
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

