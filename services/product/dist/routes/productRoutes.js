"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const router = (0, express_1.Router)();
const controller = new productController_1.ProductController();
router.get('/store/products', controller.getAll.bind(controller));
router.get('/store/products/:id', controller.getById.bind(controller));
// Also expose a root health check or simple list?
// Using the path defined in OpenAPI: /store/products
exports.default = router;
