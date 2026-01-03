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
exports.CustomerController = void 0;
const orderGateway_1 = require("../services/orderGateway");
const wishlistGateway_1 = require("../services/wishlistGateway");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
const orderGateway = new orderGateway_1.OrderGateway();
const wishlistGateway = new wishlistGateway_1.WishlistGateway();
// Cheap hack: In a real system we'd share the secret via env vars.
// Assuming "secret" from User Service (Agent A).
const JWT_SECRET = 'secret';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';
class CustomerController {
    getMyOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'No token provided' });
            }
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
                const userId = decoded.userId; // Agent A signs with { userId: ... }
                if (!userId) {
                    return res.status(401).json({ message: 'Invalid token payload' });
                }
                const orders = yield orderGateway.getOrdersForUser(userId, token);
                res.json(orders);
            }
            catch (err) {
                console.error("Token verification failed", err);
                return res.status(401).json({ message: 'Invalid token' });
            }
        });
    }
    getMyWishlist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'No token provided' });
            }
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
                const userId = decoded.userId;
                if (!userId) {
                    return res.status(401).json({ message: 'Invalid token payload' });
                }
                const wishlist = yield wishlistGateway.getWishlist(userId);
                res.json(wishlist);
            }
            catch (err) {
                console.error("Token verification failed", err);
                return res.status(401).json({ message: 'Invalid token' });
            }
        });
    }
    addToMyWishlist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'No token provided' });
            }
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
                const userId = decoded.userId;
                if (!userId) {
                    return res.status(401).json({ message: 'Invalid token payload' });
                }
                const { productId } = req.body;
                if (!productId) {
                    return res.status(400).json({ message: 'ProductId is required' });
                }
                const result = yield wishlistGateway.addToWishlist(userId, productId);
                res.json(result);
            }
            catch (err) {
                console.error("Add to wishlist failed", err);
                return res.status(500).json({ message: 'Failed to add to wishlist' });
            }
        });
    }
    removeFromMyWishlist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'No token provided' });
            }
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
                const userId = decoded.userId;
                const { productId } = req.params;
                const result = yield wishlistGateway.removeFromWishlist(userId, productId);
                res.json(result);
            }
            catch (err) {
                console.error("Remove from wishlist failed", err);
                return res.status(500).json({ message: 'Failed to remove from wishlist' });
            }
        });
    }
    // Admin: Get All Customers (Proxy User Service)
    getAllCustomers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Call User Service
            try {
                const response = yield axios_1.default.get(`${USER_SERVICE_URL}/users`);
                res.json(response.data);
            }
            catch (e) {
                console.error(e);
                res.status(500).json({ message: 'Failed to fetch customers' });
            }
        });
    }
    // Admin: Get Customer Details + Orders + Wishlist
    getCustomerDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                // 1. Get User Profile
                const userRes = yield axios_1.default.get(`${USER_SERVICE_URL}/users/${id}`);
                const user = userRes.data;
                // 2. Get Orders (As Admin/System)
                const orders = yield orderGateway.getOrdersForUser(id, 'system-token');
                // 3. Get Wishlist
                const wishlist = yield wishlistGateway.getWishlist(id);
                res.json(Object.assign(Object.assign({}, user), { orders,
                    wishlist }));
            }
            catch (e) {
                console.error(e);
                res.status(404).json({ message: 'Customer or data not found' });
            }
        });
    }
    // Admin: Search Orders (Global)
    searchOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, period } = req.query;
            let startDate;
            const now = new Date();
            if (period === 'last_day') {
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
            }
            else if (period === 'last_week') {
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
            }
            else if (period === 'last_month') {
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
            }
            else if (period === 'last_year') {
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
            }
            const orders = yield orderGateway.searchOrders({
                userId: userId,
                startDate
            });
            res.json(orders);
        });
    }
}
exports.CustomerController = CustomerController;
