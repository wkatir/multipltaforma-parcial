import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import studentRoutes from './routes/studentRoutes';
import professorRoutes from './routes/professorRoutes';
import courseRoutes from './routes/courseRoutes';
import enrollmentRoutes from './routes/enrollmentRoutes';
import gradeRoutes from './routes/gradeRoutes';
import { errorHandler } from './middleware/errorHandler';
import { authLimiter, apiLimiter } from './middleware/rateLimiter';

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET environment variable is required');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/students', apiLimiter, studentRoutes);
app.use('/api/professors', apiLimiter, professorRoutes);
app.use('/api/courses', apiLimiter, courseRoutes);
app.use('/api/enrollments', apiLimiter, enrollmentRoutes);
app.use('/api/grades', apiLimiter, gradeRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'University Management API - Running' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

