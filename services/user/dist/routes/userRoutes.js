"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const userController = new userController_1.UserController();
router.get('/profile', authMiddleware_1.authenticateJWT, userController.getProfile.bind(userController));
exports.default = router;
