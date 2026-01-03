import { Request, Response } from 'express';
import { CustomerController } from './customerController';
import { OrderGateway } from '../services/orderGateway';
import { WishlistGateway } from '../services/wishlistGateway';
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.mock('../services/orderGateway');
jest.mock('../services/wishlistGateway');
jest.mock('jsonwebtoken');

describe('CustomerController', () => {
    let controller: CustomerController;
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        controller = new CustomerController();
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });
        mockRes = {
            status: mockStatus,
            json: mockJson,
        };
        (OrderGateway as jest.Mock).mockClear();
        (WishlistGateway as jest.Mock).mockClear();
        (jwt.verify as jest.Mock).mockClear();
    });

    describe('getMyOrders', () => {
        it('should return orders for a valid token', async () => {
            const token = 'valid-token';
            mockReq = {
                headers: { authorization: `Bearer ${token}` }
            };

            const userId = 'user-123';
            (jwt.verify as jest.Mock).mockReturnValue({ userId });

            const mockOrders = [{ id: 'order-1' }];
            // Get the mock instance
            const mockOrderGatewayInstance = (OrderGateway as jest.Mock).mock.instances[0];
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
            (OrderGateway.prototype.getOrdersForUser as jest.Mock).mockResolvedValue(mockOrders);

            await controller.getMyOrders(mockReq as Request, mockRes as Response);

            expect(jwt.verify).toHaveBeenCalledWith(token, 'secret');
            expect(OrderGateway.prototype.getOrdersForUser).toHaveBeenCalledWith(userId, token);
            expect(mockJson).toHaveBeenCalledWith(mockOrders);
        });

        it('should return 401 if no token provided', async () => {
            mockReq = { headers: {} };
            await controller.getMyOrders(mockReq as Request, mockRes as Response);
            expect(mockStatus).toHaveBeenCalledWith(401);
            expect(mockJson).toHaveBeenCalledWith({ message: 'No token provided' });
        });
    });
});
