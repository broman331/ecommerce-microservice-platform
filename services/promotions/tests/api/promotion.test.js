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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const axios_1 = __importDefault(require("axios"));
jest.mock('axios');
const mockedAxios = axios_1.default;
describe('Promotions Service API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('GET /promotions', () => {
        it('should return default promotions', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default).get('/promotions');
            expect(res.status).toBe(200);
            expect(res.body.some((p) => p.code === 'SAVE10')).toBe(true);
        }));
    });
    describe('POST /promotions', () => {
        it('should create promotion', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default).post('/promotions').send({
                code: 'NEWPROMO',
                type: 'PERCENTAGE',
                value: 5
            });
            expect(res.status).toBe(201);
            expect(res.body.code).toBe('NEWPROMO');
        }));
    });
    describe('POST /promotions/apply', () => {
        it('should apply promotion to valid cart', () => __awaiter(void 0, void 0, void 0, function* () {
            mockedAxios.get.mockResolvedValue({
                data: { totalPrice: 100, items: [{}] }
            });
            const res = yield (0, supertest_1.default)(app_1.default).post('/promotions/apply').send({
                customerId: 'user-1',
                couponCode: 'SAVE10'
            });
            expect(res.status).toBe(200);
            expect(res.body.valid).toBe(true);
            expect(res.body.discount).toBe(10); // 10% of 100
            expect(res.body.finalTotal).toBe(90);
        }));
        it('should fail if coupon invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            mockedAxios.get.mockResolvedValue({
                data: { totalPrice: 100, items: [{}] }
            });
            const res = yield (0, supertest_1.default)(app_1.default).post('/promotions/apply').send({
                customerId: 'user-1',
                couponCode: 'INVALID'
            });
            expect(res.status).toBe(400);
        }));
    });
});
