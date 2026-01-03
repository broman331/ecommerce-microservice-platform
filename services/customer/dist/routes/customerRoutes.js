"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerController_1 = require("../controllers/customerController");
const router = (0, express_1.Router)();
const controller = new customerController_1.CustomerController();
// Customer - My Data
router.get('/me/orders', controller.getMyOrders.bind(controller));
router.get('/me/wishlist', controller.getMyWishlist.bind(controller));
router.post('/me/wishlist', controller.addToMyWishlist.bind(controller));
router.delete('/me/wishlist/:productId', controller.removeFromMyWishlist.bind(controller));
// Admin - All Data
router.get('/', controller.getAllCustomers.bind(controller));
router.get('/orders', controller.searchOrders.bind(controller)); // New Search Endpoint
router.get('/:id', controller.getCustomerDetails.bind(controller));
exports.default = router;
