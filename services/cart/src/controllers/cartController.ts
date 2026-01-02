import { Request, Response } from 'express';
import { Cart, CartItem } from '../models/Cart';
import { IntegrationService } from '../services/integrationService';

export class CartController {
    private carts: Map<string, Cart> = new Map();
    private integrationService: IntegrationService;

    constructor() {
        this.integrationService = new IntegrationService();
        this.populateMockData();
    }

    private async populateMockData() {
        console.log("Populating mock carts...");
        // Give other services a moment to start if running concurrently
        await new Promise(resolve => setTimeout(resolve, 2000));

        const products = await this.integrationService.getAllProducts();
        if (!products || products.length === 0) {
            console.warn("No products found to populate carts.");
            return;
        }

        const userIds = Array.from({ length: 10 }, (_, i) => String(i + 1));

        for (const userId of userIds) {
            const numItems = Math.floor(Math.random() * 3) + 3; // 3 to 5 items
            const cartItems: CartItem[] = [];

            for (let i = 0; i < numItems; i++) {
                const randomProduct = products[Math.floor(Math.random() * products.length)];
                // Avoid duplicates in this simple mock logic or just let them accumulate quantity
                const existing = cartItems.find(p => p.productId === randomProduct.id);
                if (existing) {
                    existing.quantity += 1;
                } else {
                    cartItems.push({
                        productId: randomProduct.id,
                        quantity: 1,
                        price: randomProduct.price,
                        name: randomProduct.name,
                        image: randomProduct.image
                    });
                }
            }

            const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            this.carts.set(userId, {
                customerId: userId,
                items: cartItems,
                totalPrice: totalPrice
            });
        }
        console.log(`Populated carts for ${userIds.length} users.`);
    }

    // Helper to calculate total price
    private calculateTotal(cart: Cart): number {
        const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const discount = cart.discountAmount || 0;
        return Math.max(0, subtotal - discount);
    }

    getCart(req: Request, res: Response): Promise<void> {
        return new Promise((resolve) => {
            const { customerId } = req.params;
            const cart = this.carts.get(customerId) || { customerId, items: [], totalPrice: 0 };
            res.json(cart);
            resolve();
        });
    }

    getAllCarts(req: Request, res: Response): Promise<void> {
        return new Promise((resolve) => {
            const allCarts = Array.from(this.carts.values());
            res.json(allCarts);
            resolve();
        });
    }

    async addToCart(req: Request, res: Response): Promise<void> {
        const { customerId } = req.params;
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity <= 0) {
            res.status(400).json({ error: 'Invalid product ID or quantity' });
            return;
        }

        // 1. Get Product Details (Price, Name, Image)
        const product = await this.integrationService.getProductDetails(productId);
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        // 2. Check Inventory
        const stock = await this.integrationService.checkInventory(productId);

        let cart = this.carts.get(customerId);
        if (!cart) {
            cart = { customerId, items: [], totalPrice: 0 };
            this.carts.set(customerId, cart);
        }

        const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
        const currentQuantity = existingItemIndex > -1 ? cart.items[existingItemIndex].quantity : 0;
        const newQuantity = currentQuantity + quantity;

        if (newQuantity > stock) {
            res.status(400).json({ error: 'Insufficient stock' });
            return;
        }

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
        res.status(200).json(cart);
    }

    async updateCartItem(req: Request, res: Response): Promise<void> {
        const { customerId, productId } = req.params;
        const { quantity } = req.body;

        const cart = this.carts.get(customerId);
        if (!cart) {
            res.status(404).json({ error: 'Cart not found' });
            return;
        }

        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        if (itemIndex === -1) {
            res.status(404).json({ error: 'Item not in cart' });
            return;
        }

        if (quantity <= 0) {
            // If quantity is 0 or less, remove the item
            cart.items.splice(itemIndex, 1);
        } else {
            // Check inventory for the new quantity
            const stock = await this.integrationService.checkInventory(productId);
            if (quantity > stock) {
                res.status(400).json({ error: 'Insufficient stock' });
                return;
            }
            cart.items[itemIndex].quantity = quantity;
        }

        cart.totalPrice = this.calculateTotal(cart);
        res.json(cart);
    }

    removeFromCart(req: Request, res: Response): Promise<void> {
        return new Promise((resolve) => {
            const { customerId, productId } = req.params;
            const cart = this.carts.get(customerId);

            if (cart) {
                cart.items = cart.items.filter(item => item.productId !== productId);
                cart.totalPrice = this.calculateTotal(cart);
                res.json(cart);
            } else {
                res.status(404).json({ error: 'Cart not found' });
            }
            resolve();
        });
    }

    clearCart(req: Request, res: Response): Promise<void> {
        return new Promise((resolve) => {
            const { customerId } = req.params;
            this.carts.delete(customerId);
            res.status(204).send();
            resolve();
        });
    }

    async updateShippingAddress(req: Request, res: Response): Promise<void> {
        const { customerId } = req.params;
        const { addressId } = req.body;

        const cart = this.carts.get(customerId);
        if (!cart) {
            res.status(404).json({ error: 'Cart not found' });
            return;
        }

        cart.shippingAddressId = addressId;
        res.json(cart);
    }

    async checkout(req: Request, res: Response): Promise<void> {
        const { customerId } = req.params;
        const cart = this.carts.get(customerId);

        if (!cart || cart.items.length === 0) {
            res.status(400).json({ error: 'Cart is empty or not found' });
            return;
        }

        // Pass shipping address if present
        const order = await this.integrationService.createOrder(customerId, cart.items, cart.shippingAddressId);
        if (!order) {
            res.status(500).json({ error: 'Failed to create order' });
            return;
        }

        // Clear cart after successful checkout
        this.carts.delete(customerId);

        res.status(201).json(order);
    }

    async applyPromotion(req: Request, res: Response): Promise<void> {
        const { customerId } = req.params;
        const { code } = req.body;

        const cart = this.carts.get(customerId);
        if (!cart) {
            res.status(404).json({ error: 'Cart not found' });
            return;
        }

        if (!code) {
            // If code is empty, remove promotion
            delete cart.promotionCode;
            delete cart.discountAmount;
            cart.totalPrice = this.calculateTotal(cart);
            res.json(cart);
            return;
        }

        const result = await this.integrationService.validatePromotion(customerId, code);

        if (!result.valid) {
            res.status(400).json({ error: result.message || 'Invalid promotion code' });
            return;
        }

        cart.promotionCode = code;
        cart.discountAmount = result.discountAmount || 0;
        cart.totalPrice = this.calculateTotal(cart);

        res.json(cart);
    }
}
