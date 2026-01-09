import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();
await connectDB();

const app = express();
const PORT = process.env.PORT;

// Increase payload limit to allow embedded images (base64) for slides
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

app.use('/api/auth', (await import('./routes/authRoutes.js')).default);
app.use('/api/presentations', (await import('./routes/presentationRoutes.js')).default);
app.use('/api/slides', (await import('./routes/slideRoutes.js')).default);
app.use('/api/templates', (await import('./routes/templateRoutes.js')).default);
app.use('/api/ai', (await import('./routes/aiRoutes.js')).default);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});