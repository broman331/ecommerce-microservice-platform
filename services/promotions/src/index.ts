import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import promotionRoutes from './routes/promotionRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3008;

app.use(cors());
app.use(express.json());

// Routes
app.use('/promotions', promotionRoutes);

// Health Check
app.get('/', (req: Request, res: Response) => {
    res.send('Promotions Service is running');
});

app.listen(PORT, () => {
    console.log(`Promotions Service running on port ${PORT}`);
});
