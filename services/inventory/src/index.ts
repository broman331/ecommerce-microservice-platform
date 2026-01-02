import express, { Request, Response } from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Routes
app.use('/products', productRoutes);

// Health Check
app.get('/', (req: Request, res: Response) => {
    res.send('Inventory Service is running');
});

app.listen(PORT, () => {
    console.log(`Inventory Service running on port ${PORT}`);
});
