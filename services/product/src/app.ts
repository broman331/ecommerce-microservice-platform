import express, { Request, Response } from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/', productRoutes);

// Health Check
app.get('/', (req: Request, res: Response) => {
    res.send('Product Service (Aggregator) is running');
});

export default app;
