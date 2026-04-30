import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import ensureSuperAdmin from './utils/seedAdmin';
import { errorHandler, notFound } from './middleware/error.middleware';

// Routes
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import studyRoutes from './routes/study.routes';
import experienceRoutes from './routes/experience.routes';
import projectRoutes from './routes/project.routes';

dotenv.config();
connectDB().then(() => ensureSuperAdmin());

const app = express();
app.set('trust proxy', 1);

app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({
  origin: function (origin, callback) {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const allowedOrigin = process.env.CLIENT_URL;
    
    if (isDevelopment || !origin || origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/study', studyRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/projects', projectRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export default app;
