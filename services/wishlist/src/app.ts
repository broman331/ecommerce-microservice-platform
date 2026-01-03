import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import wishlistRoutes from './routes/wishlistRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/wishlist', wishlistRoutes);

// Health Check
app.get('/', (req: Request, res: Response) => {
    res.send('Wishlist Service is running');
});

export default app;
