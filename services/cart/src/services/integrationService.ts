import axios from 'axios';

export class IntegrationService {
    private productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3004';
    private inventoryServiceUrl = process.env.INVENTORY_SERVICE_URL || 'http://localhost:3003';
    private orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:3002';
    private promotionServiceUrl = process.env.PROMOTIONS_SERVICE_URL || 'http://localhost:3008';

    async getProductDetails(productId: string) {
        try {
            const response = await axios.get(`${this.productServiceUrl}/store/products/${productId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product ${productId}:`, error);
            return null;
        }
    }

    async getAllProducts() {
        try {
            const response = await axios.get(`${this.productServiceUrl}/store/products`);
            return response.data;
        } catch (error) {
            console.error('Error fetching all products:', error);
            return [];
            return [];
        }
    }

    async validatePromotion(customerId: string, code: string): Promise<{ valid: boolean; discountAmount?: number; message?: string }> {
        try {
            // Call Promotions Service /apply endpoint
            // It expects { customerId, couponCode }
            const response = await axios.post(`${this.promotionServiceUrl}/promotions/apply`, {
                customerId,
                couponCode: code
            });

            // Expected response from PromotionController.apply:
            // { valid: boolean, discount: number, message: string }
            // Note: Promotion service calls it 'discount', we map it to 'discountAmount' or keep as is.
            // Let's check promotion controller... it returns result.
            // PromotionService.applyPromotion returns: { valid: boolean; message?: string; discount?: number }

            return {
                valid: response.data.valid,
                discountAmount: response.data.discount,
                message: response.data.message
            };
        } catch (error: any) {
            console.error('Error validating promotion:', error.response?.data || error.message);
            return {
                valid: false,
                message: error.response?.data?.error || 'Failed to apply promotion'
            };
        }
    }

    async checkInventory(productId: string): Promise<number> {
        try {
            // Assuming inventory service has an endpoint to get product details including stock
            // Based on previous research: Inventory service has /products/:id
            const response = await axios.get(`${this.inventoryServiceUrl}/products/${productId}`);
            return response.data.stock || 0;
        } catch (error) {
            console.error(`Error checking inventory for ${productId}:`, error);
            return 0;
        }
    }

    async createOrder(customerId: string, items: any[], shippingAddressId?: string) {
        try {
            const response = await axios.post(`${this.orderServiceUrl}/orders`, { items, shippingAddressId }, {
                headers: { 'x-user-id': customerId }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            return null;
        }
    }
}
