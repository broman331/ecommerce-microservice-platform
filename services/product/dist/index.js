"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3004;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/', productRoutes_1.default); // This mounts /store/products at root level so it becomes localhost:3004/store/products
// Health Check
app.get('/', (req, res) => {
    res.send('Product Service (Aggregator) is running');
});
app.listen(PORT, () => {
    console.log(`Product Service running on port ${PORT}`);
});
