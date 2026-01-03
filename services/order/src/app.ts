import express, { Request, Response } from 'express';
import cors from 'cors';
import orderRoutes from './routes/orderRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/orders', orderRoutes);

// Health Check
app.get('/', (req: Request, res: Response) => {
    res.send('Order Service is running');
});

export default app;
