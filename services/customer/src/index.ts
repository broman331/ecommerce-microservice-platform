import express from 'express';
import cors from 'cors';
import customerRoutes from './routes/customerRoutes';

const app = express();
const PORT = 3005;

app.use(cors());
app.use(express.json());

// Routes
app.use('/customers', customerRoutes);

app.listen(PORT, () => {
    console.log(`Customer Service running on port ${PORT}`);
});
