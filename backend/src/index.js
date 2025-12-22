import express from 'express';
import {connectDB} from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();
await connectDB();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', (await import('./routes/authRoutes.js')).default);
app.use('/api/presentation', (await import('./routes/presentationRoutes.js')).default);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});