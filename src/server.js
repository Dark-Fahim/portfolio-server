import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiters.js';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import seoRoutes from './routes/seoRoutes.js';

await connectDB();

const app = express();

// --- Security & core middleware ---
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api', apiLimiter);

// --- Health check ---
app.get('/api/health', (req, res) => res.json({ success: true, status: 'ok' }));

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/', seoRoutes); // exposes /sitemap.xml and /robots.txt at the API root

// --- Error handling ---
app.use(notFound);
app.use(errorHandler);

// Vercel imports this Express app as a serverless function.
// Start an HTTP listener only when the API runs locally.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

export default app;
