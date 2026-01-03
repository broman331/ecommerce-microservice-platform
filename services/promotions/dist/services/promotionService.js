"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionService = void 0;
const axios_1 = __importDefault(require("axios"));
class PromotionService {
    constructor() {
        this.cartServiceUrl = (process.env.CART_SERVICE_URL || 'http://localhost:3007') + '/cart';
        // In-memory promotions store
        this.promotions = [
            { code: 'SAVE10', type: 'PERCENTAGE', value: 10, enabled: true },
            { code: 'MINUS5', type: 'FIXED_AMOUNT', value: 5, minOrderValue: 20, enabled: true },
            { code: 'WELCOME20', type: 'PERCENTAGE', value: 20, minOrderValue: 50, enabled: false },
        ];
    }
    getAllPromotions() {
        return this.promotions;
    }
    createPromotion(promo) {
        if (this.promotions.find(p => p.code === promo.code)) {
            throw new Error('Promotion code already exists');
        }
        // Force uppercase code
        promo.code = promo.code.toUpperCase();
        this.promotions.push(promo);
        return promo;
    }
    togglePromotion(code) {
        const promo = this.promotions.find(p => p.code === code);
        if (!promo) {
            throw new Error('Promotion not found');
        }
        promo.enabled = !promo.enabled;
        return promo;
    }
    applyPromotion(customerId, couponCode) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Fetch Cart
            const cart = yield this.getCart(customerId);
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
            }
            else if (promotion.type === 'FIXED_AMOUNT') {
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
        });
    }
    getCart(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${this.cartServiceUrl}/${customerId}`);
                return response.data;
            }
            catch (error) {
                console.error('Error fetching cart:', error);
                throw new Error('Failed to fetch cart');
            }
        });
    }
}
exports.PromotionService = PromotionService;
