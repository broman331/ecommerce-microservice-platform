import express, { Request, Response } from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

// Routes
app.use('/', productRoutes); // This mounts /store/products at root level so it becomes localhost:3004/store/products

// Health Check
app.get('/', (req: Request, res: Response) => {
    res.send('Product Service (Aggregator) is running');
});

app.listen(PORT, () => {
    console.log(`Product Service running on port ${PORT}`);
});
