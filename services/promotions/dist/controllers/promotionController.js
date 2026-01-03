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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionController = void 0;
const promotionService_1 = require("../services/promotionService");
class PromotionController {
    constructor() {
        this.promotionService = new promotionService_1.PromotionService();
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const promotions = this.promotionService.getAllPromotions();
            res.json(promotions);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promo = req.body;
                // Basic validation
                if (!promo.code || !promo.type || !promo.value) {
                    res.status(400).json({ error: 'Missing required fields: code, type, value' });
                    return;
                }
                // Default enabled
                if (promo.enabled === undefined)
                    promo.enabled = true;
                const newPromo = this.promotionService.createPromotion(promo);
                res.status(201).json(newPromo);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    toggle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code } = req.params;
                const updated = this.promotionService.togglePromotion(code);
                res.json(updated);
            }
            catch (error) {
                res.status(404).json({ error: error.message });
            }
        });
    }
    apply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { customerId, couponCode } = req.body;
                if (!customerId || !couponCode) {
                    res.status(400).json({ error: 'customerId and couponCode are required' });
                    return;
                }
                const result = yield this.promotionService.applyPromotion(customerId, couponCode);
                res.json(result);
            }
            catch (error) {
                res.status(400).json({ error: error.message || 'Failed to apply promotion' });
            }
        });
    }
}
exports.PromotionController = PromotionController;
