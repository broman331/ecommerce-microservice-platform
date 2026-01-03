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
const customerController_1 = require("./customerController");
const orderGateway_1 = require("../services/orderGateway");
const wishlistGateway_1 = require("../services/wishlistGateway");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Mock dependencies
jest.mock('../services/orderGateway');
jest.mock('../services/wishlistGateway');
jest.mock('jsonwebtoken');
describe('CustomerController', () => {
    let controller;
    let mockReq;
    let mockRes;
    let mockJson;
    let mockStatus;
    beforeEach(() => {
        controller = new customerController_1.CustomerController();
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });
        mockRes = {
            status: mockStatus,
            json: mockJson,
        };
        orderGateway_1.OrderGateway.mockClear();
        wishlistGateway_1.WishlistGateway.mockClear();
        jsonwebtoken_1.default.verify.mockClear();
    });
    describe('getMyOrders', () => {
        it('should return orders for a valid token', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = 'valid-token';
            mockReq = {
                headers: { authorization: `Bearer ${token}` }
            };
            const userId = 'user-123';
            jsonwebtoken_1.default.verify.mockReturnValue({ userId });
            const mockOrders = [{ id: 'order-1' }];
            // Get the mock instance
            const mockOrderGatewayInstance = orderGateway_1.OrderGateway.mock.instances[0];
            // Setup the method mock 
            // Note: Since we clear mocks in beforeEach, instances[0] might be undefined until 'new CustomerController' is called? 
            // Actually 'new CustomerController' is called in the FILE SCOPE of customerController.ts?
            // Wait, customerController.ts does `const orderGateway = new OrderGateway();` at top level.
            // So if I import CustomerController class, that code runs.
            // Jest module mocking happens before imports used.
            // But I cannot easily access the *specific instance* created in that module unless I mock the implementation to return a specific object I control, or use Automatic Mocks.
            // Because the controller imports the class and does `new OrderGateway()`, 
            // and I mocked the class, `orderGateway` in the controller is a mock instance.
            // To define behavior on it, I can do:
            orderGateway_1.OrderGateway.prototype.getOrdersForUser.mockResolvedValue(mockOrders);
            yield controller.getMyOrders(mockReq, mockRes);
            expect(jsonwebtoken_1.default.verify).toHaveBeenCalledWith(token, 'secret');
            expect(orderGateway_1.OrderGateway.prototype.getOrdersForUser).toHaveBeenCalledWith(userId, token);
            expect(mockJson).toHaveBeenCalledWith(mockOrders);
        }));
        it('should return 401 if no token provided', () => __awaiter(void 0, void 0, void 0, function* () {
            mockReq = { headers: {} };
            yield controller.getMyOrders(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(401);
            expect(mockJson).toHaveBeenCalledWith({ message: 'No token provided' });
        }));
    });
});
