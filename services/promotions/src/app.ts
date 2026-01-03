import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import promotionRoutes from './routes/promotionRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/promotions', promotionRoutes);

// Health Check
app.get('/', (req: Request, res: Response) => {
    res.send('Promotions Service is running');
});

export default app;
