import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import config from './config';
import quizRoutes from './routes/quiz';
import authRoutes from './routes/auth';
import gameRoutes from './routes/game';
import { ragService } from './services/ragService';
import { connectDB } from './config/database';
import { initializeSocketServer } from './services/socketServer';

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration - allow multiple frontend ports
app.use(cors({
  origin: [
    config.frontendUrl,           // http://localhost:5173
    'http://localhost:9002',      // Vite alternate port
    'http://localhost:9003',      // Vite alternate port
    'http://localhost:9004',      // Vite alternate port
    'http://localhost:5174',      // Vite alternate port
    'http://localhost:3000',      // Common dev port
  ],
  credentials: true,
}));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API routes
app.use('/api/quiz', quizRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: config.nodeEnv === 'development' ? err.message : 'Something went wrong',
  });
});

// Initialize RAG system on startup
async function startServer() {
  try {
    console.log('Starting Katapayadi Backend Server...');
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`OpenAI API configured: ${!!config.openaiApiKey}`);
    
    // Connect to MongoDB
    await connectDB();
    
    // Initialize Socket.IO
    initializeSocketServer(httpServer);
    
    // Initialize RAG service
    await ragService.initialize();
    console.log('RAG service initialized successfully');

    // Start server
    httpServer.listen(config.port, () => {
      console.log(`✅ Server running on port ${config.port}`);
      console.log(`📝 API documentation: http://localhost:${config.port}/api/quiz/stats`);
      console.log(`🔗 Frontend: http://localhost:5173 or http://localhost:9002 or http://localhost:9003`);
      console.log(`🔐 Auth endpoints: http://localhost:${config.port}/api/auth/*`);
      console.log(`🎮 Socket.IO: Multiplayer enabled (CORS: multiple ports)`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
