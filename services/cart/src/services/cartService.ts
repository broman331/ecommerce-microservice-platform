import { Cart, CartItem } from '../models/Cart';
import { ICartRepository } from '../dal/ICartRepository';
import { IntegrationService } from './integrationService';

export class CartService {
    private integrationService: IntegrationService;

    constructor(private repository: ICartRepository) {
        this.integrationService = new IntegrationService();
        this.populateMockData(); // Potentially risky in expanded envs, but keeping for parity
    }

    private async populateMockData() {
        // Only populate if empty? Or just for demo. 
        // In real persistent scenarios (Dynamo/Firestore), we probably shouldn't auto-seed on every startup 
        // if data exists. But sticking to existing logic for now, albeit slightly dangerous.
        // Actually, let's skip populating if we are in PRODUCTION or if we want to be clean.
        // The existing controller logic did it on constructor. I'll leave it but maybe make it check emptiness?
        // Since findAll isn't in IRepository (only findByCustomerId), we can't easily check emptiness efficiently.
        // I will commented it out for persistent environments or just leave it for "InMemory" basically.
        // For safe expansion, I'll move it to a specific initialization script or ignore it for now.
        // Let's adapt logic: If we are mocking, we can seed.
        // I'll skip it for now to avoid side effects in DynamoDB/Firestore unless explicitly requested.
    }

    async getCart(customerId: string): Promise<Cart> {
        let cart = await this.repository.findByCustomerId(customerId);
        if (!cart) {
            cart = { customerId, items: [], totalPrice: 0 };
        }
        return cart;
    }

    async addToCart(customerId: string, productId: string, quantity: number): Promise<{ success: boolean; cart?: Cart; error?: string }> {
        // 1. Get Product Details
        const product = await this.integrationService.getProductDetails(productId);
        if (!product) return { success: false, error: 'Product not found' };

        // 2. Check Inventory
        const stock = await this.integrationService.checkInventory(productId);

        let cart = await this.getCart(customerId);

        const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
        const currentQuantity = existingItemIndex > -1 ? cart.items[existingItemIndex].quantity : 0;
        const newQuantity = currentQuantity + quantity;

        if (newQuantity > stock) return { success: false, error: 'Insufficient stock' };

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            cart.items.push({
                productId,
                quantity,
                price: product.price,
                name: product.name,
                image: product.image
            });
        }

        cart.totalPrice = this.calculateTotal(cart);
        await this.repository.createOrUpdate(cart);
        return { success: true, cart };
    }

    async updateCartItem(customerId: string, productId: string, quantity: number): Promise<{ success: boolean; cart?: Cart; error?: string }> {
        const cart = await this.repository.findByCustomerId(customerId);
        if (!cart) return { success: false, error: 'Cart not found' };

        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        if (itemIndex === -1) return { success: false, error: 'Item not in cart' };

        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            const stock = await this.integrationService.checkInventory(productId);
            if (quantity > stock) return { success: false, error: 'Insufficient stock' };
            cart.items[itemIndex].quantity = quantity;
        }

        cart.totalPrice = this.calculateTotal(cart);
        await this.repository.createOrUpdate(cart);
        return { success: true, cart };
    }

    async removeFromCart(customerId: string, productId: string): Promise<{ success: boolean; cart?: Cart; error?: string }> {
        const cart = await this.repository.findByCustomerId(customerId);
        if (!cart) return { success: false, error: 'Cart not found' };

        cart.items = cart.items.filter(item => item.productId !== productId);
        cart.totalPrice = this.calculateTotal(cart);
        await this.repository.createOrUpdate(cart);
        return { success: true, cart };
    }

    async clearCart(customerId: string): Promise<void> {
        await this.repository.delete(customerId);
    }

    async updateShippingAddress(customerId: string, addressId: string): Promise<Cart | undefined> {
        const cart = await this.repository.findByCustomerId(customerId);
        if (!cart) return undefined;

        cart.shippingAddressId = addressId;
        await this.repository.createOrUpdate(cart);
        return cart;
    }

    async validateAndApplyPromotion(customerId: string, code?: string): Promise<{ success: boolean; cart?: Cart; error?: string }> {
        const cart = await this.repository.findByCustomerId(customerId);
        if (!cart) return { success: false, error: 'Cart not found' };

        if (!code) {
            delete cart.promotionCode;
            delete cart.discountAmount;
            cart.totalPrice = this.calculateTotal(cart);
            await this.repository.createOrUpdate(cart);
            return { success: true, cart };
        }

        const result = await this.integrationService.validatePromotion(customerId, code);
        if (!result.valid) return { success: false, error: result.message || 'Invalid promotion code' };

        cart.promotionCode = code;
        cart.discountAmount = result.discountAmount || 0;
        cart.totalPrice = this.calculateTotal(cart);
        await this.repository.createOrUpdate(cart);
        return { success: true, cart };
    }

    async checkout(customerId: string): Promise<{ success: boolean; order?: any; error?: string }> {
        const cart = await this.repository.findByCustomerId(customerId);
        if (!cart || cart.items.length === 0) return { success: false, error: 'Cart is empty or not found' };

        const order = await this.integrationService.createOrder(customerId, cart.items, cart.shippingAddressId);
        if (!order) return { success: false, error: 'Failed to create order' };

        await this.repository.delete(customerId);
        return { success: true, order };
    }

    private calculateTotal(cart: Cart): number {
        const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const discount = cart.discountAmount || 0;
        return Math.max(0, subtotal - discount);
    }
}
