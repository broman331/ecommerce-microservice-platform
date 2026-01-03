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
exports.OrderGateway = void 0;
const axios_1 = __importDefault(require("axios"));
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3002';
class OrderGateway {
    getOrdersForUser(userId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${ORDER_SERVICE_URL}/orders?userId=${userId}`);
                return response.data;
            }
            catch (error) {
                console.error("Failed to fetch orders from order service", error);
                return [];
            }
        });
    }
    searchOrders(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = new URLSearchParams();
                if (filters.userId && filters.userId !== 'all')
                    params.append('userId', filters.userId);
                if (filters.startDate)
                    params.append('startDate', filters.startDate);
                if (filters.endDate)
                    params.append('endDate', filters.endDate);
                const response = yield axios_1.default.get(`${ORDER_SERVICE_URL}/orders/search?${params.toString()}`);
                return response.data;
            }
            catch (error) {
                console.error("Failed to search orders", error);
                return [];
            }
        });
    }
}
exports.OrderGateway = OrderGateway;
