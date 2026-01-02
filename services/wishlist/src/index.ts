import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import wishlistRoutes from './routes/wishlistRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());

// Routes
app.use('/wishlist', wishlistRoutes);

// Health Check
app.get('/', (req: Request, res: Response) => {
    res.send('Wishlist Service is running');
});

app.listen(PORT, () => {
    console.log(`Wishlist Service running on port ${PORT}`);
});
