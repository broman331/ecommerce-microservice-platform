"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const router = (0, express_1.Router)();
const orderController = new orderController_1.OrderController();
router.get('/', orderController.getUserOrders.bind(orderController));
router.post('/', orderController.createOrder.bind(orderController));
exports.default = router;
