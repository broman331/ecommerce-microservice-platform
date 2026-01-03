import express from 'express';
import cors from 'cors';
import customerRoutes from './routes/customerRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/customers', customerRoutes);

export default app;
