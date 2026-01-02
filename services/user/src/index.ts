import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Health Check
app.get('/', (req: Request, res: Response) => {
    res.send('User Service is running');
});

app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});
