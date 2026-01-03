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
exports.WishlistGateway = void 0;
const axios_1 = __importDefault(require("axios"));
const WISHLIST_SERVICE_URL = process.env.WISHLIST_SERVICE_URL || 'http://localhost:3006';
class WishlistGateway {
    getWishlist(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${WISHLIST_SERVICE_URL}/wishlist/${userId}`);
                return response.data;
            }
            catch (error) {
                console.error("Failed to fetch wishlist", error);
                // Return empty wishlist on failure to maintain resilience
                return { userId, products: [] };
            }
        });
    }
    addToWishlist(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post(`${WISHLIST_SERVICE_URL}/wishlist/${userId}/add`, { productId });
                return response.data;
            }
            catch (error) {
                console.error("Failed to add to wishlist", error);
                throw error;
            }
        });
    }
    removeFromWishlist(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.delete(`${WISHLIST_SERVICE_URL}/wishlist/${userId}/remove/${productId}`);
                return response.data;
            }
            catch (error) {
                console.error("Failed to remove from wishlist", error);
                throw error;
            }
        });
    }
}
exports.WishlistGateway = WishlistGateway;
