"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3002;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/orders', orderRoutes_1.default);
// Health Check
app.get('/', (req, res) => {
    res.send('Order Service is running');
});
app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});
