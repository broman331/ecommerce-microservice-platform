import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cartRoutes from './routes/cartRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3007;

app.use(cors());
app.use(express.json());

// Routes
app.use('/cart', cartRoutes);

// Health Check
app.get('/', (req: Request, res: Response) => {
    res.send('Cart Service is running');
});

app.listen(PORT, () => {
    console.log(`Cart Service running on port ${PORT}`);
});
