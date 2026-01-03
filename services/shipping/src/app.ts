import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import shippingRoutes from './routes/shippingRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/shipping', shippingRoutes);

// Health Check
app.get('/', (req: Request, res: Response) => {
    res.send('Shipping Service is running');
});

export default app;
