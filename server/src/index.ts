import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiRouter } from './routes/apiRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { isSupabaseConfigured } from './services/supabaseClient.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS for frontend development
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-demo-role'],
  })
);

app.use(express.json());

// Root Welcome & Status
app.get('/', (_req, res) => {
  res.json({
    project: 'GRAM SETU API — Probability-Based Rural Resource Requirement Prediction',
    tagline: 'Connecting What Villages Have with What Villages Need.',
    status: 'online',
    mode: isSupabaseConfigured ? 'Supabase Live PostgreSQL' : 'Demonstration Store Mode',
    endpoints: {
      health: '/health',
      villages: '/api/villages',
      resources: '/api/resources',
      assessments: '/api/assessments',
      recommendations: '/api/recommendations',
    },
    message: 'Backend API is running successfully. Connect frontend via Cloudflare Pages.',
  });
});

// Health Check
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'GRAM SETU API & Probability Service',
    mode: isSupabaseConfigured ? 'Supabase Live PostgreSQL' : 'Demonstration Store Mode',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api', apiRouter);

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 GRAM SETU Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 Mode: ${isSupabaseConfigured ? 'Supabase PostgreSQL' : 'Academic Demonstration Mode'}`);
});
